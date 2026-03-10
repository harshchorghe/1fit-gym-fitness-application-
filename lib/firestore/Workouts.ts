import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export interface Workout {
  id?: string;
  title: string;
  trainer: string;
  duration: string;
  difficulty: string;
  calories: number;
  createdAt?: any;
}

export interface WorkoutDetailStep {
  id: string;
  order: number;
  name: string;
  sets: string;
  reps: string;
  rest: string;
  tip: string;
  move: string;
  gifUrl?: string;
}

export interface WorkoutDetailInput {
  order?: number;
  name: string;
  sets?: string;
  reps?: string;
  rest?: string;
  tip?: string;
  move?: string;
  gifUrl?: string;
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

export const addWorkout = async (
  workout: Omit<Workout, "id" | "createdAt">
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "workouts"), {
      ...workout,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding workout:", error);
    throw error;
  }
};

// Fetch step-by-step workout details from: workouts/{workoutId}/details
export const getWorkoutDetails = async (workoutId: string): Promise<WorkoutDetailStep[]> => {
  const detailsRef = collection(db, "workouts", workoutId, "details");
  const snapshot = await getDocs(detailsRef);

  const details = snapshot.docs.map((snap) => {
    const data = snap.data() as Record<string, unknown>;

    return {
      id: snap.id,
      order: Number(data.order ?? 999),
      name: String(data.name ?? data.title ?? "Exercise"),
      sets: String(data.sets ?? "-"),
      reps: String(data.reps ?? "-"),
      rest: String(data.rest ?? "-"),
      tip: String(data.tip ?? ""),
      move: String(data.move ?? "jumping-jack"),
      gifUrl: data.gifUrl ? String(data.gifUrl) : undefined,
    } satisfies WorkoutDetailStep;
  });

  return details.sort((a, b) => a.order - b.order);
};

export const addWorkoutDetails = async (
  workoutId: string,
  details: WorkoutDetailInput[]
): Promise<void> => {
  if (!details.length) return;

  const detailsRef = collection(db, "workouts", workoutId, "details");

  await Promise.all(
    details.map((detail, index) => {
      const payload = {
        order: detail.order ?? index + 1,
        name: detail.name,
        sets: detail.sets ?? "-",
        reps: detail.reps ?? "-",
        rest: detail.rest ?? "-",
        tip: detail.tip ?? "",
        move: detail.move ?? "jumping-jack",
        ...(detail.gifUrl ? { gifUrl: detail.gifUrl } : {}),
      };

      return addDoc(detailsRef, payload);
    })
  );
};