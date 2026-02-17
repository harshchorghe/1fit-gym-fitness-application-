'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PreGymData {
  weight: string;
  heartRate: string;
  energy: string;
  mood: string;
  notes: string;
}

interface PostGymData {
  weight: string;
  heartRate: string;
  duration: string;
  caloriesBurned: string;
  exercises: string;
  notes: string;
}

interface ExerciseEntry {
  name: string;
  sets: string;
  reps: string;
  weight: string;
}

interface SessionReport {
  preData: PreGymData;
  postData: PostGymData;
  exercises: ExerciseEntry[];
  date: string;
  totalVolume: number;
  bodyWeightChange: number;
  performanceScore: number;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [workoutStep, setWorkoutStep] = useState(1);
  const [showPreWorkoutModal, setShowPreWorkoutModal] = useState(false);
  const [showPostWorkoutModal, setShowPostWorkoutModal] = useState(false);
  const [showProgressReport, setShowProgressReport] = useState(false);
  const [sessionReport, setSessionReport] = useState<SessionReport | null>(null);
  const [exerciseLog, setExerciseLog] = useState<ExerciseEntry[]>([]);
  const [currentExercise, setCurrentExercise] = useState<ExerciseEntry>({
    name: '', sets: '', reps: '', weight: ''
  });
  const [preGymData, setPreGymData] = useState<PreGymData>({
    weight: '', heartRate: '', energy: '', mood: '', notes: ''
  });
  const [postGymData, setPostGymData] = useState<PostGymData>({
    weight: '', heartRate: '', duration: '', caloriesBurned: '', exercises: '', notes: ''
  });

  // ── Exercise helpers ──
  const EXERCISE_SUGGESTIONS = [
    'Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Pull-Ups',
    'Barbell Row', 'Leg Press', 'Incline Bench Press', 'Lat Pulldown', 'Cable Row',
    'Bicep Curl', 'Tricep Dip', 'Leg Extension', 'Leg Curl', 'Calf Raise',
    'Lunges', 'Romanian Deadlift', 'Face Pull', 'Lateral Raise', 'Hip Thrust',
    'Chest Fly', 'Hammer Curl', 'Skull Crusher', 'Bulgarian Split Squat', 'Plank'
  ];

  const addExercise = () => {
    if (!currentExercise.name || !currentExercise.sets || !currentExercise.reps) return;
    setExerciseLog(prev => [...prev, { ...currentExercise }]);
    setCurrentExercise({ name: '', sets: '', reps: '', weight: '' });
  };

  const removeExercise = (index: number) => {
    setExerciseLog(prev => prev.filter((_, i) => i !== index));
  };

  const calculateReport = (): SessionReport => {
    const totalVolume = exerciseLog.reduce((sum, ex) => {
      return sum + (parseInt(ex.sets) || 0) * (parseInt(ex.reps) || 0) * (parseFloat(ex.weight) || 1);
    }, 0);
    const bodyWeightChange = parseFloat(postGymData.weight) - parseFloat(preGymData.weight);
    const energyScore = parseInt(preGymData.energy) * 10;
    const volumeScore = Math.min(100, (exerciseLog.length / 6) * 100);
    const durationScore = Math.min(100, (parseInt(postGymData.duration) / 60) * 100);
    const performanceScore = Math.round(energyScore * 0.3 + volumeScore * 0.4 + durationScore * 0.3);
    return {
      preData: preGymData,
      postData: postGymData,
      exercises: exerciseLog,
      date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      totalVolume: Math.round(totalVolume),
      bodyWeightChange: Math.round(bodyWeightChange * 10) / 10,
      performanceScore
    };
  };

