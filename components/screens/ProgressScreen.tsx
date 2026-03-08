'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { getUserProgress, ProgressStats } from '@/lib/firestore/progress';

export default function ProgressScreen() {
  const [progress, setProgress] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // AI Coach states
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Body Metrics AI states
  const [bodyMetricsInsight, setBodyMetricsInsight] = useState<string | null>(null);
  const [isLoadingBodyAI, setIsLoadingBodyAI] = useState(false);
  const [bodyMetricsError, setBodyMetricsError] = useState<string | null>(null);

  // Body Measurements logging states
  const [measurements, setMeasurements] = useState({
    weight: '',
    waist: '',
    chest: '',
    arms: '',
    thighs: '',
    hips: ''
  });
  const [savingMeasurements, setSavingMeasurements] = useState(false);
  const [measurementHistory, setMeasurementHistory] = useState<any[]>([]);

  useEffect(() => {
    async function loadProgress() {
      try {
        const data = await getUserProgress();
        setProgress(data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load progress');
      } finally {
        setLoading(false);
      }
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadProgress();
      } else {
        setError('Please sign in to view progress');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 animate-pulse">
        Loading your progress...
      </div>
    );
  }

  if (error || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        <p className="text-xl">{error || 'No progress data yet'}</p>
      </div>
    );
  }

  const { monthlyWorkouts, monthlyCalories, avgDuration, weeklyActivity, achievements } = progress;

  const maxMinutes = Math.max(...weeklyActivity.map(d => d.minutes));

  // AI Progress Analysis
  const getAIInsight = async () => {
    if (!progress) return;

    setIsLoadingAI(true);
    setAiError(null);
    setAiInsight(null);

    try {
      const prompt = `
Analyze this fitness progress data and provide personalized insights and recommendations:

Monthly Stats:
- Workouts completed: ${monthlyWorkouts}
- Total calories burned: ${monthlyCalories}
- Average workout duration: ${avgDuration} minutes

Weekly Activity (last 7 days):
${weeklyActivity.map(day => `- ${day.day}: ${day.minutes} minutes, ${day.calories} calories`).join('\n')}

Achievements unlocked: ${achievements.length}
${achievements.length > 0 ? `Recent achievements: ${achievements.map(a => a.name).join(', ')}` : 'No achievements yet'}

Please provide:
1. A brief assessment of their current progress
2. 2-3 specific recommendations for improvement
3. One motivational message
4. Any patterns or trends you notice

Keep it encouraging and actionable. Focus on their strengths and areas for growth.
`;

      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error('Failed to get AI insights');
      }

      const { reply } = await res.json();
      const parsed = JSON.parse(reply);

      // Extract the AI response - it might be in different formats
      let insight = '';
      if (parsed.notes && Array.isArray(parsed.notes)) {
        insight = parsed.notes.join('\n\n');
      } else if (parsed.description) {
        insight = parsed.description;
      } else {
        // Fallback: create a simple analysis
        insight = `Great progress! You've completed ${monthlyWorkouts} workouts this month, burning ${monthlyCalories} calories with an average duration of ${avgDuration} minutes. Keep up the excellent work!`;
      }

      setAiInsight(insight);
    } catch (err: any) {
      console.error('AI insight error:', err);
      setAiError('Could not generate insights. Please try again.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  // AI Body Metrics Analysis
  const getBodyMetricsInsight = async () => {
    setIsLoadingBodyAI(true);
    setBodyMetricsError(null);
    setBodyMetricsInsight(null);

    try {
      const hasMeasurements = Object.values(measurements).some(val => val.trim() !== '');
      const prompt = `
Based on this user's fitness progress, provide guidance for body metrics tracking:

Current Progress Context:
- Monthly workouts: ${monthlyWorkouts}
- Monthly calories burned: ${monthlyCalories}
- Average workout duration: ${avgDuration} minutes
- Weekly activity pattern: ${weeklyActivity.map(d => `${d.day}: ${d.minutes}min`).join(', ')}

${hasMeasurements ? `Current Measurements: ${Object.entries(measurements).filter(([_, val]) => val.trim()).map(([key, val]) => `${key}: ${val}`).join(', ')}` : 'No measurements logged yet'}

Please provide:
1. Key body metrics they should start tracking (weight, measurements, etc.)
2. How often to measure each metric
3. What changes to expect based on their current activity level
4. Tips for accurate measurements
5. When to consult professionals

Focus on practical, beginner-friendly advice. Explain why each metric matters.
${hasMeasurements ? 'Also analyze their current measurements and suggest what improvements to expect.' : ''}
`;

      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error('Failed to get body metrics guidance');
      }

      const { reply } = await res.json();
      const parsed = JSON.parse(reply);

      // Extract the AI response
      let insight = '';
      if (parsed.notes && Array.isArray(parsed.notes)) {
        insight = parsed.notes.join('\n\n');
      } else if (parsed.description) {
        insight = parsed.description;
      } else {
        // Fallback guidance
        insight = `Start tracking your weight weekly and key measurements monthly. Based on your ${monthlyWorkouts} workouts per month, you should see gradual progress. Remember consistency is key!`;
      }

      setBodyMetricsInsight(insight);
    } catch (err: any) {
      console.error('Body metrics AI error:', err);
      setBodyMetricsError('Could not generate body metrics guidance. Please try again.');
    } finally {
      setIsLoadingBodyAI(false);
    }
  };

  // Save body measurements
  const saveMeasurements = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert('Please sign in to save measurements');
      return;
    }

    // Check if at least one measurement is filled
    const hasData = Object.values(measurements).some(val => val.trim() !== '');
    if (!hasData) {
      alert('Please enter at least one measurement');
      return;
    }

    setSavingMeasurements(true);
    try {
      const { db } = await import('@/lib/firebase');
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');

      await addDoc(collection(db, `users/${user.uid}/bodyMeasurements`), {
        ...measurements,
        date: new Date().toISOString().split('T')[0],
        timestamp: serverTimestamp(),
      });

      alert('Measurements saved successfully!');
      setMeasurements({
        weight: '',
        waist: '',
        chest: '',
        arms: '',
        thighs: '',
        hips: ''
      });
    } catch (error) {
      console.error('Error saving measurements:', error);
      alert('Failed to save measurements. Please try again.');
    } finally {
      setSavingMeasurements(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-slide-in">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
          YOUR <span className="text-red-500">PROGRESS</span>
        </h1>
        <p className="text-gray-400">Track your fitness journey and celebrate your wins</p>
      </div>

      {/* Monthly Overview - Full Screen */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-red-500 p-6 animate-slide-in stagger-1">
        <div className="text-sm text-gray-500 mb-2">This Month</div>
        <div className="space-y-2">
          <div>
            <div className="text-xs text-gray-600">Workouts</div>
            <div className="text-2xl font-bold text-red-500">{monthlyWorkouts}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Calories</div>
            <div className="text-lg font-bold">{monthlyCalories}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Avg Duration</div>
            <div className="text-lg font-bold">{avgDuration} min</div>
          </div>
        </div>
      </div>

      {/* Body Measurements & Composition Tracking */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 animate-slide-in stagger-2">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>
              BODY MEASUREMENTS & <span className="text-green-500">COMPOSITION</span>
            </h2>
            <p className="text-sm text-gray-400">Track your physical changes and get AI-powered insights</p>
          </div>
          <button
            onClick={getBodyMetricsInsight}
            disabled={isLoadingBodyAI}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isLoadingBodyAI
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isLoadingBodyAI ? 'Analyzing...' : 'Get AI Guidance'}
          </button>
        </div>

        {bodyMetricsError && (
          <div className="bg-red-900/40 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
            {bodyMetricsError}
          </div>
        )}

        {bodyMetricsInsight && (
          <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg mb-6">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📏</span>
              <div className="flex-1">
                <h3 className="font-bold text-green-400 mb-2">AI Body Metrics Guidance:</h3>
                <div className="text-gray-300 whitespace-pre-line leading-relaxed">
                  {bodyMetricsInsight}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Measurement Input Form */}
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-green-400 mb-4">Log Today's Measurements</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={measurements.weight}
                onChange={(e) => setMeasurements({...measurements, weight: e.target.value})}
                placeholder="75.5"
                className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Waist (cm)</label>
              <input
                type="number"
                step="0.1"
                value={measurements.waist}
                onChange={(e) => setMeasurements({...measurements, waist: e.target.value})}
                placeholder="85.0"
                className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Chest (cm)</label>
              <input
                type="number"
                step="0.1"
                value={measurements.chest}
                onChange={(e) => setMeasurements({...measurements, chest: e.target.value})}
                placeholder="95.0"
                className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Arms (cm)</label>
              <input
                type="number"
                step="0.1"
                value={measurements.arms}
                onChange={(e) => setMeasurements({...measurements, arms: e.target.value})}
                placeholder="30.0"
                className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Thighs (cm)</label>
              <input
                type="number"
                step="0.1"
                value={measurements.thighs}
                onChange={(e) => setMeasurements({...measurements, thighs: e.target.value})}
                placeholder="55.0"
                className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Hips (cm)</label>
              <input
                type="number"
                step="0.1"
                value={measurements.hips}
                onChange={(e) => setMeasurements({...measurements, hips: e.target.value})}
                placeholder="100.0"
                className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded text-white focus:outline-none focus:border-green-500"
              />
            </div>
          </div>
          <button
            onClick={saveMeasurements}
            disabled={savingMeasurements}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              savingMeasurements
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {savingMeasurements ? 'Saving...' : 'Save Measurements'}
          </button>
        </div>

        {/* Measurement Trends */}
        <div className="mt-6 bg-gray-800/30 border border-gray-700 rounded-lg p-4">
          <h3 className="font-bold text-green-400 mb-3">📈 Recent Trends</h3>
          <p className="text-sm text-gray-400 mb-4">Track your progress over time (charts coming soon)</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300 w-16">Weight</span>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-700 h-4 rounded overflow-hidden">
                  <div className="h-full bg-green-500 transition-all duration-500" style={{ width: '75%' }}></div>
                </div>
              </div>
              <span className="text-sm text-green-400 w-16">↓ 2.3kg</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300 w-16">Waist</span>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-700 h-4 rounded overflow-hidden">
                  <div className="h-full bg-green-500 transition-all duration-500" style={{ width: '60%' }}></div>
                </div>
              </div>
              <span className="text-sm text-green-400 w-16">↓ 3.2cm</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300 w-16">Arms</span>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-700 h-4 rounded overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: '85%' }}></div>
                </div>
              </div>
              <span className="text-sm text-blue-400 w-16">↑ 1.1cm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Activity - Full Width */}
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
      </div>

      {/* Goals Progress – from user profile */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
          CURRENT <span className="text-red-500">GOALS</span>
        </h2>
        <p className="text-gray-400">Goal tracking coming soon – edit targets in profile</p>
      </div>

      {/* AI Progress Coach */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 animate-slide-in stagger-3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>
            AI <span className="text-purple-500">PROGRESS COACH</span>
          </h2>
          <button
            onClick={getAIInsight}
            disabled={isLoadingAI}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isLoadingAI
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isLoadingAI ? 'Analyzing...' : 'Get Insights'}
          </button>
        </div>

        {aiError && (
          <div className="bg-red-900/40 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
            {aiError}
          </div>
        )}

        {aiInsight ? (
          <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🤖</span>
              <div className="flex-1">
                <h3 className="font-bold text-purple-400 mb-2">Your AI Coach Says:</h3>
                <div className="text-gray-300 whitespace-pre-line leading-relaxed">
                  {aiInsight}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-4">🎯</div>
            <p>Click "Get Insights" to receive personalized analysis and recommendations based on your progress data.</p>
          </div>
        )}
      </div>
    </div>
  );
}