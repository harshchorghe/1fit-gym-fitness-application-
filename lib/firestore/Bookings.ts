import { db } from "../firebase"
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  Timestamp
} from "firebase/firestore"

export interface Booking {
  id?: string
  userId: string
  classId: string
  classTitle: string
  trainer: string
  time: string
  bookedAt: Timestamp
}

// Create booking
export const createBooking = async (
  userId: string,
  classData: any
) => {
  await addDoc(collection(db, "bookings"), {
    userId,
    classId: classData.id,
    classTitle: classData.title,
    trainer: classData.trainer,
    time: classData.time,
    bookedAt: Timestamp.now()
  })
}

// Get bookings for specific user
export const getUserBookings = async (userId: string) => {
  const q = query(
    collection(db, "bookings"),
    where("userId", "==", userId)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }))
}

// Cancel booking
export const cancelBooking = async (bookingId: string) => {
  await deleteDoc(doc(db, "bookings", bookingId))
}