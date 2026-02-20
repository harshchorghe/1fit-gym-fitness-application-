import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,               // ← add this import
  serverTimestamp,      // ← optional but recommended
} from "firebase/firestore";

export interface Workout {
  id?: string;
  title: string;
  trainer: string;
  duration: string;
  difficulty: string;
  calories: number;
  createdAt?: any;      // ← optional field (you can add this)
  // createdBy?: string; // ← you can add later if you want to know who created it
}

// Get all workouts
export const getWorkouts = async (): Promise<Workout[]> => {
  const snapshot = await getDocs(collection(db, "workouts"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Workout[];
};

// Get single workout
export const getWorkoutById = async (id: string) => {
  const snapshot = await getDoc(doc(db, "workouts", id));
  return snapshot.exists()
    ? { id: snapshot.id, ...snapshot.data() }
    : null;
};

// ─── NEW FUNCTION ────────────────────────────────────────────────────────────
// Add this function (this is what was missing)

export const addWorkout = async (
  workout: Omit<Workout, "id" | "createdAt">  // exclude id & createdAt
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "workouts"), {
      ...workout,
      createdAt: serverTimestamp(),   // automatic server timestamp
      // createdBy: currentUser?.uid, // ← add later when you have auth
    });

    return docRef.id;  // return the new document ID (useful for later)
  } catch (error) {
    console.error("Error adding workout:", error);
    throw error; // let the caller handle the error
  }
};