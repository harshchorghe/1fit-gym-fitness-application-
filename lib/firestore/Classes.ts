// lib/firestore/Classes.ts
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  // runTransaction,
  Timestamp,
  // increment,
  // updateDoc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase'; // adjust path if needed

export interface GymClass {
  id: string;
  title: string;
  trainer: string;
  time: string;           // e.g. "06:00 AM"  ← human readable
  startTime?: Timestamp;  // ← for proper sorting / today filtering
  duration: string;       // e.g. "45 min"
  type: string;           // "Yoga", "HIIT", "Strength", ...
  intensity: 'Low' | 'Medium' | 'High';
  capacity: number;
  enrolledCount: number;
  description?: string;
}

export interface UserBookedClass {
  duration: string;
  id: string;             // = class id
  title: string;
  trainer: string;
  time: string;
  date: string;           // "Today", "Tomorrow", or formatted date
  type?: string;
  intensity?: string;
  bookedAt: any;          // Timestamp | Date
  status: 'confirmed' | 'cancelled';
}

// ─── Get today's classes ───────────────────────────────────────
export async function getTodayClasses(): Promise<GymClass[]> {
  // NOTE: some class documents may not have `startTime` set which
  // would exclude them from range queries. To ensure the UI shows
  // all available classes, fetch all and sort client-side by
  // `startTime` (fallback to createdAt or alphabetical).
  const snap = await getDocs(collection(db, 'classes'));
  const arr = snap.docs.map(d => ({ id: d.id, ...d.data() })) as GymClass[];

  arr.sort((a, b) => {
    const ta = (a.startTime as any)?.toDate?.() ?? null;
    const tb = (b.startTime as any)?.toDate?.() ?? null;
    if (ta && tb) return ta.getTime() - tb.getTime();
    if (ta && !tb) return -1;
    if (!ta && tb) return 1;
    return (a.title || '').localeCompare(b.title || '');
  });

  return arr;
}

// ─── Get upcoming classes (next 7 days by default) ─────────────
export async function getUpcomingClasses(days = 7): Promise<GymClass[]> {
  const now = new Date();
  const start = Timestamp.fromDate(now);
  const end = new Date(now);
  end.setDate(end.getDate() + days);

  const q = query(
    collection(db, 'classes'),
    where('startTime', '>=', start),
    where('startTime', '<=', Timestamp.fromDate(end)),
    orderBy('startTime', 'asc')
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => ({
    id: d.id,
    ...d.data(),
  })) as GymClass[];
}

// ─── Get my booked classes ─────────────────────────────────────
export async function getMyBookedClasses(uid: string): Promise<UserBookedClass[]> {
  if (!uid) return [];

  const q = query(
    collection(db, `users/${uid}/bookedClasses`),
    orderBy('startTime', 'asc')
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => ({
    id: d.id,
    ...d.data(),
  })) as UserBookedClass[];
}

// ─── Book a class (transaction) ────────────────────────────────
// Book a class: write only to the user's bookedClasses subcollection.
// NOTE: many projects restrict direct updates to the `classes` collection
// (admin-only). To avoid permission errors, we don't update the
// `classes` document here. If you want counts updated, use a Cloud
// Function or allow authenticated users in security rules.
export async function bookClass(uid: string, gymClass: GymClass) {
  if (!uid || !gymClass.id) throw new Error('Missing user or class');

  const userClassRef = doc(db, `users/${uid}/bookedClasses`, gymClass.id);

  // Prevent overwriting an existing booking accidentally
  const existing = await getDoc(userClassRef);
  if (existing.exists()) throw new Error('You already booked this class');

  await setDoc(userClassRef, {
    title: gymClass.title,
    trainer: gymClass.trainer,
    time: gymClass.time,
    type: gymClass.type,
    intensity: gymClass.intensity,
    date: 'Today',
    startTime: gymClass.startTime || serverTimestamp(),
    bookedAt: serverTimestamp(),
    status: 'confirmed',
  });
}

// ─── Cancel booking ─────────────────────────────────────────────
export async function cancelBooking(uid: string, classId: string) {
  const userClassRef = doc(db, `users/${uid}/bookedClasses`, classId);
  await deleteDoc(userClassRef);
}