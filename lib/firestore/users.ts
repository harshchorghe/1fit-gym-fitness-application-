import { db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  membershipType: string;
  createdAt: any;          // serverTimestamp() returns Timestamp
  uid: string;
  role?: 'user' | 'admin' | 'trainer';
}

// Create or overwrite user document
export const createUserInFirestore = async (
  uid: string,
  userData: Omit<UserData, 'uid' | 'createdAt' | 'role'> & { role?: UserData['role'] }
) => {
  try {
    const fullData = {
      ...userData,
      uid,
      createdAt: serverTimestamp(),
      role: userData.role ?? 'user',
    };

    await setDoc(doc(db, "users", uid), fullData);
    console.log("User created:", uid);
    return true;
  } catch (error) {
    console.error("Create user failed:", error);
    throw error;
  }
};

// Get user data
export const getUserData = async (uid: string) => {
  try {
    const snapshot = await getDoc(doc(db, "users", uid));
    if (snapshot.exists()) {
      return snapshot.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error("Get user failed:", error);
    return null;
  }
};

// Safe partial update
export const updateUserData = async (
  uid: string,
  updatedData: Partial<Omit<UserData, 'uid' | 'createdAt'>>
) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, updatedData);
    console.log("User updated:", uid);
  } catch (error) {
    console.error("Update failed:", error);
    throw error;
  }
};

// Check whether a user is an admin (backwards-compatible with `isAdmin` boolean)
export const isUserAdmin = async (uid: string): Promise<boolean> => {
  try {
    const snapshot = await getDoc(doc(db, 'users', uid));
    if (!snapshot.exists()) return false;
    const data = snapshot.data() as Partial<UserData & { isAdmin?: boolean }>;
    return data.isAdmin === true || data.role === 'admin';
  } catch (err) {
    console.error('isUserAdmin check failed:', err);
    return false;
  }
};