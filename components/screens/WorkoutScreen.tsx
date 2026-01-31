'use client';

export default function WorkoutsScreen() {
  const workoutCategories = [
    { id: 1, name: 'Strength Training', icon: '🏋️', count: 45, color: 'from-red-500 to-orange-500' },
    { id: 2, name: 'Cardio', icon: '🏃', count: 32, color: 'from-blue-500 to-cyan-500' },
    { id: 3, name: 'HIIT', icon: '⚡', count: 28, color: 'from-yellow-500 to-orange-500' },
    { id: 4, name: 'Yoga & Flexibility', icon: '🧘', count: 21, color: 'from-purple-500 to-pink-500' },
    { id: 5, name: 'CrossFit', icon: '💪', count: 18, color: 'from-green-500 to-teal-500' },
    { id: 6, name: 'Boxing', icon: '🥊', count: 15, color: 'from-red-600 to-red-400' }
  ];

  const recommendedWorkouts = [
    {
      id: 1,
      name: 'Full Body Blast',
      duration: '45 min',
      difficulty: 'Intermediate',
      calories: 420,
      equipment: ['Dumbbells', 'Bench'],
      trainer: 'Marcus Steel',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Cardio Burn',
      duration: '30 min',
      difficulty: 'Beginner',
      calories: 350,
      equipment: ['None'],
      trainer: 'Sarah Burns',
      rating: 4.9
    },
    {
      id: 3,
      name: 'Upper Body Power',
      duration: '50 min',
      difficulty: 'Advanced',
      calories: 480,
      equipment: ['Barbell', 'Dumbbells', 'Pull-up Bar'],
      trainer: 'Jake Titan',
      rating: 4.7
    },
    {
      id: 4,
      name: 'Core Crusher',
      duration: '25 min',
      difficulty: 'Intermediate',
      calories: 280,
      equipment: ['Mat'],
      trainer: 'Luna Peace',
      rating: 4.6
    }
  ];

  const myWorkouts = [
    { id: 1, name: 'Morning Routine', exercises: 12, lastDone: 'Today', isFavorite: true },
    { id: 2, name: 'Leg Day Beast', exercises: 15, lastDone: '2 days ago', isFavorite: true },
    { id: 3, name: 'Quick Cardio', exercises: 8, lastDone: 'Yesterday', isFavorite: false },
    { id: 4, name: 'Push Day', exercises: 14, lastDone: '3 days ago', isFavorite: true }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-slide-in">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
          YOUR <span className="text-red-500">WORKOUTS</span>
        </h1>
        <p className="text-gray-400">Find the perfect workout for your goals</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-slide-in stagger-1">
        <button className="bg-gradient-to-br from-red-500 to-red-600 p-6 hover:scale-105 transition-transform">
          <div className="text-3xl mb-2">⚡</div>
          <div className="text-sm font-bold">Quick Start</div>
        </button>
        <button className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 hover:border-red-500 transition-all">
          <div className="text-3xl mb-2">📋</div>
          <div className="text-sm font-bold">Custom Workout</div>
        </button>
        <button className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 hover:border-red-500 transition-all">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-sm font-bold">Set Goals</div>
        </button>
        <button className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 hover:border-red-500 transition-all">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-sm font-bold">Track Progress</div>
        </button>
      </div>

      {/* Workout Categories */}
      <div className="animate-slide-in stagger-2">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
          WORKOUT <span className="text-red-500">CATEGORIES</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {workoutCategories.map((category) => (
            <button
              key={category.id}
              className={`bg-gradient-to-br ${category.color} p-6 hover:scale-105 transition-transform text-center`}
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <div className="text-sm font-bold mb-1">{category.name}</div>
              <div className="text-xs opacity-80">{category.count} workouts</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recommended for You */}
      <div className="animate-slide-in stagger-3">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
          RECOMMENDED <span className="text-red-500">FOR YOU</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedWorkouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 hover:border-red-500 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    {workout.name}
                  </h3>
                  <div className="text-sm text-gray-400">with {workout.trainer}</div>
                </div>
                <div className="flex items-center space-x-1 bg-yellow-500/20 px-2 py-1 rounded">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-sm font-bold">{workout.rating}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Duration</div>
                  <div className="text-sm font-bold text-red-500">{workout.duration}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Difficulty</div>
                  <div className="text-sm font-bold text-red-500">{workout.difficulty}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Calories</div>
                  <div className="text-sm font-bold text-red-500">{workout.calories}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-2">Equipment Needed:</div>
                <div className="flex flex-wrap gap-2">
                  {workout.equipment.map((item, idx) => (
                    <span key={idx} className="text-xs bg-gray-800 px-2 py-1 rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button className="bg-red-500 hover:bg-red-600 py-2 text-sm font-bold transition-colors">
                  START NOW
                </button>
                <button className="border border-gray-700 hover:border-red-500 py-2 text-sm font-bold transition-colors">
                  VIEW DETAILS
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Workouts */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>
            MY <span className="text-red-500">WORKOUTS</span>
          </h2>
          <button className="text-red-500 hover:text-red-400 text-sm font-bold">+ CREATE NEW</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {myWorkouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-black/50 border border-gray-800 p-4 hover:border-red-500 transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold">{workout.name}</h3>
                <button className="text-xl">
                  {workout.isFavorite ? '❤️' : '🤍'}
                </button>
              </div>
              <div className="text-sm text-gray-400 space-y-1">
                <div>{workout.exercises} exercises</div>
                <div className="text-xs">Last: {workout.lastDone}</div>
              </div>
              <button className="w-full mt-3 bg-gray-800 hover:bg-red-500 py-2 text-sm font-bold transition-colors">
                START
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}