'use client';

import { useEffect, useState } from 'react';
import { AppUser } from '@/lib/hooks/useUserData';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from 'firebase/firestore';

interface RecentWorkoutsProps {
  user: AppUser;
}

interface WorkoutEntry {
  id: string;
  title: string;
  duration: string;
  calories: number;
  completedAt: Timestamp;
}

export default function RecentWorkouts({ user }: RecentWorkoutsProps) {
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    async function fetchRecentWorkouts() {
      try {
        setLoading(true);
        setError(null);

        const q = query(
          collection(db, `users/${user.uid}/completedWorkouts`),
          orderBy('completedAt', 'desc'),
          limit(5)
        );

        const snapshot = await getDocs(q);

        const recent = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || 'Unnamed Workout',
            duration: data.duration || '? min',
            calories: data.calories || 0,
            completedAt: data.completedAt as Timestamp,
          } satisfies WorkoutEntry;
        });

        setWorkouts(recent);
      } catch (err: any) {
        console.error('Failed to load recent workouts:', err);
        setError('Could not load recent workouts');
      } finally {
        setLoading(false);
      }
    }

    fetchRecentWorkouts();
  }, [user?.uid]);

  const formatDate = (timestamp?: Timestamp) => {
    if (!timestamp) return '—';
    const date = timestamp.toDate();
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-2xl h-full">
      <h2
        className="text-2xl font-bold mb-5"
        style={{ fontFamily: 'Oswald, sans-serif' }}
      >
        RECENT <span className="text-red-500">WORKOUTS</span>
      </h2>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-gray-800/70 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-400">{error}</div>
      ) : workouts.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No workouts completed yet
          <br />
          <span className="text-sm">Start one to see it here</span>
        </div>
      ) : (
        <div
          className={`
            space-y-3 
            max-h-[340px] 
            overflow-y-auto 
            pr-2 
            scrollbar-thin 
            scrollbar-thumb-gray-700 
            scrollbar-track-gray-900 
            scrollbar-thumb-rounded-full 
            scrollbar-track-rounded-full
          `}
        >
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="
                flex items-center justify-between 
                p-4 
                bg-black/50 
                border border-gray-800 
                hover:border-red-600/60 
                transition-all 
                rounded-xl 
                group
              "
            >
              <div>
                <h3 className="font-bold mb-1 group-hover:text-red-400 transition-colors">
                  {workout.title}
                </h3>
                <div className="text-xs text-gray-500">
                  {formatDate(workout.completedAt)}
                </div>
              </div>

              <div className="text-right">
                <div className="text-red-500 font-bold">{workout.duration}</div>
                <div className="text-xs text-gray-500">
                  {workout.calories} kcal
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}