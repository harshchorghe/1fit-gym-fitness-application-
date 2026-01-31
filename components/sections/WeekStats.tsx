'use client';

export default function WeekStats() {
  const weekStats = {
    workouts: 5,
    totalTime: '4h 32m',
    calories: 2150,
    avgHeartRate: 142
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-in stagger-1">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 hover:border-red-500 transition-all">
        <div className="text-gray-500 text-sm mb-2 uppercase tracking-wider">Workouts</div>
        <div className="text-3xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
          {weekStats.workouts}
        </div>
        <div className="text-xs text-gray-600 mt-1">This week</div>
      </div>
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 hover:border-red-500 transition-all">
        <div className="text-gray-500 text-sm mb-2 uppercase tracking-wider">Time</div>
        <div className="text-3xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
          {weekStats.totalTime}
        </div>
        <div className="text-xs text-gray-600 mt-1">Training time</div>
      </div>
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 hover:border-red-500 transition-all">
        <div className="text-gray-500 text-sm mb-2 uppercase tracking-wider">Calories</div>
        <div className="text-3xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
          {weekStats.calories}
        </div>
        <div className="text-xs text-gray-600 mt-1">Burned</div>
      </div>
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 hover:border-red-500 transition-all">
        <div className="text-gray-500 text-sm mb-2 uppercase tracking-wider">Avg HR</div>
        <div className="text-3xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
          {weekStats.avgHeartRate}
        </div>
        <div className="text-xs text-gray-600 mt-1">BPM</div>
      </div>
    </div>
  );
}