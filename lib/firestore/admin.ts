// lib/firestore/admin.ts
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Workout } from './Workouts'; // import your Workout type
import { GymClass } from './Classes'; // import your GymClass type
import { isUserAdmin } from './users';

// ─── Add new workout (public collection) ──────────────────────────────
export async function adminAddWorkout(adminUid: string, workout: Omit<Workout, 'id' | 'createdAt'>) {
  const allowed = await isUserAdmin(adminUid);
  if (!allowed) throw new Error('Access denied: admin only');

  const docRef = await addDoc(collection(db, 'workouts'), {
    ...workout,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// ─── Add new class (public collection) ────────────────────────────────
export async function adminAddClass(adminUid: string, gymClass: Omit<GymClass, 'id' | 'createdAt' | 'enrolledCount'>) {
  const allowed = await isUserAdmin(adminUid);
  if (!allowed) throw new Error('Access denied: admin only');

  const docRef = await addDoc(collection(db, 'classes'), {
    ...gymClass,
    enrolledCount: 0,
    createdAt: serverTimestamp(),
    startTime: gymClass.startTime || serverTimestamp(), // fallback
  });
  return docRef.id;
}