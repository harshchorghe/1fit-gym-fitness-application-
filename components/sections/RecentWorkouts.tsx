'use client';

export default function RecentWorkouts() {
  const recentWorkouts = [
    { id: 1, name: 'Upper Body Blast', date: 'Today', duration: '58 min', calories: 420, sets: 24 },
    { id: 2, name: 'Leg Day Destroyer', date: 'Yesterday', duration: '62 min', calories: 510, sets: 28 },
    { id: 3, name: 'Core & Cardio', date: '2 days ago', duration: '45 min', calories: 380, sets: 18 },
    { id: 4, name: 'Full Body Power', date: '3 days ago', duration: '55 min', calories: 465, sets: 22 }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
      <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
        RECENT <span className="text-red-500">WORKOUTS</span>
      </h2>
      <div className="space-y-3">
        {recentWorkouts.map((workout) => (
          <div key={workout.id} className="flex items-center justify-between p-4 bg-black/50 border border-gray-800 hover:border-red-500 transition-all">
            <div>
              <h3 className="font-bold mb-1">{workout.name}</h3>
              <div className="text-xs text-gray-500">{workout.date}</div>
            </div>
            <div className="text-right">
              <div className="text-red-500 font-bold">{workout.duration}</div>
              <div className="text-xs text-gray-500">{workout.calories} kcal • {workout.sets} sets</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}