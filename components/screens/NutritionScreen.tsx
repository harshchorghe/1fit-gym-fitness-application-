'use client';

export default function NutritionScreen() {
  const todayMacros = {
    calories: { consumed: 1850, target: 2200, remaining: 350 },
    protein: { consumed: 145, target: 180, unit: 'g' },
    carbs: { consumed: 185, target: 220, unit: 'g' },
    fats: { consumed: 62, target: 70, unit: 'g' }
  };

  const todayMeals = [
    {
      id: 1,
      name: 'Breakfast',
      time: '07:30 AM',
      items: ['Oatmeal with Berries', 'Greek Yogurt', 'Almonds'],
      calories: 450,
      protein: 28,
      carbs: 58,
      fats: 12,
      logged: true
    },
    {
      id: 2,
      name: 'Mid-Morning Snack',
      time: '10:30 AM',
      items: ['Protein Shake', 'Banana'],
      calories: 280,
      protein: 35,
      carbs: 32,
      fats: 5,
      logged: true
    },
    {
      id: 3,
      name: 'Lunch',
      time: '01:00 PM',
      items: ['Grilled Chicken Breast', 'Brown Rice', 'Mixed Vegetables', 'Olive Oil'],
      calories: 620,
      protein: 52,
      carbs: 65,
      fats: 18,
      logged: true
    },
    {
      id: 4,
      name: 'Afternoon Snack',
      time: '04:00 PM',
      items: ['Apple', 'Peanut Butter'],
      calories: 210,
      protein: 8,
      carbs: 28,
      fats: 9,
      logged: true
    },
    {
      id: 5,
      name: 'Dinner',
      time: '07:30 PM',
      items: ['Salmon', 'Sweet Potato', 'Broccoli'],
      calories: 290,
      protein: 22,
      carbs: 2,
      fats: 18,
      logged: false
    }
  ];

  const mealPlans = [
    {
      id: 1,
      name: 'Muscle Gain Plan',
      calories: 2800,
      protein: 200,
      description: 'High protein, moderate carbs for muscle building',
      duration: '4 weeks'
    },
    {
      id: 2,
      name: 'Fat Loss Plan',
      calories: 1800,
      protein: 150,
      description: 'Calorie deficit with high protein to preserve muscle',
      duration: '6 weeks'
    },
    {
      id: 3,
      name: 'Maintenance Plan',
      calories: 2200,
      protein: 180,
      description: 'Balanced nutrition to maintain current physique',
      duration: 'Ongoing'
    }
  ];

  const waterIntake = {
    current: 2.1,
    target: 3.0,
    unit: 'liters'
  };

  const weeklyCalories = [
    { day: 'Mon', calories: 2100 },
    { day: 'Tue', calories: 1950 },
    { day: 'Wed', calories: 2250 },
    { day: 'Thu', calories: 2050 },
    { day: 'Fri', calories: 1850 },
    { day: 'Sat', calories: 2300 },
    { day: 'Sun', calories: 2150 }
  ];

  const nutritionTips = [
    { icon: '💧', tip: 'Drink water before meals to help control portions' },
    { icon: '🥗', tip: 'Fill half your plate with vegetables' },
    { icon: '⏰', tip: 'Eat protein within 30 minutes post-workout' },
    { icon: '😴', tip: 'Avoid heavy meals 3 hours before bedtime' }
  ];

  const maxCalories = Math.max(...weeklyCalories.map(d => d.calories));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-slide-in">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
          NUTRITION <span className="text-red-500">TRACKER</span>
        </h1>
        <p className="text-gray-400">Fuel your body for peak performance</p>
      </div>

      {/* Today's Macro Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-in stagger-1">
        <div className="bg-gradient-to-br from-red-500/20 to-black border border-red-500 p-6">
          <div className="text-gray-400 text-sm mb-2 uppercase tracking-wider">Calories</div>
          <div className="text-3xl font-bold text-red-500 mb-1" style={{ fontFamily: 'Oswald, sans-serif' }}>
            {todayMacros.calories.consumed}
          </div>
          <div className="text-xs text-gray-500">of {todayMacros.calories.target} • {todayMacros.calories.remaining} left</div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 hover:border-red-500 transition-all">
          <div className="text-gray-400 text-sm mb-2 uppercase tracking-wider">Protein</div>
          <div className="text-3xl font-bold text-red-500 mb-1" style={{ fontFamily: 'Oswald, sans-serif' }}>
            {todayMacros.protein.consumed}{todayMacros.protein.unit}
          </div>
          <div className="text-xs text-gray-500">of {todayMacros.protein.target}{todayMacros.protein.unit}</div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 hover:border-red-500 transition-all">
          <div className="text-gray-400 text-sm mb-2 uppercase tracking-wider">Carbs</div>
          <div className="text-3xl font-bold text-red-500 mb-1" style={{ fontFamily: 'Oswald, sans-serif' }}>
            {todayMacros.carbs.consumed}{todayMacros.carbs.unit}
          </div>
          <div className="text-xs text-gray-500">of {todayMacros.carbs.target}{todayMacros.carbs.unit}</div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 hover:border-red-500 transition-all">
          <div className="text-gray-400 text-sm mb-2 uppercase tracking-wider">Fats</div>
          <div className="text-3xl font-bold text-red-500 mb-1" style={{ fontFamily: 'Oswald, sans-serif' }}>
            {todayMacros.fats.consumed}{todayMacros.fats.unit}
          </div>
          <div className="text-xs text-gray-500">of {todayMacros.fats.target}{todayMacros.fats.unit}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Meals */}
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 animate-slide-in stagger-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>
              TODAY'S <span className="text-red-500">MEALS</span>
            </h2>
            <button className="text-red-500 hover:text-red-400 text-sm font-bold">+ ADD MEAL</button>
          </div>
          <div className="space-y-3">
            {todayMeals.map((meal) => (
              <div
                key={meal.id}
                className={`border-l-4 p-4 ${
                  meal.logged 
                    ? 'border-green-500 bg-green-500/10' 
                    : 'border-gray-500 bg-gray-800/50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{meal.name}</h3>
                    <div className="text-sm text-gray-400">{meal.time}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-red-500">{meal.calories}</div>
                    <div className="text-xs text-gray-500">calories</div>
                  </div>
                </div>
                <div className="text-sm text-gray-300 mb-2">
                  {meal.items.join(' • ')}
                </div>
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>P: {meal.protein}g</span>
                  <span>C: {meal.carbs}g</span>
                  <span>F: {meal.fats}g</span>
                </div>
                {!meal.logged && (
                  <button className="mt-3 w-full bg-red-500 hover:bg-red-600 py-2 text-sm font-bold transition-colors">
                    LOG MEAL
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Water Intake & Quick Actions */}
        <div className="space-y-4">
          {/* Water Intake */}
          <div className="bg-gradient-to-br from-blue-500/20 to-black border border-blue-500 p-6 animate-slide-in stagger-3">
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
              WATER <span className="text-blue-400">INTAKE</span>
            </h3>
            <div className="text-center mb-4">
              <div className="text-5xl mb-2">💧</div>
              <div className="text-3xl font-bold text-blue-400" style={{ fontFamily: 'Oswald, sans-serif' }}>
                {waterIntake.current}L
              </div>
              <div className="text-sm text-gray-400">of {waterIntake.target}L</div>
            </div>
            <div className="w-full bg-gray-800 h-4 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all"
                style={{ width: `${(waterIntake.current / waterIntake.target) * 100}%` }}
              ></div>
            </div>
            <button className="w-full bg-blue-500 hover:bg-blue-600 py-3 font-bold transition-colors">
              + ADD GLASS
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
            <h3 className="text-lg font-bold mb-3" style={{ fontFamily: 'Oswald, sans-serif' }}>
              QUICK <span className="text-red-500">ACTIONS</span>
            </h3>
            <div className="space-y-2">
              <button className="w-full border border-gray-700 hover:border-red-500 p-3 text-sm font-bold transition-all text-left flex items-center space-x-2">
                <span>📸</span>
                <span>Scan Food</span>
              </button>
              <button className="w-full border border-gray-700 hover:border-red-500 p-3 text-sm font-bold transition-all text-left flex items-center space-x-2">
                <span>📝</span>
                <span>Manual Entry</span>
              </button>
              <button className="w-full border border-gray-700 hover:border-red-500 p-3 text-sm font-bold transition-all text-left flex items-center space-x-2">
                <span>🍽️</span>
                <span>Meal Plans</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Calorie Trend */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
          WEEKLY <span className="text-red-500">TREND</span>
        </h2>
        <div className="space-y-3">
          {weeklyCalories.map((day, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold">{day.day}</span>
                <span className="text-gray-400">{day.calories} kcal</span>
              </div>
              <div className="w-full bg-gray-800 h-6 rounded overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: `${(day.calories / maxCalories) * 100}%` }}
                >
                  <span className="text-xs font-bold">{day.calories}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex justify-between">
            <span className="text-gray-400">Weekly Average</span>
            <span className="font-bold text-red-500">
              {Math.round(weeklyCalories.reduce((sum, day) => sum + day.calories, 0) / 7)} kcal/day
            </span>
          </div>
        </div>
      </div>

      {/* Meal Plans */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
          MEAL <span className="text-red-500">PLANS</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mealPlans.map((plan) => (
            <div key={plan.id} className="bg-black/50 border border-gray-800 p-4 hover:border-red-500 transition-all">
              <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
              <div className="text-sm text-gray-400 mb-3">{plan.description}</div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Calories</span>
                  <span className="font-bold">{plan.calories}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Protein</span>
                  <span className="font-bold">{plan.protein}g</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-bold">{plan.duration}</span>
                </div>
              </div>
              <button className="w-full bg-gray-800 hover:bg-red-500 py-2 text-sm font-bold transition-colors">
                VIEW PLAN
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Nutrition Tips */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
          NUTRITION <span className="text-red-500">TIPS</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nutritionTips.map((item, idx) => (
            <div key={idx} className="flex items-start space-x-3 bg-black/50 border border-gray-800 p-4">
              <div className="text-3xl">{item.icon}</div>
              <div className="text-sm text-gray-300">{item.tip}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}