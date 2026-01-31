'use client';

import React, { useState } from 'react';

// Types used across modal views
type Category = {
  id: number;
  name: string;
  icon: React.ReactNode;
  count: number;
  color: string;
};

type DetailedWorkout = {
  id: number;
  name: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  calories: number;
  equipment: string[];
  trainer?: string;
  rating?: number | string;
};

type MyWorkout = {
  id: number;
  name: string;
  exercises: number;
  lastDone: string;
  isFavorite: boolean;
};

type ModalType = 'category' | 'workout' | 'myWorkout' | 'quickStart' | 'custom' | 'goals' | 'progress';
type ModalState = { type: ModalType; payload: any } | null;

// ─── MODAL / TAB VIEWS ───────────────────────────────────────────────────────

function CategoryDetailView({ category, onClose }: { category: Category; onClose?: () => void }) {
  const sampleExercises = [
    { name: 'Exercise 1', duration: '3 min', level: 'Beginner' },
    { name: 'Exercise 2', duration: '5 min', level: 'Intermediate' },
    { name: 'Exercise 3', duration: '4 min', level: 'Intermediate' },
    { name: 'Exercise 4', duration: '6 min', level: 'Advanced' },
    { name: 'Exercise 5', duration: '5 min', level: 'Advanced' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className={`bg-gradient-to-br ${category.color} rounded-xl p-8 text-center`}>
        <div className="text-6xl mb-3">{category.icon}</div>
        <h2 className="text-3xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>{category.name}</h2>
        <p className="text-sm opacity-80 mt-1">{category.count} workouts available</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Workouts', value: category.count },
          { label: 'Avg Duration', value: '35 min' },
          { label: 'Popularity', value: '⭐ 4.7' },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
            <div className="text-xl font-bold text-red-500">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Exercise List */}
      <div>
        <h3 className="text-lg font-bold mb-3" style={{ fontFamily: 'Oswald, sans-serif' }}>
          POPULAR <span className="text-red-500">EXERCISES</span>
        </h3>
        <div className="space-y-2">
          {sampleExercises.map((ex, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 hover:border-red-500 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="text-red-500 font-bold text-sm">#{i + 1}</span>
                <span className="font-semibold">{ex.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">{ex.duration}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${ex.level === 'Beginner' ? 'bg-green-500/20 text-green-400' : ex.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                  {ex.level}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-lg font-bold text-sm transition-colors">
        BROWSE ALL {category.name.toUpperCase()} WORKOUTS
      </button>
    </div>
  );
}

function WorkoutDetailView({ workout, onClose }: { workout: DetailedWorkout; onClose?: () => void }) {
  const [started, setStarted] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>{workout.name}</h2>
            <p className="text-gray-400 text-sm mt-1">with {workout.trainer}</p>
          </div>
          <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-lg">
            <span className="text-yellow-500">⭐</span>
            <span className="font-bold text-sm">{workout.rating}</span>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Duration', value: workout.duration, icon: '⏱️' },
          { label: 'Difficulty', value: workout.difficulty, icon: '📊' },
          { label: 'Calories', value: `${workout.calories} kcal`, icon: '🔥' },
          { label: 'Equipment', value: workout.equipment.length === 1 && workout.equipment[0] === 'None' ? 'None' : workout.equipment.length, icon: '🏋️' },
        ].map((info) => (
          <div key={info.label} className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
            <div className="text-xl mb-1">{info.icon}</div>
            <div className="text-sm font-bold text-red-500">{info.value}</div>
            <div className="text-xs text-gray-500">{info.label}</div>
          </div>
        ))}
      </div>

      {/* Equipment */}
      {!(workout.equipment.length === 1 && workout.equipment[0] === 'None') && (
        <div>
          <h3 className="text-sm font-bold text-gray-400 mb-2">EQUIPMENT NEEDED</h3>
          <div className="flex flex-wrap gap-2">
            {workout.equipment.map((item, i) => (
              <span key={i} className="bg-gray-800 border border-gray-700 text-sm px-3 py-1 rounded-lg">{item}</span>
            ))}
          </div>
        </div>
      )}

      {/* Exercise Breakdown */}
      <div>
        <h3 className="text-lg font-bold mb-3" style={{ fontFamily: 'Oswald, sans-serif' }}>
          WORKOUT <span className="text-red-500">BREAKDOWN</span>
        </h3>
        <div className="border border-gray-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-4 bg-gray-900 px-4 py-2 text-xs text-gray-500 font-bold">
            <span>Exercise</span><span className="text-center">Sets</span><span className="text-center">Reps</span><span className="text-center">Rest</span>
          </div>
          {exercises.map((ex, i) => (
            <div key={i} className="grid grid-cols-4 px-4 py-3 border-t border-gray-800 hover:bg-gray-900/50 transition-colors">
              <span className="font-semibold text-sm">{ex.name}</span>
              <span className="text-center text-sm text-red-500">{ex.sets}</span>
              <span className="text-center text-sm text-red-500">{ex.reps}</span>
              <span className="text-center text-sm text-gray-500">{ex.rest}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action */}
      {!started ? (
        <button onClick={() => setStarted(true)} className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-lg font-bold transition-colors">
          🏋️ START WORKOUT
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
  const exercises = Array.from({ length: workout.exercises }, (_, i) => ({
    name: `Exercise ${i + 1}`,
    sets: 3,
    reps: i % 3 === 0 ? 10 : i % 3 === 1 ? 12 : 8,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>{workout.name}</h2>
          <p className="text-gray-400 text-sm mt-1">Last done: {workout.lastDone}</p>
        </div>
        <span className="text-2xl">{workout.isFavorite ? '❤️' : '🤍'}</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Exercises', value: workout.exercises },
          { label: 'Est. Duration', value: `${workout.exercises * 4} min` },
          { label: 'Est. Calories', value: `${workout.exercises * 35} kcal` },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
            <div className="text-xl font-bold text-red-500">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Exercise List */}
      <div>
        <h3 className="text-lg font-bold mb-3" style={{ fontFamily: 'Oswald, sans-serif' }}>
          YOUR <span className="text-red-500">EXERCISES</span>
        </h3>
        <div className="space-y-2">
          {exercises.map((ex, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <span className="font-semibold text-sm">{ex.name}</span>
              </div>
              <span className="text-xs text-gray-500">{ex.sets} × {ex.reps}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-lg font-bold transition-colors">
        🏋️ START WORKOUT
      </button>
    </div>
  );
}

function QuickStartView({ onClose }: { onClose?: () => void }) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const types = [
    { id: 'upper', label: 'Upper Body', icon: '💪', duration: '30 min' },
    { id: 'lower', label: 'Lower Body', icon: '🦵', duration: '35 min' },
    { id: 'full', label: 'Full Body', icon: '🏋️', duration: '45 min' },
    { id: 'cardio', label: 'Cardio', icon: '🏃', duration: '20 min' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-5xl mb-3">⚡</div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>QUICK <span className="text-red-500">START</span></h2>
        <p className="text-gray-400 text-sm mt-1">Pick a workout type and jump right in</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {types.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedType(t.id)}
            className={`p-5 rounded-xl border transition-all text-left ${selectedType === t.id ? 'border-red-500 bg-red-500/10' : 'border-gray-800 bg-gray-900 hover:border-gray-600'}`}
          >
            <div className="text-3xl mb-2">{t.icon}</div>
            <div className="font-bold">{t.label}</div>
            <div className="text-xs text-gray-500 mt-0.5">{t.duration}</div>
          </button>
        ))}
      </div>
      {selectedType && (
        <button className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-lg font-bold transition-colors animate-pulse">
          🏋️ BEGIN {types.find(t => t.id === selectedType)?.label.toUpperCase()} WORKOUT
        </button>
      )}
    </div>
  );
}

function CustomWorkoutView({ onClose }: { onClose?: () => void }) {
  const [name, setName] = useState('');
  const [exercises, setExercises] = useState<{ name: string }[]>([{ name: '' }]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-5xl mb-3">📋</div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>CUSTOM <span className="text-red-500">WORKOUT</span></h2>
        <p className="text-gray-400 text-sm mt-1">Build your own workout from scratch</p>
      </div>

      <div>
        <label className="text-xs text-gray-500 font-bold block mb-1">WORKOUT NAME</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Monday Grind"
          className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors"
        />
      </div>

      <div>
        <label className="text-xs text-gray-500 font-bold block mb-2">EXERCISES</label>
        <div className="space-y-2">
          {exercises.map((ex, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={ex.name}
                onChange={(e) => {
                  const updated = [...exercises];
                  updated[i].name = e.target.value;
                  setExercises(updated);
                }}
                placeholder={`Exercise ${i + 1}`}
                className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 transition-colors"
              />
              {exercises.length > 1 && (
                <button onClick={() => setExercises(exercises.filter((_, idx) => idx !== i))} className="text-gray-600 hover:text-red-500 transition-colors px-2">✕</button>
              )}
            </div>
          ))}
        </div>
        <button onClick={() => setExercises([...exercises, { name: '' }])} className="text-red-500 hover:text-red-400 text-sm font-bold mt-3 transition-colors">
          + Add Exercise
        </button>
      </div>

      <button
        disabled={!name || exercises.every(e => !e.name)}
        className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-700 disabled:text-gray-500 py-3 rounded-lg font-bold transition-colors"
      >
        💾 SAVE WORKOUT
      </button>
    </div>
  );
}

function SetGoalsView({ onClose }: { onClose?: () => void }) {
  const goals = [
    { icon: '⚖️', label: 'Lose Weight', desc: 'Burn calories & get lean' },
    { icon: '💪', label: 'Build Muscle', desc: 'Strength & hypertrophy' },
    { icon: '🏃', label: 'Improve Endurance', desc: 'Cardio & stamina' },
    { icon: '🧘', label: 'Flexibility', desc: 'Stretch & recover' },
  ];
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-5xl mb-3">🎯</div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>SET YOUR <span className="text-red-500">GOALS</span></h2>
        <p className="text-gray-400 text-sm mt-1">What are you training for?</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {goals.map((g, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`p-5 rounded-xl border text-left transition-all ${selected === i ? 'border-red-500 bg-red-500/10' : 'border-gray-800 bg-gray-900 hover:border-gray-600'}`}
          >
            <div className="text-2xl mb-2">{g.icon}</div>
            <div className="font-bold text-sm">{g.label}</div>
            <div className="text-xs text-gray-500 mt-0.5">{g.desc}</div>
          </button>
        ))}
      </div>
      {selected !== null && (
        <button className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-lg font-bold transition-colors">
          🎯 SET GOAL: {goals[selected].label.toUpperCase()}
        </button>
      )}
    </div>
  );
}

function TrackProgressView({ onClose }: { onClose?: () => void }) {
  const weekData = [
    { day: 'Mon', workouts: 1, calories: 420 },
    { day: 'Tue', workouts: 0, calories: 0 },
    { day: 'Wed', workouts: 2, calories: 650 },
    { day: 'Thu', workouts: 1, calories: 350 },
    { day: 'Fri', workouts: 1, calories: 480 },
    { day: 'Sat', workouts: 0, calories: 0 },
    { day: 'Sun', workouts: 1, calories: 300 },
  ];

  const maxCal = Math.max(...weekData.map(d => d.calories));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-5xl mb-3">📊</div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>TRACK <span className="text-red-500">PROGRESS</span></h2>
        <p className="text-gray-400 text-sm mt-1">Your weekly overview</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Workouts', value: weekData.reduce((a, d) => a + d.workouts, 0), icon: '🏋️' },
          { label: 'Calories', value: `${weekData.reduce((a, d) => a + d.calories, 0).toLocaleString()}`, icon: '🔥' },
          { label: 'Streak', value: '3 days', icon: '🔥' },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="text-lg font-bold text-red-500">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div>
        <h3 className="text-sm font-bold text-gray-400 mb-3">CALORIES BURNED THIS WEEK</h3>
        <div className="flex items-end gap-2 h-40 px-2">
          {weekData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-red-500 font-bold">{d.calories > 0 ? d.calories : ''}</span>
              <div className="w-full flex items-end justify-center" style={{ height: '100px' }}>
                <div
                  className={`w-full rounded-t-md transition-all ${d.calories > 0 ? 'bg-gradient-to-t from-red-600 to-red-400' : 'bg-gray-800'}`}
                  style={{ height: d.calories > 0 ? `${(d.calories / maxCal) * 100}%` : '8px' }}
                />
              </div>
              <span className="text-xs text-gray-500">{d.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MODAL WRAPPER ───────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 pt-5 pb-4 sticky top-0 bg-gray-950 z-10 border-b border-gray-800">
          <h3 className="font-bold text-lg" style={{ fontFamily: 'Oswald, sans-serif' }}>{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl leading-none">✕</button>
        </div>
        {/* Modal Body */}
        <div className="px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────

export default function WorkoutsScreen() {
  // Modal state: { type, payload }
  const [modal, setModal] = useState<ModalState>(null);

  const openModal = (type: ModalType, payload: any = null) => setModal({ type, payload });
  const closeModal = () => setModal(null);

  const workoutCategories = [
    { id: 1, name: 'Strength Training', icon: '🏋️', count: 45, color: 'from-red-500 to-orange-500' },
    { id: 2, name: 'Cardio', icon: '🏃', count: 32, color: 'from-blue-500 to-cyan-500' },
    { id: 3, name: 'HIIT', icon: '⚡', count: 28, color: 'from-yellow-500 to-orange-500' },
    { id: 4, name: 'Yoga & Flexibility', icon: '🧘', count: 21, color: 'from-purple-500 to-pink-500' },
    { id: 5, name: 'CrossFit', icon: '💪', count: 18, color: 'from-green-500 to-teal-500' },
    { id: 6, name: 'Boxing', icon: '🥊', count: 15, color: 'from-red-600 to-red-400' }
  ];

  const recommendedWorkouts = [
    { id: 1, name: 'Full Body Blast', duration: '45 min', difficulty: 'Intermediate', calories: 420, equipment: ['Dumbbells', 'Bench'], trainer: 'Marcus Steel', rating: 4.8 },
    { id: 2, name: 'Cardio Burn', duration: '30 min', difficulty: 'Beginner', calories: 350, equipment: ['None'], trainer: 'Sarah Burns', rating: 4.9 },
    { id: 3, name: 'Upper Body Power', duration: '50 min', difficulty: 'Advanced', calories: 480, equipment: ['Barbell', 'Dumbbells', 'Pull-up Bar'], trainer: 'Jake Titan', rating: 4.7 },
    { id: 4, name: 'Core Crusher', duration: '25 min', difficulty: 'Intermediate', calories: 280, equipment: ['Mat'], trainer: 'Luna Peace', rating: 4.6 }
  ];

  const myWorkouts = [
    { id: 1, name: 'Morning Routine', exercises: 12, lastDone: 'Today', isFavorite: true },
    { id: 2, name: 'Leg Day Beast', exercises: 15, lastDone: '2 days ago', isFavorite: true },
    { id: 3, name: 'Quick Cardio', exercises: 8, lastDone: 'Yesterday', isFavorite: false },
    { id: 4, name: 'Push Day', exercises: 14, lastDone: '3 days ago', isFavorite: true }
  ];

  // ─── Render the correct modal view based on type ───
  const renderModalContent = () => {
    if (!modal) return null;
    switch (modal.type) {
      case 'category':     return <CategoryDetailView category={modal.payload} onClose={closeModal} />;
      case 'workout':      return <WorkoutDetailView workout={modal.payload} onClose={closeModal} />;
      case 'myWorkout':    return <MyWorkoutDetailView workout={modal.payload} onClose={closeModal} />;
      case 'quickStart':   return <QuickStartView onClose={closeModal} />;
      case 'custom':       return <CustomWorkoutView onClose={closeModal} />;
      case 'goals':        return <SetGoalsView onClose={closeModal} />;
      case 'progress':     return <TrackProgressView onClose={closeModal} />;
      default:             return null;
    }
  };

  const modalTitles: Record<ModalType, string> = {
    category:  modal?.payload?.name || '',
    workout:   modal?.payload?.name || '',
    myWorkout: modal?.payload?.name || '',
    quickStart: 'Quick Start',
    custom:    'Custom Workout',
    goals:     'Set Goals',
    progress:  'Track Progress',
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ─── Modal ─── */}
      {modal && (
        <Modal title={modalTitles[modal.type]} onClose={closeModal}>
          {renderModalContent()}
        </Modal>
      )}

      {/* Header */}
      <div className="animate-slide-in">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
          YOUR <span className="text-red-500">WORKOUTS</span>
        </h1>
        <p className="text-gray-400">Find the perfect workout for your goals</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-slide-in stagger-1">
        <button onClick={() => openModal('quickStart')} className="bg-gradient-to-br from-red-500 to-red-600 p-6 hover:scale-105 transition-transform rounded-lg">
          <div className="text-3xl mb-2">⚡</div>
          <div className="text-sm font-bold">Quick Start</div>
        </button>
        <button onClick={() => openModal('custom')} className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 hover:border-red-500 transition-all rounded-lg">
          <div className="text-3xl mb-2">📋</div>
          <div className="text-sm font-bold">Custom Workout</div>
        </button>
        <button onClick={() => openModal('goals')} className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 hover:border-red-500 transition-all rounded-lg">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-sm font-bold">Set Goals</div>
        </button>
        <button onClick={() => openModal('progress')} className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 hover:border-red-500 transition-all rounded-lg">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-sm font-bold">Track Progress</div>
        </button>
      </div>

      {/* Workout Categories */}
      <div className="animate-slide-in stagger-2">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
          WORKOUT <span className="text-red-500">CATEGORIES</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {workoutCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => openModal('category', category)}
              className={`bg-gradient-to-br ${category.color} p-6 hover:scale-105 transition-transform text-center rounded-lg`}
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <div className="text-sm font-bold mb-1">{category.name}</div>
              <div className="text-xs opacity-80">{category.count} workouts</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recommended for You */}
      <div className="animate-slide-in stagger-3">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
          RECOMMENDED <span className="text-red-500">FOR YOU</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedWorkouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 hover:border-red-500 transition-all rounded-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Oswald, sans-serif' }}>{workout.name}</h3>
                  <div className="text-sm text-gray-400">with {workout.trainer}</div>
                </div>
                <div className="flex items-center space-x-1 bg-yellow-500/20 px-2 py-1 rounded">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-sm font-bold">{workout.rating}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Duration</div>
                  <div className="text-sm font-bold text-red-500">{workout.duration}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Difficulty</div>
                  <div className="text-sm font-bold text-red-500">{workout.difficulty}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Calories</div>
                  <div className="text-sm font-bold text-red-500">{workout.calories}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-2">Equipment Needed:</div>
                <div className="flex flex-wrap gap-2">
                  {workout.equipment.map((item, idx) => (
                    <span key={idx} className="text-xs bg-gray-800 px-2 py-1 rounded">{item}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => openModal('workout', workout as any)} className="bg-red-500 hover:bg-red-600 py-2 text-sm font-bold transition-colors rounded">
                  START NOW
                </button>
                <button onClick={() => openModal('workout', workout)} className="border border-gray-700 hover:border-red-500 py-2 text-sm font-bold transition-colors rounded">
                  VIEW DETAILS
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Workouts */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>
            MY <span className="text-red-500">WORKOUTS</span>
          </h2>
          <button onClick={() => openModal('custom')} className="text-red-500 hover:text-red-400 text-sm font-bold">+ CREATE NEW</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {myWorkouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-black/50 border border-gray-800 p-4 hover:border-red-500 transition-all rounded-lg"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold">{workout.name}</h3>
                <button className="text-xl">{workout.isFavorite ? '❤️' : '🤍'}</button>
              </div>
              <div className="text-sm text-gray-400 space-y-1">
                <div>{workout.exercises} exercises</div>
                <div className="text-xs">Last: {workout.lastDone}</div>
              </div>
              <button onClick={() => openModal('myWorkout', workout)} className="w-full mt-3 bg-gray-800 hover:bg-red-500 py-2 text-sm font-bold transition-colors rounded">
                START
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}