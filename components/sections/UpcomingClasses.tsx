'use client';

import { useEffect, useState } from 'react';
import { AppUser } from '@/lib/hooks/useUserData';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  orderBy,
  getDocs,
  Timestamp,
} from 'firebase/firestore';

interface UpcomingClassesProps {
  user: AppUser;
}

interface BookedClassEntry {
  id: string;
  title: string;
  time: string;
  trainer: string;
  date: string;           // e.g. "Tomorrow", "Wed", or formatted date
  type?: string;
  intensity?: string;
  bookedAt: Timestamp;
  // spotsLeft?: number;  // only if you store it per booking
}

export default function UpcomingClasses({ user }: UpcomingClassesProps) {
  const [classes, setClasses] = useState<BookedClassEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    async function fetchUpcomingBookedClasses() {
      try {
        setLoading(true);
        setError(null);

        const q = query(
          collection(db, `users/${user.uid}/bookedClasses`), // or whatever subcollection name you use
          // If your subcollection is actually called 'bookings' → change to: bookedClasses → bookings
          // collection(db, `users/${user.uid}/bookings`),
          orderBy('bookedAt', 'desc')   // or order by class date/time if you have a 'classDate' field
          // You could add: where('status', '==', 'confirmed') if you have that field
        );

        const snapshot = await getDocs(q);

        const now = new Date();
        const upcoming = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.title || 'Untitled Class',
              time: data.time || '—',
              trainer: data.trainer || '—',
              date: data.date || formatRelativeDate(data.classDate || data.bookedAt), // fallback
              type: data.type,
              intensity: data.intensity,
              bookedAt: data.bookedAt as Timestamp,
            } satisfies BookedClassEntry;
          })
          // Optional: filter only future classes (if you have classDate / startTime field)
          // .filter(cls => new Date(cls.classDate?.toDate?.() || now) >= now)
          .slice(0, 6); // limit display to 6 upcoming

        setClasses(upcoming);
      } catch (err: any) {
        console.error('Failed to load upcoming classes:', err);
        setError('Could not load upcoming classes');
      } finally {
        setLoading(false);
      }
    }

    fetchUpcomingBookedClasses();
  }, [user?.uid]);

  // Simple relative date helper (Today, Tomorrow, Wed, etc.)
  const formatRelativeDate = (timestamp?: Timestamp | Date) => {
    if (!timestamp) return '—';
    const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
    const now = new Date();
    const diffDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7 && diffDays > 1) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-2xl">
      <h2 className="text-2xl font-bold mb-5" style={{ fontFamily: 'Oswald, sans-serif' }}>
        UPCOMING <span className="text-red-500">CLASSES</span>
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-800/70 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-400">{error}</div>
      ) : classes.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No upcoming classes booked yet
          <br />
          <span className="text-sm">Book one from the classes screen</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-black/50 border border-gray-800 p-5 hover:border-red-600/60 transition-all rounded-xl flex flex-col"
            >
              <h3
                className="font-bold text-lg mb-3 group-hover:text-red-400 transition-colors"
                style={{ fontFamily: 'Oswald, sans-serif' }}
              >
                {cls.title}
              </h3>

              <div className="text-sm text-gray-400 space-y-1.5 mb-5 flex-1">
                <div>{cls.date} • {cls.time}</div>
                <div>with {cls.trainer}</div>
                {cls.type && <div>Type: {cls.type}</div>}
                {cls.intensity && <div>Intensity: {cls.intensity}</div>}
                {/* If you store spots left per class and pass it: */}
                {/* <div className="text-red-500 font-medium">{cls.spots} spots left</div> */}
              </div>

              {/* Optional: link to class details or already booked indicator */}
              <div className="mt-auto">
                <div className="w-full bg-green-900/40 text-green-400 py-2 text-center text-sm font-medium rounded-lg">
                  Booked ✓
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}