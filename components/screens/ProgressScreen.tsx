'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { getUserProgress, ProgressStats } from '@/lib/firestore/progress';

export default function ProgressScreen() {
  const [progress, setProgress] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <div className="bg-gradient-to-br from-gray-900 to-black border border-red-500 p-6">
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
        {/* You can add more monthly cards here if needed */}
      </div>

      {/* Body Metrics – placeholder until you add real tracking */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 animate-slide-in stagger-2">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
          BODY <span className="text-red-500">METRICS</span>
        </h2>
        <p className="text-gray-400 mb-4">Body metrics coming soon – add weight tracking in profile</p>
        {/* You can expand this later */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
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

        {/* Achievements */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
            RECENT <span className="text-red-500">ACHIEVEMENTS</span>
          </h2>
          {achievements.length === 0 ? (
            <p className="text-gray-400">Keep going! Achievements unlock soon.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((ach, idx) => (
                <div key={idx} className="bg-gradient-to-br from-yellow-500/20 to-black border border-yellow-500 p-4 text-center">
                  <div className="text-5xl mb-2">{ach.icon}</div>
                  <div className="font-bold mb-1">{ach.name}</div>
                  <div className="text-xs text-gray-500">{ach.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Goals Progress – from user profile */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
          CURRENT <span className="text-red-500">GOALS</span>
        </h2>
        <p className="text-gray-400">Goal tracking coming soon – edit targets in profile</p>
      </div>
    </div>
  );
}