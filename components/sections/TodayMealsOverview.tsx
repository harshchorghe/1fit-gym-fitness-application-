'use client';

import { useEffect, useState } from 'react';
import { AppUser } from '@/lib/hooks/useUserData';
import { db } from '@/lib/firebase';  // Make sure firebase is exported
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from 'firebase/firestore';

interface TodayMealsProps {
  user: AppUser;
}

interface LoggedMeal {
  id: string;
  name: string;
  mealType: string;     // e.g. "Breakfast", "Lunch", "Dinner", "Snack"
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  items: string[];      // e.g. ["Oats", "Banana", "Protein Shake"]
  date: string;         // or Timestamp – depending on your data
  loggedAt?: Timestamp;
}

export default function TodayMeals({ user }: TodayMealsProps) {
  const [meals, setMeals] = useState<LoggedMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      setError('Please sign in to view meals');
      return;
    }

    async function fetchTodayMeals() {
      try {
        setLoading(true);
        setError(null);

        // Adjust collection path if different (e.g. users/{uid}/loggedMeals)
        const mealsRef = collection(db, `users/${user.uid}/loggedMeals`);

        // Query for today's meals – adjust field names if needed
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const q = query(
          mealsRef,
          where('loggedAt', '>=', Timestamp.fromDate(todayStart)),
          where('loggedAt', '<=', Timestamp.fromDate(todayEnd)),
          orderBy('loggedAt', 'asc')   // or 'desc' if you prefer newest first
        );

        const snapshot = await getDocs(q);

        const todayMeals = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Unnamed Meal',
            mealType: data.mealType || '—',
            calories: data.calories || 0,
            protein: data.protein || 0,
            carbs: data.carbs || 0,
            fats: data.fats || 0,
            items: data.items || [],
            date: data.date || todayStart.toLocaleDateString(),
            loggedAt: data.loggedAt as Timestamp,
          } satisfies LoggedMeal;
        });

        setMeals(todayMeals);
      } catch (err: any) {
        console.error('Failed to load today\'s meals:', err);
        setError('Could not load today\'s meals');
      } finally {
        setLoading(false);
      }
    }

    fetchTodayMeals();
  }, [user?.uid]);

  // Optional: total macros for the day (shown in header or summary)
  const totalMacros = {
    calories: meals.reduce((sum, m) => sum + m.calories, 0),
    protein: meals.reduce((sum, m) => sum + m.protein, 0),
    carbs: meals.reduce((sum, m) => sum + m.carbs, 0),
    fats: meals.reduce((sum, m) => sum + m.fats, 0),
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-2xl h-full">
      <h2 className="text-2xl font-bold mb-5" style={{ fontFamily: 'Oswald, sans-serif' }}>
        TODAY'S <span className="text-red-500">MEALS</span>
      </h2>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-800/70 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-400">{error}</div>
      ) : meals.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No meals logged today yet
          <br />
          <span className="text-sm">Log meals or select a plan to get started</span>
        </div>
      ) : (
        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {/* Optional summary at top */}
          <div className="bg-black/60 border border-gray-700 p-4 rounded-xl mb-4">
            <div className="text-sm text-gray-400">Daily Total</div>
            <div className="text-xl font-bold text-red-500">
              {totalMacros.calories} kcal
            </div>
            <div className="text-xs text-gray-500 mt-1">
              P {totalMacros.protein}g • C {totalMacros.carbs}g • F {totalMacros.fats}g
            </div>
          </div>

          {meals.map((meal) => (
            <div
              key={meal.id}
              className="bg-black/50 border border-gray-800 p-5 rounded-xl hover:border-green-600/60 transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">{meal.name}</h3>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {meal.mealType} • {meal.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-500">
                    {meal.calories}
                  </div>
                  <div className="text-xs text-gray-500">kcal</div>
                </div>
              </div>

              <div className="text-sm text-gray-300 mb-3">
                {meal.items.length > 0 ? meal.items.join(' • ') : 'No items listed'}
              </div>

              <div className="flex gap-4 text-xs text-gray-400">
                <span>P: <strong className="text-blue-400">{meal.protein}g</strong></span>
                <span>C: <strong className="text-yellow-400">{meal.carbs}g</strong></span>
                <span>F: <strong className="text-orange-400">{meal.fats}g</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}