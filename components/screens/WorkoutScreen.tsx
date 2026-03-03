'use client';

import React, { useState, useEffect } from 'react';
import { getWorkouts, Workout, addWorkout } from '@/lib/firestore/Workouts';
import { auth, db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

// ─── Types ────────────────────────────────────────────────────────────────

type Category = {
  id: number;
  name: string;
  icon: React.ReactNode;
  count: number;
  color: string;
};

type ModalType = 'category' | 'workout' | 'myWorkout' | 'quickStart' | 'custom' | 'goals' | 'progress';
type ModalState = { type: ModalType; payload: any } | null;

interface CompletedWorkout {
  id: string;
  workoutId: string;
  title: string;
  trainer: string;
  duration: string;
  difficulty: string;
  calories: number;
  completedAt: any;
}

// ─── MODAL COMPONENTS ─────────────────────────────────────────────────────

function CategoryDetailView({ category }: { category: Category }) {
  return (
    <div className="space-y-6">
      <div className={`bg-gradient-to-br ${category.color} rounded-xl p-8 text-center text-white`}>
        <div className="text-6xl mb-4">{category.icon}</div>
        <h2 className="text-3xl font-bold">{category.name}</h2>
        <p className="mt-2 opacity-90">{category.count} workouts available</p>
      </div>
      <p className="text-center text-gray-400">Category details coming soon...</p>
    </div>
  );
}

function WorkoutDetailView({ workout, onClose }: { workout: DetailedWorkout; onClose?: () => void }) {
  const [started, setStarted] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const exercises = [
    { name: 'Warm Up', sets: '—', reps: '5 min', rest: '—' },
    { name: 'Exercise A', sets: '4', reps: '10', rest: '60s' },
    { name: 'Exercise B', sets: '3', reps: '12', rest: '45s' },
    { name: 'Exercise C', sets: '3', reps: '8', rest: '60s' },
    { name: 'Exercise D', sets: '4', reps: '15', rest: '30s' },
    { name: 'Cool Down', sets: '—', reps: '5 min', rest: '—' },
  ];

  const difficultyColor =
    workout.difficulty === 'Beginner' ? 'text-green-400 bg-green-500/20' :
    workout.difficulty === 'Intermediate' ? 'text-yellow-400 bg-yellow-500/20' :
    'text-red-400 bg-red-500/20';

  const handleStartWorkout = () => {
    setIsStarting(true);
    setTimeout(() => {
      setStarted(true);
      setIsStarting(false);
    }, 420);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center" style={{ fontFamily: 'Oswald, sans-serif' }}>
        {workout.title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="bg-gray-900 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Duration</div>
          <div className="text-xl font-bold text-red-500">{workout.duration}</div>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Difficulty</div>
          <div className="text-xl font-bold text-red-500">{workout.difficulty}</div>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Calories</div>
          <div className="text-xl font-bold text-red-500">{workout.calories}</div>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Trainer</div>
          <div className="text-xl font-bold text-red-500">{workout.trainer || '—'}</div>
        </div>
      </div>

      {/* Action */}
      {!started ? (
        <button
          onClick={handleStartWorkout}
          disabled={isStarting}
          className={`w-full bg-red-500 hover:bg-red-600 py-3 rounded-lg font-bold transition-all ${isStarting ? 'animate-button-pop cursor-wait' : ''}`}
        >
          {isStarting ? '⏳ STARTING WORKOUT...' : '🏋️ START WORKOUT'}
        </button>
      ) : (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="font-bold text-green-400 text-lg">Workout Started!</h3>
          <p className="text-gray-400 text-sm mt-1">Your {workout.name} session is now active. Let's go!</p>
        </div>
      )}
    </div>
  );
}

function MyWorkoutDetailView({ workout, onClose }: { workout: MyWorkout; onClose?: () => void }) {
  const [isStarting, setIsStarting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const exercises = Array.from({ length: workout.exercises }, (_, i) => ({
    name: `Exercise ${i + 1}`,
    sets: 3,
    reps: i % 3 === 0 ? 10 : i % 3 === 1 ? 12 : 8,
  }));

  const handleStartWorkout = () => {
    setIsStarting(true);
    setTimeout(() => {
      setHasStarted(true);
      setIsStarting(false);
    }, 420);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{workout.title}</h2>
      <p className="text-gray-400">by {workout.trainer}</p>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-sm text-gray-500">Duration</div>
          <div className="text-lg font-bold text-red-500">{workout.duration}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Difficulty</div>
          <div className="text-lg font-bold text-red-500">{workout.difficulty}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Calories</div>
          <div className="text-lg font-bold text-red-500">{workout.calories}</div>
        </div>
      </div>

      {!hasStarted ? (
        <button
          onClick={handleStartWorkout}
          disabled={isStarting}
          className={`w-full bg-red-500 hover:bg-red-600 py-3 rounded-lg font-bold transition-all ${isStarting ? 'animate-button-pop cursor-wait' : ''}`}
        >
          {isStarting ? '⏳ STARTING WORKOUT...' : '🏋️ START WORKOUT'}
        </button>
      ) : (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
          <div className="font-semibold text-green-400">Workout is active</div>
          <div className="text-sm text-gray-400 mt-1">Timer and tracking are now running for this plan.</div>
        </div>
      )}
    </div>
  );
}

function QuickStartView() {
  return (
    <div className="text-center space-y-6">
      <div className="text-6xl">⚡</div>
      <h2 className="text-2xl font-bold">Quick Start</h2>
      <p className="text-gray-400">Choose a fast workout type</p>
      <button className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl font-bold text-lg">
        START QUICK SESSION
      </button>
    </div>
  );
}

function CustomWorkoutView({ onClose }: { onClose?: () => void }) {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [calories, setCalories] = useState('');
  const [trainer, setTrainer] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !duration.trim() || !calories.trim()) {
      setError('Title, Duration and Calories are required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await addWorkout({
        title: title.trim(),
        duration: duration.trim(),
        difficulty,
        calories: Number(calories.trim()),
        trainer: trainer.trim() || undefined,
      } as any);

      setSuccess(true);
      setTimeout(() => {
        onClose?.();
        // Reset form after close
        setTitle('');
        setDuration('');
        setCalories('');
        setTrainer('');
        setDifficulty('Beginner');
        setSuccess(false);
      }, 2200);
    } catch (err: any) {
      setError('Failed to save workout. Try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-7xl animate-bounce">🎉</div>
        <h3 className="text-2xl font-bold text-green-400">Workout Created!</h3>
        <p className="text-gray-300">"{title}" was added successfully.</p>
        <p className="text-sm text-gray-500">Closing in a moment...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center" style={{ fontFamily: 'Oswald, sans-serif' }}>
        CREATE <span className="text-red-500">CUSTOM WORKOUT</span>
      </h2>

      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Workout Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Evening Power Session"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Duration *</label>
        <input
          type="text"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="e.g. 40 min"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Difficulty</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Estimated Calories *</label>
        <input
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          placeholder="e.g. 420"
          min="50"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Trainer (optional)</label>
        <input
          type="text"
          value={trainer}
          onChange={(e) => setTrainer(e.target.value)}
          placeholder="e.g. Harsh"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className={`flex-1 py-3 rounded-lg font-bold transition-colors ${
            saving ? 'bg-gray-600 cursor-wait' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {saving ? 'Saving...' : 'Save Workout'}
        </button>
      </div>
    </form>
  );
}

// ─── MODAL COMPONENT ──────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">{title}</h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl transition-colors"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── MODAL TITLES ─────────────────────────────────────────────────────────

const modalTitles: Record<ModalType, string> = {
  category: 'Category Details',
  workout: 'Workout Details',
  myWorkout: 'Your Workout',
  quickStart: 'Quick Start',
  custom: 'Create Custom Workout',
  goals: 'Set Goals',
  progress: 'Track Progress',
};

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────

export default function WorkoutsScreen() {
  const [modal, setModal] = useState<ModalState>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [myCompletedWorkouts, setMyCompletedWorkouts] = useState<CompletedWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [startStatus, setStartStatus] = useState<Record<string, 'idle' | 'loading' | 'done'>>({});

  const openModal = (type: ModalType, payload?: any) => setModal({ type, payload });
  const closeModal = () => setModal(null);

  // Auth listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return unsubscribe;
  }, []);

  // Load public workouts
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getWorkouts();
        setWorkouts(data);
      } catch (err: any) {
        setError('Failed to load workouts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Load user's completed workouts
  useEffect(() => {
    if (!user?.uid) return;

    async function loadCompleted() {
      try {
        const qRef = query(
          collection(db, `users/${user.uid}/completedWorkouts`),
          orderBy('completedAt', 'desc')
        );
        const snap = await getDocs(qRef);
        const items = snap.docs.map(d => ({
          id: d.id,
          ...d.data()
        })) as CompletedWorkout[];
        setMyCompletedWorkouts(items);
      } catch (err) {
        console.error('Failed to load completed workouts:', err);
      }
    }

    loadCompleted();
  }, [user?.uid]);

  const handleStartWorkout = async (workout: Workout) => {
    if (!user?.uid) {
      alert('Please sign in first');
      return;
    }

    const key = workout.id || 'new';
    setStartStatus(prev => ({ ...prev, [key]: 'loading' }));

    try {
      await addDoc(collection(db, `users/${user.uid}/completedWorkouts`), {
        workoutId: workout.id,
        title: workout.title,
        trainer: workout.trainer || 'Unknown',
        duration: workout.duration,
        difficulty: workout.difficulty,
        calories: workout.calories,
        completedAt: serverTimestamp(),
      });

      // optimistic update
      const optimistic = {
        id: 'optimistic-' + Date.now(),
        workoutId: workout.id!,
        title: workout.title,
        trainer: workout.trainer || 'Unknown',
        duration: workout.duration,
        difficulty: workout.difficulty,
        calories: workout.calories,
        completedAt: new Date(),
      };

      setMyCompletedWorkouts(prev => [optimistic, ...prev]);

      setStartStatus(prev => ({ ...prev, [key]: 'done' }));
      setTimeout(() => setStartStatus(prev => ({ ...prev, [key]: 'idle' })), 2000);

      openModal('workout', workout);
    } catch (err: any) {
      console.error(err);
      setStartStatus(prev => ({ ...prev, [key]: 'idle' }));
      alert('Failed to start workout');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-red-500 animate-pulse">Loading workouts...</div>;

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

  function renderModalContent() {
    if (!modal) return null;

    switch (modal.type) {
      case 'category':
        return <CategoryDetailView category={modal.payload} />;
      case 'workout':
        return <WorkoutDetailView workout={modal.payload} />;
      case 'myWorkout':
        return <MyWorkoutDetailView workout={modal.payload} />;
      case 'quickStart':
        return <QuickStartView />;
      case 'custom':
        return <CustomWorkoutView onClose={closeModal} />;
      case 'goals':
        return <div className="text-center text-gray-400 py-8">Goals feature coming soon...</div>;
      case 'progress':
        return <div className="text-center text-gray-400 py-8">Progress tracking coming soon...</div>;
      default:
        return null;
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Modal */}
      {modal && (
        <Modal title={modalTitles[modal.type]} onClose={closeModal}>
          {renderModalContent()}
        </Modal>
      )}

      <header className="text-center md:text-left">
        <h1 className="text-5xl font-bold mb-3" style={{ fontFamily: 'Oswald, sans-serif' }}>
          YOUR <span className="text-red-500">WORKOUTS</span>
        </h1>
        <p className="text-gray-400 text-lg">Choose your next challenge</p>
      </header>

      {/* Categories - unchanged */}

      {/* Recommended */}
      <section>
        <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Oswald, sans-serif' }}>
          RECOMMENDED <span className="text-red-500">FOR YOU</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map(w => {
            const key = w.id || 'temp';
            const status = startStatus[key] || 'idle';

            return (
              <div
                key={w.id}
                className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 hover:border-red-600/60 transition-all duration-300 relative overflow-hidden"
              >
                <h3 className="text-2xl font-bold mb-3">{w.title}</h3>
                <p className="text-gray-400 mb-5">by {w.trainer || '—'}</p>

                <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Duration</div>
                    <div className="text-xl font-bold text-red-400">{w.duration}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Level</div>
                    <div className="text-xl font-bold text-red-400">{w.difficulty}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Burn</div>
                    <div className="text-xl font-bold text-red-400">{w.calories} kcal</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleStartWorkout(w)}
                    disabled={status !== 'idle'}
                    className={`
                      flex-1 py-3.5 rounded-xl font-semibold text-white transition-all duration-300
                      ${status === 'loading' ? 'bg-gray-700 cursor-wait' : ''}
                      ${status === 'done'   ? 'bg-green-600 scale-105' : 'bg-red-600 hover:bg-red-700 active:scale-95'}
                    `}
                  >
                    {status === 'idle'  && 'Start'}
                    {status === 'loading' && (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Starting...
                      </div>
                    )}
                    {status === 'done' && 'Started ✓'}
                  </button>

                  <button
                    onClick={() => openModal('workout', w)}
                    className="flex-1 py-3.5 border border-gray-700 hover:border-red-600 rounded-xl font-semibold transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* My Workouts */}
      <section className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>
            MY <span className="text-red-500">WORKOUTS</span>
            {myCompletedWorkouts.length > 0 && (
              <span className="ml-4 text-xl text-red-400">({myCompletedWorkouts.length})</span>
            )}
          </h2>
          <button
            onClick={() => openModal('custom')}
            className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-red-400 font-medium transition-colors"
          >
            + Create New
          </button>
        </div>

        {myCompletedWorkouts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-xl mb-3">No workouts yet</p>
            <p>Click "Start" on any workout above to begin tracking</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCompletedWorkouts.map(entry => (
              <div
                key={entry.id}
                onClick={() => openModal('myWorkout', entry)}
                className="bg-black/60 border border-gray-800 p-6 rounded-xl hover:border-red-600/70 transition-all cursor-pointer group"
              >
                <h3 className="text-xl font-bold mb-3 group-hover:text-red-400 transition-colors">
                  {entry.title}
                </h3>
                <p className="text-gray-400 mb-4">by {entry.trainer}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{entry.duration}</span>
                  <span>{entry.difficulty}</span>
                  <span>{entry.calories} kcal</span>
                </div>
                <div className="mt-4 text-xs text-gray-600">
                  {entry.completedAt?.toDate?.()?.toLocaleString() || 'Recent'}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}