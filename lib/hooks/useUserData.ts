// lib/hooks/useUserData.ts
'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface AppUser {
  uid: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  photoURL?: string | null;
  membershipType?: string;
  streak?: number;
  // Add more fields as needed (goals, weeklyStats, etc.)
}

export function useUserData() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userDocRef);

        let appUser: AppUser;

        if (userSnap.exists()) {
          const data = userSnap.data();
          appUser = {
            uid: firebaseUser.uid,
            name:
              data.name ||
              `${data.firstName || ''} ${data.lastName || ''}`.trim() ||
              firebaseUser.displayName ||
              'User',
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || firebaseUser.email || '',
            photoURL: data.photoURL || firebaseUser.photoURL || null,
            membershipType: data.membershipType || 'Starter',
            streak: Number(data.streak ?? 0),
          };
        } else {
          appUser = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            photoURL: firebaseUser.photoURL || null,
            streak: 0,
          };
        }

        setUser(appUser);
      } catch (err: any) {
        console.error('Failed to load user data:', err);
        setError('Could not load user profile');
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          photoURL: firebaseUser.photoURL || null,
          streak: 0,
        });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, error };
}