  const handlePreGymSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPreWorkoutModal(false);
    setWorkoutStep(1);
  };

  const handlePostGymSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSessionReport(calculateReport());
    setShowPostWorkoutModal(false);
    setShowProgressReport(true);
  };

  const resetSession = () => {
    setShowProgressReport(false);
    setExerciseLog([]);
    setPreGymData({ weight: '', heartRate: '', energy: '', mood: '', notes: '' });
    setPostGymData({ weight: '', heartRate: '', duration: '', caloriesBurned: '', exercises: '', notes: '' });
    setSessionReport(null);
  };

  // Dummy User Data
  const user = {
    name: 'Alex Thompson',
    memberSince: 'Jan 2024',
    membershipType: 'Pro',
    image: '👤',
    streak: 12,
    level: 'Advanced'
  };

  // Today's Classes
  const todayClasses = [
    { id: 1, name: 'HIIT Cardio', time: '06:00 AM', trainer: 'Sarah Burns', status: 'completed', duration: '45 min' },
    { id: 2, name: 'Strength Training', time: '09:00 AM', trainer: 'Marcus Steel', status: 'upcoming', duration: '60 min' },
    { id: 3, name: 'Yoga Flow', time: '06:00 PM', trainer: 'Luna Peace', status: 'booked', duration: '50 min' }
  ];

  // Recent Workouts
  const recentWorkouts = [
    { id: 1, name: 'Upper Body Blast', date: 'Today', duration: '58 min', calories: 420, sets: 24 },
    { id: 2, name: 'Leg Day Destroyer', date: 'Yesterday', duration: '62 min', calories: 510, sets: 28 },
    { id: 3, name: 'Core & Cardio', date: '2 days ago', duration: '45 min', calories: 380, sets: 18 },
    { id: 4, name: 'Full Body Power', date: '3 days ago', duration: '55 min', calories: 465, sets: 22 }
  ];

  // This Week's Stats
  const weekStats = {
    workouts: 5,
    totalTime: '4h 32m',
    calories: 2150,
    avgHeartRate: 142
  };

  // Upcoming Classes
  const upcomingClasses = [
    { id: 1, name: 'Boxing Circuit', day: 'Tomorrow', time: '07:00 AM', trainer: 'Rocky Iron', spots: 3 },
    { id: 2, name: 'Spin Class', day: 'Tomorrow', time: '06:00 PM', trainer: 'Alex Thunder', spots: 5 },
    { id: 3, name: 'CrossFit', day: 'Wed', time: '07:00 PM', trainer: 'Jake Titan', spots: 2 }
  ];

  // Goals
  const goals = [
    { id: 1, name: 'Weekly Workouts', current: 5, target: 6, unit: 'sessions' },
    { id: 2, name: 'Monthly Calories', current: 8600, target: 10000, unit: 'kcal' },
    { id: 3, name: 'Strength Progress', current: 85, target: 100, unit: 'kg' }
  ];

  // Personal Records
  const personalRecords = [
    { exercise: 'Bench Press', weight: '120 kg', date: 'Jan 20, 2026' },
    { exercise: 'Deadlift', weight: '180 kg', date: 'Jan 15, 2026' },
    { exercise: 'Squat', weight: '150 kg', date: 'Jan 18, 2026' },
    { exercise: '5K Run', weight: '22:15', date: 'Jan 10, 2026' }
  ];

  // Achievements
  const achievements = [
    { id: 1, name: '30 Day Streak', icon: '🔥', unlocked: true },
    { id: 2, name: 'Early Bird', icon: '🌅', unlocked: true },
    { id: 3, name: 'Iron Warrior', icon: '⚔️', unlocked: true },
    { id: 4, name: 'Cardio King', icon: '👑', unlocked: false }
  ];

  const navigationItems = [
    { name: 'Overview', icon: '📊', key: 'overview' },
    { name: 'Workouts', icon: '💪', key: 'workouts' },
    { name: 'Classes', icon: '📅', key: 'classes' },
    { name: 'Progress', icon: '📈', key: 'progress' },
    { name: 'Nutrition', icon: '🥗', key: 'nutrition' },
    { name: 'Community', icon: '👥', key: 'community' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Barlow:wght@300;400;600&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Barlow', sans-serif;
          background: #000;
          color: #fff;
        }

        .grain {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 100;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulance type='fractalNoise' baseFrequency='2.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }

        .animate-fade-scale {
          animation: fadeScaleIn 0.3s ease-out forwards;
        }

        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="grain"></div>

      {/* ── Top Navigation ── */}
      <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-lg border-b border-gray-900 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                className="lg:hidden text-white"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="text-2xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>
                <span className="text-white">1</span>
                <span className="text-red-500">FIT</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 hover:bg-gray-900 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3 p-2 hover:bg-gray-900 rounded-lg transition-colors cursor-pointer">
                <div className="text-3xl">{user.image}</div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-semibold">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.membershipType} Member</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* ── Sidebar ── */}
        <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-gray-900/50 backdrop-blur-lg border-r border-gray-800 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 z-40 mt-16 lg:mt-0`}>
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActiveTab(item.key);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.key
                    ? 'bg-red-500 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-semibold">{item.name}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 mt-4 border-t border-gray-800">
            <div className="bg-gradient-to-br from-red-500/20 to-black border border-red-500/30 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">🔥</span>
                <div>
                  <div className="text-xs text-gray-400">Current Streak</div>
                  <div className="text-xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    {user.streak} Days
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-2">Keep it going! 3 more days to unlock the 15-day badge.</div>
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">

          {/* ════════════════════════════════════════════════
              PRE-WORKOUT MODAL
          ════════════════════════════════════════════════ */}
          {showPreWorkoutModal && (
            <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
              <div className="animate-fade-scale bg-[#0a0a0a] border border-gray-800 rounded-xl w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl shadow-red-500/10">

                {/* Header */}
                <div className="sticky top-0 bg-[#0a0a0a] border-b border-gray-800 px-6 py-4 flex justify-between items-center z-10">
                  <div>
                    <div className="text-xs text-red-500 tracking-[0.3em] uppercase font-semibold mb-1">Session Begins</div>
                    <h2 className="text-2xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>
                      PRE-WORKOUT <span className="text-red-500">ASSESSMENT</span>
                    </h2>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Step dots */}
                    <div className="flex gap-1.5">
                      {[1, 2].map(step => (
                        <div key={step} className={`w-8 h-1 rounded-full transition-all duration-300 ${workoutStep >= step ? 'bg-red-500' : 'bg-gray-700'}`} />
                      ))}
                    </div>
                    <button onClick={() => { setShowPreWorkoutModal(false); setWorkoutStep(1); }}
                      className="text-gray-500 hover:text-white transition-colors p-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {/* ── STEP 1: Body Metrics & Readiness ── */}
                  {workoutStep === 1 && (
                    <div>
                      <div className="flex items-center gap-2 mb-5">
                        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold">1</div>
                        <span className="text-sm text-gray-400 uppercase tracking-wider">Body Metrics & Readiness</span>
                      </div>

                      {/* Weight + Heart Rate */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 focus-within:border-red-500 transition-colors">
                          <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Body Weight</label>
                          <div className="flex items-end gap-2">
                            <input
                              type="number" step="0.1"
                              value={preGymData.weight}
                              onChange={(e) => setPreGymData({ ...preGymData, weight: e.target.value })}
                              placeholder="75.0"
                              className="flex-1 bg-transparent text-3xl font-bold text-white placeholder-gray-700 focus:outline-none w-full"
                              style={{ fontFamily: 'Oswald, sans-serif' }}
                            />
                            <span className="text-gray-500 text-sm mb-1">KG</span>
                          </div>
                        </div>
                        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 focus-within:border-red-500 transition-colors">
                          <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Resting Heart Rate</label>
                          <div className="flex items-end gap-2">
                            <input
                              type="number"
                              value={preGymData.heartRate}
                              onChange={(e) => setPreGymData({ ...preGymData, heartRate: e.target.value })}
                              placeholder="72"
                              className="flex-1 bg-transparent text-3xl font-bold text-white placeholder-gray-700 focus:outline-none w-full"
                              style={{ fontFamily: 'Oswald, sans-serif' }}
                            />
                            <span className="text-gray-500 text-sm mb-1">BPM</span>
                          </div>
                        </div>
                      </div>

                      {/* Energy Level */}
                      <div className="mb-5">
                        <label className="text-xs text-gray-400 uppercase tracking-wider mb-3 block">Energy Level</label>
                        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                          {[1,2,3,4,5,6,7,8,9,10].map(num => (
                            <button key={num} type="button"
                              onClick={() => setPreGymData({ ...preGymData, energy: String(num) })}
                              className={`h-10 rounded font-bold text-sm transition-all ${
                                preGymData.energy === String(num)
                                  ? 'bg-red-500 text-white scale-110 shadow-lg shadow-red-500/40'
                                  : 'bg-gray-900 text-gray-500 hover:bg-gray-800 hover:text-white border border-gray-800'
                              }`}
                              style={{ fontFamily: 'Oswald, sans-serif' }}>
                              {num}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-600">
                          <span>💀 Dying</span>
                          <span>😐 Okay</span>
                          <span>⚡ Beast Mode</span>
                        </div>
                      </div>

                      {/* Mood Selector */}
                      <div className="mb-5">
                        <label className="text-xs text-gray-400 uppercase tracking-wider mb-3 block">Current Mood</label>
                        <div className="grid grid-cols-5 gap-2">
                          {[
                            { emoji: '💪', label: 'Pumped', value: 'Pumped' },
                            { emoji: '😌', label: 'Calm', value: 'Calm' },
                            { emoji: '😴', label: 'Tired', value: 'Tired' },
                            { emoji: '😤', label: 'Angry', value: 'Angry' },
                            { emoji: '😊', label: 'Good', value: 'Good' },
                          ].map(m => (
                            <button key={m.value} type="button"
                              onClick={() => setPreGymData({ ...preGymData, mood: m.value })}
                              className={`flex flex-col items-center py-3 rounded-lg border transition-all ${
                                preGymData.mood === m.value
                                  ? 'border-red-500 bg-red-500/15 scale-105 shadow-lg shadow-red-500/20'
                                  : 'border-gray-800 bg-gray-900/50 hover:border-gray-600'
                              }`}>
                              <span className="text-2xl mb-1">{m.emoji}</span>
                              <span className="text-xs text-gray-400">{m.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="mb-6">
                        <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Notes / Injuries</label>
                        <textarea
                          value={preGymData.notes}
                          onChange={(e) => setPreGymData({ ...preGymData, notes: e.target.value })}
                          placeholder="Any soreness, injuries, or things to keep in mind today..."
                          className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-red-500 transition-colors resize-none h-20"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!preGymData.weight || !preGymData.heartRate || !preGymData.energy || !preGymData.mood) return;
                          setWorkoutStep(2);
                        }}
                        disabled={!preGymData.weight || !preGymData.heartRate || !preGymData.energy || !preGymData.mood}
                        className="w-full py-3.5 bg-red-500 hover:bg-red-600 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed font-bold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        style={{ fontFamily: 'Oswald, sans-serif', letterSpacing: '0.1em' }}>
                        NEXT: LOG YOUR EXERCISES →
                      </button>
                    </div>
                  )}

                  {/* ── STEP 2: Exercise Logger ── */}
                  {workoutStep === 2 && (
                    <form onSubmit={handlePreGymSubmit}>
                      <div className="flex items-center gap-2 mb-5">
                        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold">2</div>
                        <span className="text-sm text-gray-400 uppercase tracking-wider">Plan Your Exercises</span>
                        <span className="ml-auto text-xs text-gray-600 italic">You can also add more post-workout</span>
                      </div>

                      {/* Exercise Input */}
                      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                          <div className="sm:col-span-2">
                            <input
                              list="exercise-suggestions"
                              value={currentExercise.name}
                              onChange={(e) => setCurrentExercise({ ...currentExercise, name: e.target.value })}
                              placeholder="Exercise name..."
                              className="w-full bg-black border border-gray-700 rounded px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors"
                            />
                            <datalist id="exercise-suggestions">
                              {EXERCISE_SUGGESTIONS.map(ex => <option key={ex} value={ex} />)}
                            </datalist>
                          </div>
                          <input
                            type="number" min="1"
                            value={currentExercise.sets}
                            onChange={(e) => setCurrentExercise({ ...currentExercise, sets: e.target.value })}
                            placeholder="Sets"
                            className="bg-black border border-gray-700 rounded px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors"
                          />
                          <input
                            type="number" min="1"
                            value={currentExercise.reps}
                            onChange={(e) => setCurrentExercise({ ...currentExercise, reps: e.target.value })}
                            placeholder="Reps"
                            className="bg-black border border-gray-700 rounded px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors"
                          />
                        </div>
                        <div className="flex gap-3">
                          <input
                            type="number" step="0.5"
                            value={currentExercise.weight}
                            onChange={(e) => setCurrentExercise({ ...currentExercise, weight: e.target.value })}
                            placeholder="Weight in kg — leave blank for bodyweight"
                            className="flex-1 bg-black border border-gray-700 rounded px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors"
                          />
                          <button
                            type="button" onClick={addExercise}
                            disabled={!currentExercise.name || !currentExercise.sets || !currentExercise.reps}
                            className="px-5 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed font-bold text-sm rounded transition-all"
                            style={{ fontFamily: 'Oswald, sans-serif' }}>
                            + ADD
                          </button>
                        </div>
                      </div>

                      {/* Exercise List */}
                      {exerciseLog.length === 0 ? (
                        <div className="text-center py-8 border border-dashed border-gray-800 rounded-lg mb-4">
                          <div className="text-4xl mb-2">📋</div>
                          <div className="text-sm text-gray-600">No exercises added yet</div>
                          <div className="text-xs text-gray-700 mt-1">Add your plan above — or skip and start</div>
                        </div>
                      ) : (
                        <div className="space-y-2 mb-4">
                          {exerciseLog.map((ex, i) => (
                            <div key={i} className="flex items-center justify-between bg-black border border-gray-800 hover:border-red-500/40 rounded-lg px-4 py-3 transition-all group">
                              <div>
                                <div className="font-bold text-sm" style={{ fontFamily: 'Oswald, sans-serif' }}>{ex.name}</div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                  {ex.sets} sets × {ex.reps} reps {ex.weight ? `@ ${ex.weight} kg` : '(bodyweight)'}
                                </div>
                              </div>
                              <button type="button" onClick={() => removeExercise(i)}
                                className="text-gray-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 ml-3">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                          <div className="flex items-center gap-2 pt-1 px-1">
                            <div className="text-xs text-gray-600">{exerciseLog.length} exercises planned</div>
                            <div className="h-px flex-1 bg-gray-800" />
                            <div className="text-xs text-red-500 font-semibold">
                              {exerciseLog.reduce((s, e) => s + (parseInt(e.sets) || 0), 0)} total sets
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3 mt-6">
                        <button type="button" onClick={() => setWorkoutStep(1)}
                          className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-sm font-bold rounded-lg transition-all border border-gray-800"
                          style={{ fontFamily: 'Oswald, sans-serif' }}>
                          ← BACK
                        </button>
                        <button type="submit"
                          className="flex-1 py-3 bg-red-500 hover:bg-red-600 font-bold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                          style={{ fontFamily: 'Oswald, sans-serif', letterSpacing: '0.1em' }}>
                          LET&apos;S GO — START WORKOUT 🔥
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════
              POST-WORKOUT MODAL
          ════════════════════════════════════════════════ */}
          {showPostWorkoutModal && (
            <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
              <div className="animate-fade-scale bg-[#0a0a0a] border border-gray-800 rounded-xl w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl shadow-green-500/5">

                {/* Header */}
                <div className="sticky top-0 bg-[#0a0a0a] border-b border-gray-800 px-6 py-4 flex justify-between items-center z-10">
                  <div>
                    <div className="text-xs text-green-500 tracking-[0.3em] uppercase font-semibold mb-1">Session Complete</div>
                    <h2 className="text-2xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>
                      POST-WORKOUT <span className="text-green-400">LOG</span>
                    </h2>
                  </div>
                  <button onClick={() => setShowPostWorkoutModal(false)}
                    className="text-gray-500 hover:text-white transition-colors p-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handlePostGymSubmit} className="p-6">

                  {/* Pre-session reminder strip */}
                  {preGymData.weight && (
                    <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-3 mb-5 flex items-center gap-3 flex-wrap">
                      <span className="text-xs text-gray-500 uppercase tracking-wider">Pre-session:</span>
                      <span className="text-xs text-white">{preGymData.weight} kg</span>
                      <span className="text-gray-700 text-xs">|</span>
                      <span className="text-xs text-white">{preGymData.heartRate} BPM</span>
                      <span className="text-gray-700 text-xs">|</span>
                      <span className="text-xs text-white">Energy {preGymData.energy}/10</span>
                      <span className="text-gray-700 text-xs">|</span>
                      <span className="text-xs">
                        {preGymData.mood === 'Pumped' ? '💪' : preGymData.mood === 'Calm' ? '😌' : preGymData.mood === 'Tired' ? '😴' : preGymData.mood === 'Angry' ? '😤' : '😊'} {preGymData.mood}
                      </span>
                    </div>
                  )}

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-5">

                    {/* Post Weight */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 focus-within:border-green-500/50 transition-colors">
                      <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Post Weight</label>
                      <div className="flex items-end gap-2">
                        <input
                          type="number" step="0.1"
                          value={postGymData.weight}
                          onChange={(e) => setPostGymData({ ...postGymData, weight: e.target.value })}
                          placeholder="74.5"
                          className="flex-1 bg-transparent text-3xl font-bold text-white placeholder-gray-700 focus:outline-none w-full"
                          style={{ fontFamily: 'Oswald, sans-serif' }}
                          required
                        />
                        <span className="text-gray-500 text-sm mb-1">KG</span>
                      </div>
                      {preGymData.weight && postGymData.weight && (
                        <div className={`text-xs mt-2 font-semibold ${parseFloat(postGymData.weight) < parseFloat(preGymData.weight) ? 'text-green-400' : 'text-yellow-500'}`}>
                          {parseFloat(postGymData.weight) < parseFloat(preGymData.weight)
                            ? `▼ ${(parseFloat(preGymData.weight) - parseFloat(postGymData.weight)).toFixed(1)} kg water loss`
                            : `▲ ${(parseFloat(postGymData.weight) - parseFloat(preGymData.weight)).toFixed(1)} kg`}
                        </div>
                      )}
                    </div>

                    {/* Post Heart Rate */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 focus-within:border-green-500/50 transition-colors">
                      <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Post Heart Rate</label>
                      <div className="flex items-end gap-2">
                        <input
                          type="number"
                          value={postGymData.heartRate}
                          onChange={(e) => setPostGymData({ ...postGymData, heartRate: e.target.value })}
                          placeholder="90"
                          className="flex-1 bg-transparent text-3xl font-bold text-white placeholder-gray-700 focus:outline-none w-full"
                          style={{ fontFamily: 'Oswald, sans-serif' }}
                          required
                        />
                        <span className="text-gray-500 text-sm mb-1">BPM</span>
                      </div>
                      {preGymData.heartRate && postGymData.heartRate && (
                        <div className="text-xs mt-2 text-gray-500">
                          ↑ {Math.abs(parseInt(postGymData.heartRate) - parseInt(preGymData.heartRate))} BPM above resting
                        </div>
                      )}
                    </div>

                    {/* Duration */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 focus-within:border-green-500/50 transition-colors">
                      <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Duration</label>
                      <div className="flex items-end gap-2">
                        <input
                          type="number"
                          value={postGymData.duration}
                          onChange={(e) => setPostGymData({ ...postGymData, duration: e.target.value })}
                          placeholder="60"
                          className="flex-1 bg-transparent text-3xl font-bold text-white placeholder-gray-700 focus:outline-none w-full"
                          style={{ fontFamily: 'Oswald, sans-serif' }}
                          required
                        />
                        <span className="text-gray-500 text-sm mb-1">MIN</span>
                      </div>
                    </div>

                    {/* Calories */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 focus-within:border-green-500/50 transition-colors">
                      <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Calories Burned</label>
                      <div className="flex items-end gap-2">
                        <input
                          type="number"
                          value={postGymData.caloriesBurned}
                          onChange={(e) => setPostGymData({ ...postGymData, caloriesBurned: e.target.value })}
                          placeholder="450"
                          className="flex-1 bg-transparent text-3xl font-bold text-white placeholder-gray-700 focus:outline-none w-full"
                          style={{ fontFamily: 'Oswald, sans-serif' }}
                          required
                        />
                        <span className="text-gray-500 text-sm mb-1">KCAL</span>
                      </div>
                    </div>
                  </div>

                  {/* Exercise Review + Add More */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs text-gray-400 uppercase tracking-wider">Exercises Done</label>
                      {exerciseLog.length > 0 && (
                        <span className="text-xs text-green-400">{exerciseLog.length} carried from pre-workout</span>
                      )}
                    </div>

                    {exerciseLog.length > 0 && (
                      <div className="space-y-1.5 mb-3">
                        {exerciseLog.map((ex, i) => (
                          <div key={i} className="flex items-center justify-between bg-black border border-gray-800 rounded-lg px-4 py-2.5 group">
                            <div>
                              <div className="font-bold text-sm text-green-400" style={{ fontFamily: 'Oswald, sans-serif' }}>✓ {ex.name}</div>
                              <div className="text-xs text-gray-600">{ex.sets} × {ex.reps} reps {ex.weight ? `@ ${ex.weight} kg` : ''}</div>
                            </div>
                            <button type="button" onClick={() => removeExercise(i)}
                              className="text-gray-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 ml-3">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick-add extra exercises */}
                    <div className="bg-gray-900/30 border border-dashed border-gray-800 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-2">+ Add any extra exercises you did that weren&apos;t in your plan:</div>
                      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                        <input
                          list="exercise-suggestions-post"
                          value={currentExercise.name}
                          onChange={(e) => setCurrentExercise({ ...currentExercise, name: e.target.value })}
                          placeholder="Exercise name"
                          className="flex-1 min-w-0 bg-black border border-gray-700 rounded px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-green-500"
                        />
                        <input type="number" value={currentExercise.sets}
                          onChange={(e) => setCurrentExercise({ ...currentExercise, sets: e.target.value })}
                          placeholder="Sets" className="w-16 bg-black border border-gray-700 rounded px-2 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-green-500"
                        />
                        <input type="number" value={currentExercise.reps}
                          onChange={(e) => setCurrentExercise({ ...currentExercise, reps: e.target.value })}
                          placeholder="Reps" className="w-16 bg-black border border-gray-700 rounded px-2 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-green-500"
                        />
                        <button type="button" onClick={addExercise}
                          disabled={!currentExercise.name || !currentExercise.sets || !currentExercise.reps}
                          className="px-4 py-1.5 bg-green-600 hover:bg-green-500 disabled:bg-gray-800 disabled:text-gray-600 font-bold text-xs rounded transition-all">
                          +
                        </button>
                      </div>
                      <datalist id="exercise-suggestions-post">
                        {EXERCISE_SUGGESTIONS.map(ex => <option key={ex} value={ex} />)}
                      </datalist>
                    </div>
                  </div>

                  {/* Post notes */}
                  <div className="mb-6">
                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">How Did It Go?</label>
                    <textarea
                      value={postGymData.notes}
                      onChange={(e) => setPostGymData({ ...postGymData, notes: e.target.value })}
                      placeholder="PRs hit, pain points, what to improve next time..."
                      className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-green-500 transition-colors resize-none h-20"
                    />
                  </div>

                  <button type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 font-bold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-green-500/20"
                    style={{ fontFamily: 'Oswald, sans-serif', letterSpacing: '0.15em', fontSize: '1rem' }}>
                    FINISH SESSION & VIEW REPORT 📊
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════
              SESSION PROGRESS REPORT MODAL
          ════════════════════════════════════════════════ */}
          {showProgressReport && sessionReport && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
              <div className="animate-fade-scale bg-[#0a0a0a] border border-gray-800 rounded-xl w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl">

                {/* Gradient top bar */}
                <div className="h-1 w-full bg-gradient-to-r from-red-600 via-yellow-500 to-green-500 rounded-t-xl" />

                <div className="px-6 py-5">
                  {/* Title */}
                  <div className="text-center mb-5">
                    <div className="text-5xl mb-3">
                      {sessionReport.performanceScore >= 80 ? '🔥' :
                       sessionReport.performanceScore >= 60 ? '💪' :
                       sessionReport.performanceScore >= 40 ? '👍' : '💡'}
                    </div>
                    <h2 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Oswald, sans-serif' }}>
                      SESSION <span className="text-red-500">REPORT</span>
                    </h2>
                    <div className="text-gray-500 text-sm">{sessionReport.date}</div>
                  </div>

                  {/* Performance Score Ring */}
                  <div className="flex justify-center mb-6">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="50" fill="none" stroke="#1a1a1a" strokeWidth="10" />
                        <circle cx="60" cy="60" r="50" fill="none"
                          stroke={sessionReport.performanceScore >= 80 ? '#22c55e' : sessionReport.performanceScore >= 60 ? '#eab308' : '#ef4444'}
                          strokeWidth="10"
                          strokeDasharray={`${(sessionReport.performanceScore / 100) * 314} 314`}
                          strokeLinecap="round"
                          style={{ transition: 'stroke-dasharray 1s ease' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-4xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>
                          {sessionReport.performanceScore}
                        </div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">score</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    {[
                      { label: 'Duration', value: sessionReport.postData.duration, unit: 'min', icon: '⏱️' },
                      { label: 'Calories', value: sessionReport.postData.caloriesBurned, unit: 'kcal', icon: '🔥' },
                      { label: 'Exercises', value: sessionReport.exercises.length, unit: 'done', icon: '💪' },
                      {
                        label: 'Total Sets',
                        value: sessionReport.exercises.reduce((s, e) => s + (parseInt(e.sets) || 0), 0),
                        unit: 'sets',
                        icon: '📊'
                      },
                    ].map(stat => (
                      <div key={stat.label} className="bg-gray-900/60 border border-gray-800 rounded-lg p-3 text-center hover:border-red-500/30 transition-colors">
                        <div className="text-2xl mb-1">{stat.icon}</div>
                        <div className="text-2xl font-bold text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>{stat.value}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.unit}</div>
                        <div className="text-xs text-gray-700 mt-0.5">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Before vs After */}
                  <div className="bg-gray-900/40 border border-gray-800 rounded-lg p-4 mb-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Before vs After</div>
                    <div className="grid grid-cols-3 text-center">
                      <div className="text-xs text-gray-600 font-semibold uppercase pb-2 border-b border-gray-800">Metric</div>
                      <div className="text-xs text-red-400 font-semibold uppercase pb-2 border-b border-gray-800">Before</div>
                      <div className="text-xs text-green-400 font-semibold uppercase pb-2 border-b border-gray-800">After</div>

                      <div className="text-xs text-gray-500 py-2 border-b border-gray-900">Weight</div>
                      <div className="text-xs text-white py-2 border-b border-gray-900">{sessionReport.preData.weight} kg</div>
                      <div className="text-xs py-2 border-b border-gray-900">
                        <span className="text-white">{sessionReport.postData.weight} kg </span>
                        <span className={sessionReport.bodyWeightChange < 0 ? 'text-green-400' : 'text-yellow-400'}>
                          ({sessionReport.bodyWeightChange > 0 ? '+' : ''}{sessionReport.bodyWeightChange})
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 py-2 border-b border-gray-900">Heart Rate</div>
                      <div className="text-xs text-white py-2 border-b border-gray-900">{sessionReport.preData.heartRate} BPM</div>
                      <div className="text-xs text-white py-2 border-b border-gray-900">
                        {sessionReport.postData.heartRate} BPM
                        <span className="text-yellow-400 ml-1">(+{Math.abs(parseInt(sessionReport.postData.heartRate) - parseInt(sessionReport.preData.heartRate))})</span>
                      </div>

                      <div className="text-xs text-gray-500 py-2">Energy</div>
                      <div className="text-xs text-white py-2">{sessionReport.preData.energy}/10</div>
                      <div className="text-xs text-green-400 py-2">Crushed it ✓</div>
                    </div>
                  </div>

                  {/* Exercise Breakdown */}
                  {sessionReport.exercises.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Exercises Performed</div>
                      <div className="space-y-1.5">
                        {sessionReport.exercises.map((ex, i) => {
                          const volume = (parseInt(ex.sets) || 0) * (parseInt(ex.reps) || 0) * (parseFloat(ex.weight) || 1);
                          return (
                            <div key={i} className="flex items-center justify-between bg-black border border-gray-900 rounded-lg px-3 py-2.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-700 w-5">{i + 1}.</span>
                                <div>
                                  <div className="text-sm font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>{ex.name}</div>
                                  <div className="text-xs text-gray-600">{ex.sets} × {ex.reps} reps{ex.weight ? ` @ ${ex.weight} kg` : ''}</div>
                                </div>
                              </div>
                              {ex.weight && (
                                <div className="text-xs text-red-400 font-semibold">{Math.round(volume).toLocaleString()} kg vol</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {sessionReport.totalVolume > 0 && (
                        <div className="mt-2 bg-gray-900/50 border border-gray-800 rounded-lg p-3 flex justify-between items-center">
                          <span className="text-xs text-gray-500">Total Volume Lifted</span>
                          <span className="text-sm font-bold text-red-400" style={{ fontFamily: 'Oswald, sans-serif' }}>
                            {sessionReport.totalVolume.toLocaleString()} kg
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Session Insight */}
                  <div className={`border rounded-lg p-4 mb-5 ${
                    sessionReport.performanceScore >= 80 ? 'border-green-500/30 bg-green-500/5' :
                    sessionReport.performanceScore >= 60 ? 'border-yellow-500/30 bg-yellow-500/5' :
                    'border-red-500/30 bg-red-500/5'
                  }`}>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">💡 Session Insight</div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {sessionReport.performanceScore >= 80
                        ? `Outstanding session. ${sessionReport.postData.duration} minutes, ${sessionReport.postData.caloriesBurned} kcal torched, and ${sessionReport.exercises.length} exercises completed. You walked in at energy ${sessionReport.preData.energy}/10 and delivered. Rest hard and come back even stronger.`
                        : sessionReport.performanceScore >= 60
                        ? `Solid work. You showed up and put in ${sessionReport.exercises.length} exercises over ${sessionReport.postData.duration} minutes. Consistency like this compounds over time. Focus on progressive overload in your next session.`
                        : parseInt(sessionReport.preData.energy) <= 4
                        ? `You came in at energy ${sessionReport.preData.energy}/10 and still got it done — that's pure discipline. Prioritize sleep and nutrition tonight. Your next session will reflect it.`
                        : `Every session counts. ${sessionReport.exercises.length} exercises completed. Keep showing up and the results will follow.`
                      }
                    </p>
                    {sessionReport.postData.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-800">
                        <div className="text-xs text-gray-600 mb-1">Your notes:</div>
                        <div className="text-xs text-gray-400 italic">&quot;{sessionReport.postData.notes}&quot;</div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button onClick={() => setShowProgressReport(false)}
                      className="flex-1 py-3 bg-gray-900 hover:bg-gray-800 font-bold rounded-lg transition-all border border-gray-800 text-sm"
                      style={{ fontFamily: 'Oswald, sans-serif' }}>
                      CLOSE
                    </button>
                    <button onClick={resetSession}
                      className="flex-1 py-3 bg-red-500 hover:bg-red-600 font-bold rounded-lg transition-all text-sm"
                      style={{ fontFamily: 'Oswald, sans-serif' }}>
                      NEW SESSION 🔥
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════
              OVERVIEW TAB
          ════════════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div className="max-w-7xl mx-auto space-y-6">

              {/* Welcome Header */}
              <div className="animate-slide-in">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  WELCOME BACK, <span className="text-red-500">{user.name.split(' ')[0].toUpperCase()}</span>
                </h1>
                <p className="text-gray-400">Ready to crush today&apos;s goals?</p>
              </div>

              {/* This Week Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-in stagger-1">
                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 hover:border-red-500 transition-all">
                  <div className="text-gray-500 text-sm mb-2 uppercase tracking-wider">Workouts</div>
                  <div className="text-3xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    {weekStats.workouts}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">This week</div>
                </div>
                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 hover:border-red-500 transition-all">
                  <div className="text-gray-500 text-sm mb-2 uppercase tracking-wider">Time</div>
                  <div className="text-3xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    {weekStats.totalTime}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Training time</div>
                </div>
                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 hover:border-red-500 transition-all">
                  <div className="text-gray-500 text-sm mb-2 uppercase tracking-wider">Calories</div>
                  <div className="text-3xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    {weekStats.calories}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Burned</div>
                </div>
                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 hover:border-red-500 transition-all">
                  <div className="text-gray-500 text-sm mb-2 uppercase tracking-wider">Avg HR</div>
                  <div className="text-3xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    {weekStats.avgHeartRate}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">BPM</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Schedule */}
                <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 animate-slide-in stagger-2">
                  <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    TODAY&apos;S <span className="text-red-500">SCHEDULE</span>
                  </h2>
                  <div className="space-y-3">
                    {todayClasses.map((classItem) => (
                      <div
                        key={classItem.id}
                        className={`flex items-center justify-between p-4 border-l-4 ${
                          classItem.status === 'completed' ? 'border-green-500 bg-green-500/10' :
                          classItem.status === 'upcoming' ? 'border-yellow-500 bg-yellow-500/10' :
                          'border-red-500 bg-red-500/10'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>{classItem.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded ${
                              classItem.status === 'completed' ? 'bg-green-500' :
                              classItem.status === 'upcoming' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}>
                              {classItem.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400">
                            {classItem.time} • {classItem.duration} • {classItem.trainer}
                          </div>
                        </div>
                        {classItem.status !== 'completed' && (
                          <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-sm font-semibold transition-colors">
                            {classItem.status === 'upcoming' ? 'JOIN' : 'DETAILS'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 animate-slide-in stagger-3">
                  <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    QUICK <span className="text-red-500">ACTIONS</span>
                  </h2>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowPreWorkoutModal(true)}
                      className="w-full bg-red-500 hover:bg-red-600 p-4 font-bold transition-all transform hover:scale-105 flex items-center justify-center space-x-2 rounded-lg"
                    >
                      <span className="text-xl">📝</span>
                      <span style={{ fontFamily: 'Oswald, sans-serif', letterSpacing: '0.05em' }}>PRE WORKOUT TRACK</span>
                    </button>
                    <button
                      onClick={() => setShowPostWorkoutModal(true)}
                      className="w-full bg-green-600 hover:bg-green-700 p-4 font-bold transition-all transform hover:scale-105 flex items-center justify-center space-x-2 rounded-lg"
                    >
                      <span className="text-xl">✅</span>
                      <span style={{ fontFamily: 'Oswald, sans-serif', letterSpacing: '0.05em' }}>POST WORKOUT TRACK</span>
                    </button>
                    {sessionReport && (
                      <button
                        onClick={() => setShowProgressReport(true)}
                        className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 p-4 font-bold transition-all transform hover:scale-105 flex items-center justify-center space-x-2 rounded-lg"
                      >
                        <span className="text-xl">📊</span>
                        <span style={{ fontFamily: 'Oswald, sans-serif', letterSpacing: '0.05em' }}>VIEW LAST REPORT</span>
                      </button>
                    )}
                  </div>

                  {/* Session status indicator */}
                  {preGymData.weight && !sessionReport && (
                    <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="text-xs text-green-400 font-semibold uppercase tracking-wider mb-1">Session Active 🟢</div>
                      <div className="text-xs text-gray-400">Pre-workout logged. Complete your post-workout when done.</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Workouts & Goals */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Workouts */}
                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
                  <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    RECENT <span className="text-red-500">WORKOUTS</span>
                  </h2>
                  <div className="space-y-3">
                    {recentWorkouts.map((workout) => (
                      <div key={workout.id} className="flex items-center justify-between p-4 bg-black/50 border border-gray-800 hover:border-red-500 transition-all">
                        <div>
                          <h3 className="font-bold mb-1">{workout.name}</h3>
                          <div className="text-xs text-gray-500">{workout.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-red-500 font-bold">{workout.duration}</div>
                          <div className="text-xs text-gray-500">{workout.calories} kcal • {workout.sets} sets</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Goals Progress */}
                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
                  <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    YOUR <span className="text-red-500">GOALS</span>
                  </h2>
                  <div className="space-y-4">
                    {goals.map((goal) => {
                      const progress = (goal.current / goal.target) * 100;
                      return (
                        <div key={goal.id}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-semibold">{goal.name}</span>
                            <span className="text-sm text-gray-400">{goal.current}/{goal.target} {goal.unit}</span>
                          </div>
                          <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Personal Records & Achievements */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Records */}
                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
                  <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    PERSONAL <span className="text-red-500">RECORDS</span>
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {personalRecords.map((record, i) => (
                      <div key={i} className="bg-black/50 border border-gray-800 p-4 hover:border-red-500 transition-all">
                        <div className="text-xs text-gray-500 mb-1">{record.exercise}</div>
                        <div className="text-2xl font-bold text-red-500 mb-1" style={{ fontFamily: 'Oswald, sans-serif' }}>
                          {record.weight}
                        </div>
                        <div className="text-xs text-gray-600">{record.date}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
                  <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    <span className="text-red-500">ACHIEVEMENTS</span>
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`text-center p-4 border ${
                          achievement.unlocked
                            ? 'border-red-500 bg-red-500/10'
                            : 'border-gray-800 bg-gray-900/50 opacity-50'
                        }`}
                      >
                        <div className="text-4xl mb-2">{achievement.icon}</div>
                        <div className="text-xs font-semibold">{achievement.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upcoming Classes */}
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
                <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  UPCOMING <span className="text-red-500">CLASSES</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {upcomingClasses.map((classItem) => (
                    <div key={classItem.id} className="bg-black/50 border border-gray-800 p-4 hover:border-red-500 transition-all">
                      <h3 className="font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>{classItem.name}</h3>
                      <div className="text-sm text-gray-400 space-y-1 mb-4">
                        <div>{classItem.day} • {classItem.time}</div>
                        <div>Trainer: {classItem.trainer}</div>
                        <div className="text-red-500">{classItem.spots} spots left</div>
                      </div>
                      <button className="w-full bg-red-500 hover:bg-red-600 py-2 text-sm font-bold transition-colors">
                        BOOK NOW
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {activeTab !== 'overview' && (
            <div className="max-w-7xl mx-auto">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-12 text-center">
                <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  {navigationItems.find(item => item.key === activeTab)?.name.toUpperCase()}
                </h2>
                <p className="text-gray-400 mb-8">This section is under development</p>
                <button
                  onClick={() => setActiveTab('overview')}
                  className="bg-red-500 hover:bg-red-600 px-8 py-3 font-bold transition-all"
                >
                  BACK TO OVERVIEW
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}