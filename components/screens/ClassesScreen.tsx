'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import {
  getTodayClasses,
  getMyBookedClasses,
  bookClass,
  cancelBooking,
  GymClass,
  UserBookedClass,
} from '@/lib/firestore/Classes';

type FilterId = 'all' | 'strength' | 'cardio' | 'yoga' | 'hiit';

type ClassFilter = {
  id: FilterId;
  name: string;
  icon: string;
};

const filters: ClassFilter[] = [
  { id: 'all', name: 'All Classes', icon: 'All' },
  { id: 'strength', name: 'Strength', icon: 'Strength' },
  { id: 'cardio', name: 'Cardio', icon: 'Cardio' },
  { id: 'yoga', name: 'Yoga', icon: 'Yoga' },
  { id: 'hiit', name: 'HIIT', icon: 'HIIT' },
];

export default function ClassesScreen() {
  const [user, setUser] = useState<any>(null);
  const [todayClasses, setTodayClasses] = useState<GymClass[]>([]);
  const [myBookings, setMyBookings] = useState<UserBookedClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedFilter, setSelectedFilter] = useState<FilterId>('all');
  const [bookingStatus, setBookingStatus] = useState<Record<string, 'idle' | 'loading' | 'done'>>({});

  // Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [justBookedClass, setJustBookedClass] = useState<GymClass | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return unsubscribe;
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [today, bookings] = await Promise.all([
          getTodayClasses(),
          user?.uid ? getMyBookedClasses(user.uid) : Promise.resolve([]),
        ]);
        setTodayClasses(today);
        setMyBookings(bookings);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load classes');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user?.uid]);

  const handleBookClass = async (cls: GymClass) => {
    if (!user?.uid) {
      alert('Please sign in to book classes');
      return;
    }
    if (cls.enrolledCount >= cls.capacity) {
      alert('This class is fully booked');
      return;
    }

    const key = cls.id;
    setBookingStatus((prev) => ({ ...prev, [key]: 'loading' }));

    try {
      await bookClass(user.uid, cls);

      // Optimistic update
      setTodayClasses((prev) =>
        prev.map((c) =>
          c.id === cls.id ? { ...c, enrolledCount: c.enrolledCount + 1 } : c
        )
      );

      const newBooking: UserBookedClass = {
        id: cls.id,
        title: cls.title,
        trainer: cls.trainer,
        time: cls.time,
        date: 'Today',
        type: cls.type,
        intensity: cls.intensity,
        bookedAt: new Date(),
        status: 'confirmed',
        duration: cls.duration,     // ← added this line to fix the type error
      };

      setMyBookings((prev) => [newBooking, ...prev]);

      // Show Success Modal
      setJustBookedClass(cls);
      setShowSuccessModal(true);

      setBookingStatus((prev) => ({ ...prev, [key]: 'done' }));
      setTimeout(() => setBookingStatus((p) => ({ ...p, [key]: 'idle' })), 2000);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to book class');
      setBookingStatus((prev) => ({ ...prev, [key]: 'idle' }));
    }
  };

  const handleCancel = async (classId: string) => {
    if (!user?.uid) return;
    if (!confirm('Cancel this booking?')) return;

    try {
      await cancelBooking(user.uid, classId);

      setMyBookings((prev) => prev.filter((b) => b.id !== classId));
      setTodayClasses((prev) =>
        prev.map((c) =>
          c.id === classId ? { ...c, enrolledCount: Math.max(0, c.enrolledCount - 1) } : c
        )
      );
    } catch (err) {
      console.error(err);
      alert('Failed to cancel booking');
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setJustBookedClass(null);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-red-500 animate-pulse">Loading classes...</div>;
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-400">
        <p className="text-xl">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-6 px-8 py-3 bg-red-600 rounded-lg font-bold hover:bg-red-700">
          Retry
        </button>
      </div>
    );
  }

  const filteredClasses = todayClasses.filter(
    (c) => selectedFilter === 'all' || c.type?.toLowerCase() === selectedFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Header & Filters */}
      <header className="text-center mt-8 md:text-left">
        <h1 className="text-5xl font-bold mb-3" style={{ fontFamily: 'Oswald, sans-serif' }}>
          GROUP <span className="text-red-500">CLASSES</span>
        </h1>
        <p className="text-gray-400 text-lg">Join our expert-led sessions</p>
      </header>

      <div className="flex flex-wrap gap-3">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedFilter(f.id as FilterId)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
              selectedFilter === f.id
                ? 'bg-red-600 text-white'
                : 'bg-gray-900 border border-gray-700 text-gray-300 hover:border-red-600 hover:text-white'
            }`}
          >
            <span>{f.icon}</span>
            <span>{f.name}</span>
          </button>
        ))}
      </div>

      {/* My Bookings Section */}
      <section className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Oswald, sans-serif' }}>
          YOUR <span className="text-red-500">BOOKINGS</span>
          {myBookings.length > 0 && <span className="ml-4 text-xl text-red-400">({myBookings.length})</span>}
        </h2>
        {myBookings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl">No bookings yet</p>
            <p className="mt-2">Book a class above to get started</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myBookings.map((b) => (
              <div key={b.id} className="bg-black/50 border border-gray-800 p-6 rounded-xl hover:border-green-600/60 transition-all">
                <h3 className="text-xl font-bold mb-2">{b.title}</h3>
                <p className="text-gray-400 mb-4">with {b.trainer}</p>
                <div className="text-sm text-gray-300 space-y-1 mb-4">
                  <div>{b.date} • {b.time}</div>
                  {b.type && <div>Type: {b.type}</div>}
                  {b.intensity && <div>Intensity: {b.intensity}</div>}
                </div>
                <button
                  onClick={() => handleCancel(b.id)}
                  className="w-full bg-gray-800 hover:bg-red-700 py-3 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel Booking
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Today's Classes */}
      <section>
        <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Oswald, sans-serif' }}>
          TODAY'S <span className="text-red-500">CLASSES</span>
        </h2>
        <div className="space-y-5">
          {filteredClasses.map((cls) => {
            const status = bookingStatus[cls.id] || 'idle';
            const isFull = cls.enrolledCount >= cls.capacity;

            return (
              <div key={cls.id} className={`bg-gradient-to-br from-gray-900 to-black border-l-4 p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${isFull ? 'border-yellow-600 opacity-75' : 'border-gray-700'} hover:border-red-600/70 transition-all`}>
                {/* Class info */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Oswald, sans-serif' }}>{cls.title}</h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-300">
                    <div> {cls.time}</div>
                    <div> {cls.trainer}</div>
                    <div> {cls.type}</div>
                    <div> {cls.intensity} Intensity</div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Spots Left</div>
                    <div className="text-2xl font-bold text-red-500">
                      {cls.capacity - cls.enrolledCount}/{cls.capacity}
                    </div>
                  </div>
                  <button
                    onClick={() => handleBookClass(cls)}
                    disabled={status !== 'idle' || isFull}
                    className={`px-8 py-3 font-bold rounded-lg transition-all whitespace-nowrap ${isFull ? 'bg-gray-700' : status === 'done' ? 'bg-green-600' : 'bg-red-600 hover:bg-red-700'}`}
                  >
                    {status === 'done' ? 'Booked ✓' : isFull ? 'FULL' : 'Book Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================== SUCCESS MODAL ==================== */}
      {showSuccessModal && justBookedClass && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-3xl max-w-md w-full p-8 text-center relative">
            <button
              onClick={closeSuccessModal}
              className="absolute top-6 right-6 text-3xl text-gray-400 hover:text-white"
            >
              ×
            </button>

            <div className="text-7xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
              BOOKING CONFIRMED!
            </h2>
            <p className="text-xl text-red-400 mb-6">{justBookedClass.title}</p>

            <p className="text-gray-300 leading-relaxed text-lg mb-8">
              Your booking is completed and you will get the session link shortly on your mail or on the website.
            </p>

            <button
              onClick={closeSuccessModal}
              className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-2xl font-bold text-lg transition-colors"
            >
              Awesome, Thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}