import { db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  increment,
  runTransaction,
  collection,
  limit,
  orderBy,
  query,
  getDocs,
} from "firebase/firestore";

export interface UserData {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  membershipType: string;
  role?: 'user' | 'admin' | 'trainer';
  photoURL?: string;
  createdAt: Timestamp;
  lastLogin?: Timestamp;
  // Legacy
  isAdmin?: boolean;
  // Streak fields
  streak?: number;                  // default 0
  lastStreakIncrement?: Timestamp;  // used to prevent multiple claims per day
}

/**
 * Creates or overwrites a user document in Firestore
 */
export const createUserInFirestore = async (
  uid: string,
  userData: Omit<UserData, 'uid' | 'createdAt' | 'lastLogin' | 'isAdmin' | 'streak' | 'lastStreakIncrement'> & {
    role?: UserData['role'];
    isAdmin?: boolean;
  }
): Promise<boolean> => {
  try {
    const fullData: UserData = {
      ...userData,
      uid,
      createdAt: serverTimestamp() as any,
      role: userData.role ?? 'user',
      isAdmin: userData.isAdmin ?? false,
      streak: 0,
      lastStreakIncrement: null as any,
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
 * Safe merge update of user fields
 */
export const updateUserData = async (
  uid: string,
  updatedData: Partial<Omit<UserData, 'uid' | 'createdAt'>>
): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, updatedData, { merge: true });
    console.log(`User document updated: ${uid}`);
  } catch (error: any) {
    console.error("Failed to update user data:", error);
    throw new Error(`Could not update profile: ${error.message}`);
  }
};

/**
 * Checks admin privileges (legacy + new role field)
 */
export const isUserAdmin = async (uid: string): Promise<boolean> => {
  try {
    const snapshot = await getDoc(doc(db, "users", uid));
    if (!snapshot.exists()) return false;

    const data = snapshot.data() as Partial<UserData>;
    return data.isAdmin === true || data.role === 'admin';
  } catch (err: any) {
    console.error("Admin check failed:", err);
    return false;
  }
};

/**
 * Updates last login timestamp
 */
export const updateLastLogin = async (uid: string): Promise<void> => {
  try {
    await updateDoc(doc(db, "users", uid), {
      lastLogin: serverTimestamp(),
    });
  } catch (err: any) {
    console.warn("Could not update last login:", err);
  }
};

/**
 * Checks if user already claimed streak today
 */
export async function hasClaimedStreakToday(uid: string): Promise<boolean> {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) return false;

  const data = snap.data() as Partial<UserData>;
  const last = data.lastStreakIncrement as Timestamp | undefined;

  if (!last) return false;

  const lastDate = last.toDate().toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];

  return lastDate === today;
}

/**
 * Atomically increments streak by 1 — only once per day
 * Uses transaction for safety
 */
export async function incrementDailyStreak(uid: string): Promise<number | null> {
  const userRef = doc(db, "users", uid);

  return await runTransaction(db, async (transaction) => {
    const userSnap = await transaction.get(userRef);

    if (!userSnap.exists()) {
      throw new Error("User document does not exist");
    }

    const data = userSnap.data() as UserData;
    const lastIncrement = data.lastStreakIncrement as Timestamp | undefined;

    let alreadyClaimed = false;

    if (lastIncrement) {
      const lastDate = lastIncrement.toDate().toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];
      alreadyClaimed = lastDate === today;
    }

    if (alreadyClaimed) {
      return null;
    }

    transaction.update(userRef, {
      streak: increment(1),
      lastStreakIncrement: serverTimestamp(),
    });

    return (data.streak ?? 0) + 1;
  });
}

/* ────────────────────────────────────────────────
   LEADERBOARD FUNCTIONS
───────────────────────────────────────────────── */

/**
 * Recommended function for now:
 * Fetches many users WITHOUT orderBy → gets users even with streak=0 or missing field
 * Sorts client-side
 */
export async function getAllUsersForLeaderboard(maxUsers: number = 200): Promise<Array<{
  uid: string;
  name: string;
  streak: number;
  photoURL?: string;
  rank: number;
}>> {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, limit(maxUsers));

    const snap = await getDocs(q);

    console.log(`[Leaderboard] Fetched ${snap.size} users (without ordering)`);

    const users = snap.docs.map((docSnap) => {
      const data = docSnap.data() as Partial<UserData>;

      const name = [data.firstName || '', data.lastName || '']
        .filter(Boolean)
        .join(' ')
        .trim() || 'User';

      return {
        uid: docSnap.id,
        name,
        streak: data.streak != null ? Number(data.streak) : 0,
        photoURL: data.photoURL,
      };
    });

    // Sort: highest streak first, then alphabetically by name
    users.sort((a, b) => {
      if (b.streak !== a.streak) return b.streak - a.streak;
      return a.name.localeCompare(b.name);
    });

    // Assign ranks
    return users.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
  } catch (error: any) {
    console.error("getAllUsersForLeaderboard failed:", error);
    return [];
  }
}

/**
 * Original server-side ordered version (requires index + streak field on all docs)
 * Keep this for later when you want efficient large-scale ordering
 */
export async function getLeaderboardByStreak(limitCount: number = 20): Promise<Array<{
  uid: string;
  name: string;
  streak: number;
  photoURL?: string;
}>> {
  try {
    const q = query(
      collection(db, "users"),
      orderBy("streak", "desc"),
      limit(limitCount)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      console.warn("No users returned by ordered query → check index & streak field");
    }

    return snap.docs.map((doc) => {
      const data = doc.data() as UserData;
      return {
        uid: doc.id,
        name: [data.firstName || '', data.lastName || ''].join(' ').trim() || 'Anonymous',
        streak: data.streak ?? 0,
        photoURL: data.photoURL,
      };
    });
  } catch (error: any) {
    console.error("getLeaderboardByStreak failed:", error.code, error.message);
    return [];
  }
}

// ────────────────────────────────────────────────
// Deprecated / older versions (you can remove later)
// ────────────────────────────────────────────────

export async function getTopUsersByStreak(topN: number = 20) {
  console.warn("Using deprecated getTopUsersByStreak → switch to getAllUsersForLeaderboard");
  return getLeaderboardByStreak(topN);
}

export async function getTopUsersByStreakWithLimit(limitVal: number = 1000) {
  console.warn("Using deprecated getTopUsersByStreakWithLimit → switch to getAllUsersForLeaderboard");
  return getLeaderboardByStreak(limitVal);
}