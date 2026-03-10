'use client';

import { useEffect, useState } from 'react';
import { AppUser } from '@/lib/hooks/useUserData';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';

interface WeekStatsProps {
  user: AppUser;
}

function parseDurationToMinutes(duration: unknown): number {
  if (typeof duration === 'number' && Number.isFinite(duration)) {
    return Math.max(0, Math.round(duration));
  }

  if (typeof duration !== 'string') return 0;

  const value = duration.trim().toLowerCase();
  if (!value) return 0;

  // Supports formats like: "50", "50 min", "1h 20m", "1 hr 15 min"
  const hourMatch = value.match(/(\d+)\s*(h|hr|hrs|hour|hours)/);
  const minuteMatch = value.match(/(\d+)\s*(m|min|mins|minute|minutes)/);

  const hours = hourMatch ? Number(hourMatch[1]) : 0;
  const minutes = minuteMatch ? Number(minuteMatch[1]) : 0;

  if (hours > 0 || minutes > 0) {
    return hours * 60 + minutes;
  }

  const fallback = Number(value.replace(/[^\d.]/g, ''));
  if (Number.isFinite(fallback)) {
    return Math.max(0, Math.round(fallback));
  }

  return 0;
}

export default function WeekStats({ user }: WeekStatsProps) {
  const [stats, setStats] = useState({
    workouts: 0,
    totalTime: '0h 0m',
    calories: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    async function fetchWeekStats() {
      try {
        setLoading(true);
        setError(null);

        // This week: Monday 00:00 → now
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
        startOfWeek.setHours(0, 0, 0, 0);

        const q = query(
          collection(db, `users/${user.uid}/completedWorkouts`),
          where('completedAt', '>=', Timestamp.fromDate(startOfWeek)),
          where('completedAt', '<=', Timestamp.fromDate(now))
        );

        const snapshot = await getDocs(q);

        let workoutCount = 0;
        let totalMinutes = 0;
        let totalCalories = 0;

        snapshot.forEach((doc) => {
          const data = doc.data();
          workoutCount++;

          const durationMin = parseDurationToMinutes(data.duration);
          totalMinutes += durationMin;

          totalCalories += typeof data.calories === 'number' ? data.calories : 0;
        });

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const timeStr = `${hours}h ${minutes}m`;

        setStats({
          workouts: workoutCount,
          totalTime: timeStr,
          calories: totalCalories,
        });
      } catch (err: any) {
        console.error('Week stats error:', err);
        setError('Failed to load stats');
      } finally {
        setLoading(false);
      }
    }

    fetchWeekStats();
  }, [user?.uid]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6 lg:gap-8 animate-slide-in stagger-1">
      {/* Workouts Card */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 md:p-8 rounded-2xl hover:border-red-600/70 transition-all duration-300 shadow-lg hover:shadow-red-900/20 group">
        <div className="text-gray-500 text-sm uppercase tracking-wider mb-3 font-medium">
          Workouts
        </div>
        {loading ? (
          <div className="h-12 bg-gray-800/70 rounded-xl animate-pulse" />
        ) : error ? (
          <div className="text-red-400 text-4xl font-bold">—</div>
        ) : (
          <div className="text-5xl md:text-6xl font-black text-red-500 group-hover:text-red-400 transition-colors" style={{ fontFamily: 'Oswald, sans-serif' }}>
            {stats.workouts}
          </div>
        )}
        <div className="text-sm text-gray-500 mt-2">This week</div>
      </div>

      {/* Time Card */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 md:p-8 rounded-2xl hover:border-red-600/70 transition-all duration-300 shadow-lg hover:shadow-red-900/20 group">
        <div className="text-gray-500 text-sm uppercase tracking-wider mb-3 font-medium">
          Time
        </div>
        {loading ? (
          <div className="h-12 bg-gray-800/70 rounded-xl animate-pulse" />
        ) : error ? (
          <div className="text-red-400 text-4xl font-bold">—</div>
        ) : (
          <div className="text-5xl md:text-6xl font-black text-red-500 group-hover:text-red-400 transition-colors" style={{ fontFamily: 'Oswald, sans-serif' }}>
            {stats.totalTime}
          </div>
        )}
        <div className="text-sm text-gray-500 mt-2">Training time</div>
      </div>

      {/* Calories Card */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 md:p-8 rounded-2xl hover:border-red-600/70 transition-all duration-300 shadow-lg hover:shadow-red-900/20 group">
        <div className="text-gray-500 text-sm uppercase tracking-wider mb-3 font-medium">
          Calories
        </div>
        {loading ? (
          <div className="h-12 bg-gray-800/70 rounded-xl animate-pulse" />
        ) : error ? (
          <div className="text-red-400 text-4xl font-bold">—</div>
        ) : (
          <div className="text-5xl md:text-6xl font-black text-red-500 group-hover:text-red-400 transition-colors" style={{ fontFamily: 'Oswald, sans-serif' }}>
            {stats.calories}
          </div>
        )}
        <div className="text-sm text-gray-500 mt-2">Burned</div>
      </div>
    </div>
  );
}