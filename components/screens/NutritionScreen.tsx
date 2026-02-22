'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import {
  getTodayLoggedMeals,
  getMealPlans,
  logMealPlan,
  LoggedMeal,
  MealPlan
} from '@/lib/firestore/meals';

export default function NutritionScreen() {
  const [todayMeals, setTodayMeals] = useState<LoggedMeal[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingPlan, setAddingPlan] = useState<string | null>(null);

  const [todayMacros, setTodayMacros] = useState({
    calories: { consumed: 0, target: 2200, remaining: 2200 },
    protein:  { consumed: 0, target: 180, unit: 'g' },
    carbs:    { consumed: 0, target: 220, unit: 'g' },
    fats:     { consumed: 0, target: 70,  unit: 'g' }
  });

  // ────────────────────────────────────────────────
  // Load initial data when user is authenticated
  // ────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setError('Please sign in to view nutrition');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [meals, plans] = await Promise.all([
          getTodayLoggedMeals(),
          getMealPlans()
        ]);

        setTodayMeals(meals);
        setMealPlans(plans);
        updateMacros(meals);
      } catch (err: any) {
        console.error('Nutrition load error:', err);
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateMacros = (meals: LoggedMeal[]) => {
    const total = {
      calories: meals.reduce((sum, m) => sum + m.calories, 0),
      protein:  meals.reduce((sum, m) => sum + m.protein,  0),
      carbs:    meals.reduce((sum, m) => sum + m.carbs,    0),
      fats:     meals.reduce((sum, m) => sum + m.fats,     0),
    };

    setTodayMacros({
      calories: {
        consumed: total.calories,
        target: 2200,
        remaining: Math.max(0, 2200 - total.calories)
      },
      protein:  { consumed: total.protein,  target: 180,  unit: 'g' },
      carbs:    { consumed: total.carbs,    target: 220,  unit: 'g' },
      fats:     { consumed: total.fats,     target: 70,   unit: 'g' }
    });
  };

  const handleSelectPlan = async (plan: MealPlan) => {
    if (addingPlan) return; // prevent double click

    setAddingPlan(plan.id);
    try {
      await logMealPlan(plan);

      // Refresh data
      const updatedMeals = await getTodayLoggedMeals();
      setTodayMeals(updatedMeals);
      updateMacros(updatedMeals);

      alert(`Added "${plan.name}" to today's meals`);
    } catch (err: any) {
      console.error('Failed to add plan:', err);
      alert(`Could not add plan: ${err.message}`);
    } finally {
      setAddingPlan(null);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Loading nutrition...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-400">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
          NUTRITION <span className="text-red-500">TRACKER</span>
        </h1>
        <p className="text-gray-400">Fuel your body for peak performance</p>
      </div>

      {/* Macro cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-red-500/20 to-black border border-red-500/40 p-6 rounded-xl">
          <div className="text-sm text-gray-400">Calories</div>
          <div className="text-4xl font-bold text-red-500">{todayMacros.calories.consumed}</div>
          <div className="text-xs text-gray-500 mt-1">
            of {todayMacros.calories.target} • {todayMacros.calories.remaining} left
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-black border border-blue-500/40 p-6 rounded-xl">
          <div className="text-sm text-gray-400">Protein</div>
          <div className="text-4xl font-bold text-blue-500">{todayMacros.protein.consumed}</div>
          <div className="text-xs text-gray-500 mt-1">target {todayMacros.protein.target}g</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-black border border-yellow-500/40 p-6 rounded-xl">
          <div className="text-sm text-gray-400">Carbs</div>
          <div className="text-4xl font-bold text-yellow-500">{todayMacros.carbs.consumed}</div>
          <div className="text-xs text-gray-500 mt-1">target {todayMacros.carbs.target}g</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-black border border-orange-500/40 p-6 rounded-xl">
          <div className="text-sm text-gray-400">Fats</div>
          <div className="text-4xl font-bold text-orange-500">{todayMacros.fats.consumed}</div>
          <div className="text-xs text-gray-500 mt-1">target {todayMacros.fats.target}g</div>
        </div>
      </div>

      {/* Today's Meals */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6">TODAY'S MEALS</h2>

        {todayMeals.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No meals logged today. Select a plan or add manually.</p>
        ) : (
          <div className="space-y-4">
            {todayMeals.map(meal => (
              <div
                key={meal.id}
                className="border-l-4 border-green-500 bg-green-900/10 p-5 rounded-xl"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-xl">{meal.name}</h3>
                    <p className="text-gray-400 text-sm mt-0.5">
                      {meal.mealType} • {meal.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-500">{meal.calories}</div>
                    <div className="text-xs text-gray-500">kcal</div>
                  </div>
                </div>

                <p className="text-sm text-gray-300 mt-3">
                  {meal.items.join(' • ')}
                </p>

                <div className="flex gap-5 mt-4 text-sm text-gray-300">
                  <span>P: <strong>{meal.protein}g</strong></span>
                  <span>C: <strong>{meal.carbs}g</strong></span>
                  <span>F: <strong>{meal.fats}g</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Meal Plans */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6">AVAILABLE MEAL PLANS</h2>

        {mealPlans.length === 0 ? (
          <p className="text-gray-400 text-center py-12">
            No meal plans available yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mealPlans.map(plan => (
              <div
                key={plan.id}
                className="border border-red-500/30 bg-red-950/10 p-6 rounded-xl hover:border-red-500/70 transition-all"
              >
                <h3 className="text-xl font-bold mb-3 text-red-400">{plan.name}</h3>

                <div className="space-y-1.5 text-sm text-gray-300 mb-5">
                  <div>📊 {plan.calories} kcal</div>
                  <div>💪 {plan.protein}g protein</div>
                  {plan.carbs !== undefined && <div>🍞 {plan.carbs}g carbs</div>}
                  {plan.fats  !== undefined && <div>🧈 {plan.fats}g fats</div>}
                  <div>⏳ {plan.duration}</div>
                </div>

                <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                  {plan.description}
                </p>

                <button
                  className={`
                    w-full py-3 rounded-lg font-semibold transition-colors
                    ${addingPlan === plan.id
                      ? 'bg-gray-700 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                    }
                  `}
                  onClick={() => handleSelectPlan(plan)}
                  disabled={addingPlan === plan.id}
                >
                  {addingPlan === plan.id ? 'Adding...' : 'Select Plan'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}