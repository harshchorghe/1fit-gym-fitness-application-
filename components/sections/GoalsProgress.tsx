'use client';

export default function GoalsProgress() {
  const goals = [
    { id: 1, name: 'Weekly Workouts', current: 5, target: 6, unit: 'sessions' },
    { id: 2, name: 'Monthly Calories', current: 8600, target: 10000, unit: 'kcal' },
    { id: 3, name: 'Strength Progress', current: 85, target: 100, unit: 'kg' }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
      <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
        YOUR <span className="text-red-500">GOALS</span>
      </h2>
      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = (goal.current / goal.target) * 100;
          return (
            <div key={goal.id}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold">{goal.name}</span>
                <span className="text-sm text-gray-400">{goal.current}/{goal.target} {goal.unit}</span>
              </div>
              <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}