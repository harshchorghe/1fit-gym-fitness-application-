// lib/firestore/admin.ts
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Workout } from './Workouts';
import { GymClass } from './Classes';
import { isUserAdmin } from './users';

// ─── Add new workout (public collection) ──────────────────────────────
export async function adminAddWorkout(adminUid: string, workout: Omit<Workout, 'id' | 'createdAt'>) {
  // NOTE: client-side page already checks admin status; Firestore rules should restrict write access
  const docRef = await addDoc(collection(db, 'workouts'), {
    ...workout,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// ─── Add new class (public collection) ────────────────────────────────
export async function adminAddClass(adminUid: string, gymClass: Omit<GymClass, 'id' | 'createdAt' | 'enrolledCount'>) {
  // NOTE: client-side page already checks admin status; Firestore rules should restrict write access
  const docRef = await addDoc(collection(db, 'classes'), {
    ...gymClass,
    enrolledCount: 0,
    createdAt: serverTimestamp(),
    startTime: gymClass.startTime || serverTimestamp(),
  });
  return docRef.id;
}

// ─── NEW: Add new meal plan (global collection) ───────────────────────
export interface MealPlanInput {
  name: string;
  calories: number;
  protein: number;
  description: string;
  duration: string;
}

export async function adminAddMealPlan(adminUid: string, plan: MealPlanInput) {
  // NOTE: client-side page already checks admin status; Firestore rules should restrict write access
  const docRef = await addDoc(collection(db, 'mealPlans'), {
    ...plan,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}