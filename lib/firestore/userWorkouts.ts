import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import type { Workout } from "./Workouts";   // reuse your Workout interface

export interface CompletedWorkout {
  id: string;           // Firestore doc ID
  workoutId: string;
  title: string;
  trainer: string;
  duration: string;
  difficulty: string;
  calories: number;
  completedAt: any;     // Timestamp
}

// Log a workout when user clicks "Start"
export const logCompletedWorkout = async (
  userId: string,
  workout: Workout
) => {
  await addDoc(collection(db, `users/${userId}/completedWorkouts`), {
    workoutId: workout.id,
    title: workout.title,
    trainer: workout.trainer || "Unknown",
    duration: workout.duration,
    difficulty: workout.difficulty,
    calories: workout.calories,
    completedAt: serverTimestamp(),
  });
};

// Get all completed workouts for a user (newest first)
export const getCompletedWorkouts = async (
  userId: string
): Promise<CompletedWorkout[]> => {
  const q = query(
    collection(db, `users/${userId}/completedWorkouts`),
    orderBy("completedAt", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as CompletedWorkout[];
};