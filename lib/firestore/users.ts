// lib/firestore/users.ts
import { db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

export interface UserData {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;                // optional
  membershipType: string;
  role?: 'user' | 'admin' | 'trainer';
  photoURL?: string;             // profile picture URL (optional)
  createdAt: Timestamp;          // server-generated
  lastLogin?: Timestamp;         // optional
  // Legacy field support (you can remove later)
  isAdmin?: boolean;
}

/**
 * Creates or overwrites a user document in Firestore
 * @param uid - Firebase Auth UID
 * @param userData - User data without uid/createdAt
 * @returns true on success
 */
export const createUserInFirestore = async (
  uid: string,
  userData: Omit<UserData, 'uid' | 'createdAt' | 'lastLogin' | 'isAdmin'> & {
    role?: UserData['role'];
    isAdmin?: boolean; // legacy support
  }
): Promise<boolean> => {
  try {
    const fullData: UserData = {
      ...userData,
      uid,
      createdAt: serverTimestamp() as any, // TypeScript needs 'any' for serverTimestamp
      role: userData.role ?? 'user',
      isAdmin: userData.isAdmin ?? false, // legacy
    };

    await setDoc(doc(db, "users", uid), fullData);
    console.log(`User document created successfully: ${uid}`);
    return true;
  } catch (error: any) {
    console.error("Failed to create user document:", error);
    throw new Error(`Could not create user profile: ${error.message}`);
  }
};

/**
 * Fetches user data from Firestore
 * @param uid - User ID
 * @returns UserData or null if not found
 */
export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      return snapshot.data() as UserData;
    }

    console.log(`No user document found for UID: ${uid}`);
    return null;
  } catch (error: any) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
};

/**
 * Updates specific fields in the user document (safe merge)
 * @param uid - User ID
 * @param updatedData - Fields to update
 */
export const updateUserData = async (
  uid: string,
  updatedData: Partial<Omit<UserData, 'uid' | 'createdAt'>>
): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid);

    // Use setDoc with merge instead of updateDoc to be safer
    await setDoc(userRef, updatedData, { merge: true });

    console.log(`User document updated successfully: ${uid}`);
  } catch (error: any) {
    console.error("Failed to update user data:", error);
    throw new Error(`Could not update profile: ${error.message}`);
  }
};

/**
 * Checks if user has admin privileges
 * Supports both legacy `isAdmin` boolean and new `role` field
 * @param uid - User ID
 * @returns boolean - true if admin
 */
export const isUserAdmin = async (uid: string): Promise<boolean> => {
  try {
    const snapshot = await getDoc(doc(db, "users", uid));
    if (!snapshot.exists()) return false;

    const data = snapshot.data() as Partial<UserData>;

    // Check both legacy field and new role field
    return data.isAdmin === true || data.role === 'admin';
  } catch (err: any) {
    console.error("Admin check failed:", err);
    return false;
  }
};

/**
 * Updates last login timestamp (call after successful sign-in)
 * @param uid - User ID
 */
export const updateLastLogin = async (uid: string): Promise<void> => {
  try {
    await updateDoc(doc(db, "users", uid), {
      lastLogin: serverTimestamp(),
    });
  } catch (err: any) {
    console.warn("Could not update last login:", err);
    // Non-critical, so don't throw
  }
};