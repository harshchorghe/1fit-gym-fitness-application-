'use client';

export default function ProgressScreen() {
  const monthlyStats = [
    { month: 'Jan', workouts: 18, calories: 7200, avgDuration: 52 },
    { month: 'Dec', workouts: 20, calories: 8100, avgDuration: 55 },
    { month: 'Nov', workouts: 16, calories: 6500, avgDuration: 48 },
    { month: 'Oct', workouts: 22, calories: 8800, avgDuration: 58 }
  ];

  const bodyMetrics = [
    { label: 'Weight', current: '82 kg', change: '-2.5 kg', trend: 'down', target: '78 kg' },
    { label: 'Body Fat', current: '18%', change: '-3%', trend: 'down', target: '15%' },
    { label: 'Muscle Mass', current: '42 kg', change: '+1.2 kg', trend: 'up', target: '45 kg' },
    { label: 'BMI', current: '24.8', change: '-0.8', trend: 'down', target: '23.0' }
  ];

  const strengthProgress = [
    { exercise: 'Bench Press', start: '80 kg', current: '120 kg', increase: '+50%', record: '120 kg' },
    { exercise: 'Squat', start: '100 kg', current: '150 kg', increase: '+50%', record: '150 kg' },
    { exercise: 'Deadlift', start: '120 kg', current: '180 kg', increase: '+50%', record: '180 kg' },
    { exercise: 'Overhead Press', start: '40 kg', current: '65 kg', increase: '+62%', record: '65 kg' }
  ];

  const weeklyActivity = [
    { day: 'Mon', minutes: 65, calories: 480 },
    { day: 'Tue', minutes: 45, calories: 320 },
    { day: 'Wed', minutes: 70, calories: 520 },
    { day: 'Thu', minutes: 0, calories: 0 },
    { day: 'Fri', minutes: 55, calories: 410 },
    { day: 'Sat', minutes: 80, calories: 600 },
    { day: 'Sun', minutes: 50, calories: 380 }
  ];

  const achievements = [
    { name: '100 Workouts', date: 'Dec 15, 2025', icon: '💯' },
    { name: '500km Running', date: 'Jan 10, 2026', icon: '🏃' },
    { name: '10,000 Calories', date: 'Jan 20, 2026', icon: '🔥' },
    { name: 'Perfect Week', date: 'Jan 25, 2026', icon: '⭐' }
  ];

  const maxMinutes = Math.max(...weeklyActivity.map(d => d.minutes));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-slide-in">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
          YOUR <span className="text-red-500">PROGRESS</span>
        </h1>
        <p className="text-gray-400">Track your fitness journey and celebrate your wins</p>
      </div>

      {/* Monthly Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-in stagger-1">
        {monthlyStats.map((stat, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br from-gray-900 to-black border p-6 ${
              idx === 0 ? 'border-red-500' : 'border-gray-800 hover:border-red-500'
            } transition-all`}
          >
            <div className="text-sm text-gray-500 mb-2">{stat.month}</div>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-600">Workouts</div>
                <div className="text-2xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  {stat.workouts}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600">Calories</div>
                <div className="text-lg font-bold">{stat.calories}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600">Avg Duration</div>
                <div className="text-lg font-bold">{stat.avgDuration} min</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Body Metrics */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 animate-slide-in stagger-2">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
          BODY <span className="text-red-500">METRICS</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {bodyMetrics.map((metric, idx) => (
            <div key={idx} className="bg-black/50 border border-gray-800 p-4 hover:border-red-500 transition-all">
              <div className="text-sm text-gray-500 mb-2">{metric.label}</div>
              <div className="text-3xl font-bold text-red-500 mb-1" style={{ fontFamily: 'Oswald, sans-serif' }}>
                {metric.current}
              </div>
              <div className={`text-sm font-bold mb-2 ${metric.trend === 'down' ? 'text-green-500' : 'text-blue-500'}`}>
                {metric.trend === 'down' ? '↓' : '↑'} {metric.change}
              </div>
              <div className="text-xs text-gray-600">Target: {metric.target}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
            THIS WEEK'S <span className="text-red-500">ACTIVITY</span>
          </h2>
          <div className="space-y-3">
            {weeklyActivity.map((day, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold">{day.day}</span>
                  <span className="text-gray-400">{day.minutes} min • {day.calories} cal</span>
                </div>
                <div className="w-full bg-gray-800 h-8 rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${(day.minutes / maxMinutes) * 100}%` }}
                  >
                    {day.minutes > 0 && <span className="text-xs font-bold">{day.minutes}m</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Weekly Total</span>
              <span className="font-bold text-red-500">
                {weeklyActivity.reduce((sum, day) => sum + day.minutes, 0)} min • 
                {weeklyActivity.reduce((sum, day) => sum + day.calories, 0)} cal
              </span>
            </div>
          </div>
        </div>

        {/* Strength Progress */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
            STRENGTH <span className="text-red-500">PROGRESS</span>
          </h2>
          <div className="space-y-4">
            {strengthProgress.map((exercise, idx) => (
              <div key={idx} className="bg-black/50 border border-gray-800 p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold">{exercise.exercise}</h3>
                  <span className="text-xs bg-green-500 text-black px-2 py-1 rounded font-bold">
                    {exercise.increase}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="text-xs text-gray-500">Started</div>
                    <div className="font-bold">{exercise.start}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Current</div>
                    <div className="font-bold text-red-500">{exercise.current}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Record</div>
                    <div className="font-bold text-yellow-500">{exercise.record}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
          RECENT <span className="text-red-500">ACHIEVEMENTS</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-yellow-500/20 to-black border border-yellow-500 p-4 text-center hover:scale-105 transition-transform"
            >
              <div className="text-5xl mb-2">{achievement.icon}</div>
              <div className="font-bold mb-1">{achievement.name}</div>
              <div className="text-xs text-gray-500">{achievement.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Goals Progress */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
          CURRENT <span className="text-red-500">GOALS</span>
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Monthly Workout Target</span>
              <span className="text-sm text-gray-400">18/20 sessions</span>
            </div>
            <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all" style={{ width: '90%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Calorie Burn Goal</span>
              <span className="text-sm text-gray-400">7,200/8,000 kcal</span>
            </div>
            <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all" style={{ width: '90%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Weight Loss Target</span>
              <span className="text-sm text-gray-400">2.5/4.0 kg</span>
            </div>
            <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all" style={{ width: '62.5%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}