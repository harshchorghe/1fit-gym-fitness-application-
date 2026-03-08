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

  // ── AI Generation States ──
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [savingPlan, setSavingPlan] = useState(false);

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) {
      setAiError('Please describe your desired meal plan (goals, preferences, restrictions...)');
      return;
    }

    setAiLoading(true);
    setAiError(null);
    setGeneratedPlan(null);

    try {
      const res = await fetch('/api/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate meal plan');
      }

      const { reply } = await res.json();
      const parsed = JSON.parse(reply);

      setGeneratedPlan(parsed);
    } catch (err: any) {
      setAiError(err.message || 'Something went wrong. Try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const saveGeneratedPlan = async () => {
    if (!generatedPlan) return;

    setSavingPlan(true);
    try {
      // Format the generated plan to match MealPlan interface
      const planToSave: MealPlan = {
        id: '', // Will be set by Firestore
        name: generatedPlan.title,
        calories: generatedPlan.calories,
        protein: generatedPlan.protein,
        carbs: generatedPlan.carbs,
        fats: generatedPlan.fats,
        description: `AI-generated meal plan: ${generatedPlan.title}`,
        duration: '1 day',
        meals: generatedPlan.meals?.map((meal: any) => ({
          mealType: meal.name,
          name: meal.name,
          items: meal.items,
          calories: meal.calories,
          protein: meal.macros?.protein || 0,
          carbs: meal.macros?.carbs || 0,
          fats: meal.macros?.fats || 0,
        })),
      };

      await logMealPlan(planToSave);

      // Refresh data
      const updatedMeals = await getTodayLoggedMeals();
      setTodayMeals(updatedMeals);
      updateMacros(updatedMeals);

      setGeneratedPlan(null);
      setAiPrompt('');
      alert('Meal plan logged for today!');
    } catch (err: any) {
      console.error('Failed to save plan:', err);
      alert(`Could not save plan: ${err.message}`);
    } finally {
      setSavingPlan(false);
    }
  };

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

      {/* AI Meal Plan Generator */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Oswald, sans-serif' }}>
          AI <span className="text-green-500">MEAL PLAN</span> GENERATOR
        </h2>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-4">
          <h3 className="text-xl font-bold text-center text-green-400">Generate with Gemini AI ⚡</h3>
          <p className="text-sm text-gray-400 text-center">
            Tell me what you want — I'll create a personalized meal plan for you!
          </p>

          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Example: High protein meal plan for muscle gain, 2500 calories, vegetarian, no dairy, focus on weightlifting recovery"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 min-h-[110px] text-gray-200 focus:outline-none focus:border-green-500 resize-y"
          />

          {aiError && <p className="text-red-400 text-sm text-center">{aiError}</p>}

          <button
            type="button"
            onClick={generateWithAI}
            disabled={aiLoading || !aiPrompt.trim()}
            className={`w-full py-3 rounded-lg font-bold transition-all ${
              aiLoading
                ? 'bg-gray-600 cursor-wait'
                : 'bg-green-600 hover:bg-green-700 active:scale-98'
            }`}
          >
            {aiLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </span>
            ) : (
              'Generate Meal Plan'
            )}
          </button>
        </div>

        {generatedPlan && (
          <div className="mt-6 bg-green-900/20 border border-green-500/30 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-green-400">🎉 Generated Meal Plan</h3>
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 space-y-4">
              <h4 className="text-xl font-bold text-green-400">{generatedPlan.title}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-gray-800 p-3 rounded">
                  <div className="text-sm text-gray-400">Calories</div>
                  <div className="text-lg font-bold text-red-500">{generatedPlan.calories}</div>
                </div>
                <div className="bg-gray-800 p-3 rounded">
                  <div className="text-sm text-gray-400">Protein</div>
                  <div className="text-lg font-bold text-blue-500">{generatedPlan.protein}g</div>
                </div>
                <div className="bg-gray-800 p-3 rounded">
                  <div className="text-sm text-gray-400">Carbs</div>
                  <div className="text-lg font-bold text-yellow-500">{generatedPlan.carbs}g</div>
                </div>
                <div className="bg-gray-800 p-3 rounded">
                  <div className="text-sm text-gray-400">Fats</div>
                  <div className="text-lg font-bold text-orange-500">{generatedPlan.fats}g</div>
                </div>
              </div>

              <div className="space-y-4">
                {generatedPlan.meals?.map((meal: any, index: number) => (
                  <div key={index} className="border-l-4 border-green-500 bg-green-900/10 p-4 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-bold text-lg">{meal.name}</h5>
                      <span className="text-sm text-gray-400">{meal.time}</span>
                    </div>
                    <ul className="text-sm text-gray-300 mb-2">
                      {meal.items?.map((item: string, i: number) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                    <div className="flex gap-4 text-xs text-gray-400">
                      <span>{meal.calories} kcal</span>
                      <span>P: {meal.macros?.protein}g</span>
                      <span>C: {meal.macros?.carbs}g</span>
                      <span>F: {meal.macros?.fats}g</span>
                    </div>
                  </div>
                ))}
              </div>

              {generatedPlan.notes && (
                <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded">
                  <h6 className="font-bold text-blue-400 mb-2">💡 Nutrition Notes</h6>
                  <ul className="text-sm text-gray-300">
                    {generatedPlan.notes.map((note: string, i: number) => (
                      <li key={i}>• {note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setGeneratedPlan(null)}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded font-medium transition-colors"
              >
                Dismiss
              </button>
              <button
                onClick={saveGeneratedPlan}
                disabled={savingPlan}
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  savingPlan
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {savingPlan ? 'Saving...' : 'Log This Plan'}
              </button>
            </div>
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