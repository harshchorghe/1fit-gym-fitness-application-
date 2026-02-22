// lib/firestore/progress.ts
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
  where,
  getDoc,
  doc,
} from 'firebase/firestore';
import { auth } from '@/lib/firebase';

export interface CompletedWorkout {
  id: string;
  title: string;
  trainer?: string;
  duration: string;
  difficulty: string;
  calories: number;
  completedAt: Timestamp;
}

export interface ProgressStats {
  monthlyWorkouts: number;
  monthlyCalories: number;
  avgDuration: number;
  weeklyActivity: Array<{ day: string; minutes: number; calories: number }>;
  totalWorkouts: number;
  totalCalories: number;
  achievements: Array<{ name: string; date: string; icon: string }>;
}

// Helper to get current user's completed workouts
export async function getUserCompletedWorkouts(): Promise<CompletedWorkout[]> {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    collection(db, `users/${user.uid}/completedWorkouts`),
    orderBy('completedAt', 'desc')
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => ({
    id: d.id,
    ...d.data(),
  })) as CompletedWorkout[];
}

// Get user profile data (weight, goals, etc.)
export async function getUserProfile() {
  const user = auth.currentUser;
  if (!user) return null;

  const docSnap = await getDoc(doc(db, 'users', user.uid));
  return docSnap.exists() ? docSnap.data() : null;
}

// Main progress calculation function
export async function getUserProgress(): Promise<ProgressStats> {
  const workouts = await getUserCompletedWorkouts();
  const profile = await getUserProfile();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // Sunday start

  // Monthly stats
  const monthly = workouts.filter(w => {
    const d = w.completedAt.toDate();
    return d >= monthStart;
  });

  const monthlyWorkouts = monthly.length;
  const monthlyCalories = monthly.reduce((sum, w) => sum + (w.calories || 0), 0);
  const totalMinutes = monthly.reduce((sum, w) => {
    const match = (w.duration || '').toString().match(/\d+/);
    const num = match ? match[0] : '0';
    return sum + Number(num);
  }, 0);
  const avgDuration = monthlyWorkouts > 0 ? Math.round(totalMinutes / monthlyWorkouts) : 0;

  // Weekly activity (last 7 days)
  const weekly = Array.from({ length: 7 }, () => ({ minutes: 0, calories: 0 }));
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  workouts.forEach(w => {
    const d = w.completedAt.toDate();
    const dayIndex = d.getDay();
    const match = (w.duration || '').toString().match(/\d+/);
    const minutes = Number(match ? match[0] : '0');

    if (d >= weekStart) {
      weekly[dayIndex].minutes += minutes;
      weekly[dayIndex].calories += (w.calories || 0);
    }
  });

  const weeklyActivity = weekly.map((data, i) => ({
    day: days[i],
    minutes: data.minutes,
    calories: data.calories,
  }));

  // Simple achievements (you can expand this)
  const achievements = [];
  if (workouts.length >= 100) {
    achievements.push({ name: '100 Workouts', date: 'Milestone', icon: '💯' });
  }
  if (monthlyCalories >= 10000) {
    achievements.push({ name: '10k Calories Burned', date: 'This Month', icon: '🔥' });
  }
  if (monthlyWorkouts >= 20) {
    achievements.push({ name: 'Perfect Month', date: 'This Month', icon: '⭐' });
  }

  return {
    monthlyWorkouts,
    monthlyCalories,
    avgDuration,
    weeklyActivity,
    totalWorkouts: workouts.length,
    totalCalories: workouts.reduce((sum, w) => sum + (w.calories || 0), 0),
    achievements,
  };
}