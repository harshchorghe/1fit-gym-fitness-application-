'use client';

import { useEffect, useState } from 'react';
import { AppUser } from '@/lib/hooks/useUserData';

interface GoalsProgressProps {
  user: AppUser;
}

export default function GoalsProgress({ user }: GoalsProgressProps) {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch real goals from users/{uid}/goals or from user doc
    // Example structure in Firestore:
    // goals: [
    //   { name: "Weekly Workouts", current: 5, target: 6, unit: "sessions" },
    //   ...
    // ]

    setTimeout(() => {
      setGoals([
        { id: 1, name: 'Weekly Workouts', current: 5, target: 6, unit: 'sessions' },
        { id: 2, name: 'Monthly Calories', current: 8600, target: 10000, unit: 'kcal' },
        { id: 3, name: 'Strength Progress', current: 85, target: 100, unit: 'kg' }
      ]);
      setLoading(false);
    }, 900);
  }, [user]);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-2xl">
      <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
        YOUR <span className="text-red-500">GOALS</span>
      </h2>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-16 bg-gray-800 rounded animate-pulse" />
          ))}
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No goals set yet
        </div>
      ) : (
        <div className="space-y-5">
          {goals.map((goal) => {
            const progress = Math.min(100, (goal.current / goal.target) * 100);
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">{goal.name}</span>
                  <span className="text-sm text-gray-400">
                    {goal.current} / {goal.target} {goal.unit}
                  </span>
                </div>
                <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}