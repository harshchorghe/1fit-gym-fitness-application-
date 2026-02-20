import { db } from "../firebase"
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  increment
} from "firebase/firestore"

export interface GymClass {
  id?: string
  title: string
  trainer: string
  time: string
  capacity: number
  enrolledCount: number
}

// Get all classes
export const getClasses = async (): Promise<GymClass[]> => {
  const snapshot = await getDocs(collection(db, "classes"))
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as GymClass[]
}

// Get single class
export const getClassById = async (id: string) => {
  const snapshot = await getDoc(doc(db, "classes", id))
  return snapshot.exists()
    ? { id: snapshot.id, ...snapshot.data() }
    : null
}

// Increase enrolled count (for booking)
export const incrementEnrollment = async (classId: string) => {
  await updateDoc(doc(db, "classes", classId), {
    enrolledCount: increment(1)
  })
}