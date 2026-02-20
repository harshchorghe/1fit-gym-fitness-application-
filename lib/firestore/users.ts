import { db } from "../firebase"
import {
  doc,
  setDoc,
  getDoc,
  updateDoc
} from "firebase/firestore"

export interface UserData {
  firstName: string
  lastName: string
  email: string
  phone: string
  membershipType: string
  createdAt: string
  uid: string
  role?: "user" | "admin"
}

// Create user document
export const createUserInFirestore = async (
  uid: string,
  userData: UserData
) => {
  await setDoc(doc(db, "users", uid), userData)
}

// Get single user
export const getUserData = async (uid: string) => {
  const snapshot = await getDoc(doc(db, "users", uid))
  return snapshot.exists() ? snapshot.data() : null
}

// Update user
export const updateUserData = async (
  uid: string,
  updatedData: Partial<UserData>
) => {
  await updateDoc(doc(db, "users", uid), updatedData)
}