'use client';

import { useState } from 'react';
import SessionProgressReport from '../dashboard/SessionProgressReport';

interface GymSession {
  id: string;
  date: string;
  beforeGym: {
    weight: string;
    heartRate: string;
    energy: string;
    mood: string;
    notes: string;
  };
  afterGym?: {
    weight: string;
    heartRate: string;
    duration: string;
    caloriesBurned: string;
    exercises: string;
    notes: string;
  };
  sessionType: 'before' | 'complete';
}

export default function QuickActions() {
  const [sessions, setSessions] = useState<GymSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [showPreGymForm, setShowPreGymForm] = useState(false);
  const [showPostGymForm, setShowPostGymForm] = useState(false);
  const [showProgressReport, setShowProgressReport] = useState(false);

  const [preGymData, setPreGymData] = useState({
    weight: '',
    heartRate: '',
    energy: '',
    mood: '',
    notes: ''
  });

  const [postGymData, setPostGymData] = useState({
    weight: '',
    heartRate: '',
    duration: '',
    caloriesBurned: '',
    exercises: '',
    notes: ''
  });

  const handleStartSession = () => {
    setIsStartingSession(true);
    setTimeout(() => {
      setShowPreGymForm(true);
      setIsStartingSession(false);
    }, 420);
  };

  const handlePreGymSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSession: GymSession = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      beforeGym: preGymData,
      sessionType: 'before'
    };

    setSessions([...sessions, newSession]);
    setActiveSessionId(newSession.id);
    setShowPreGymForm(false);
    setPreGymData({ weight: '', heartRate: '', energy: '', mood: '', notes: '' });
  };

  const handlePostGymSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedSessions = sessions.map(session => {
      if (session.id === activeSessionId) {
        return {
          ...session,
          afterGym: postGymData,
          sessionType: 'complete' as const
        };
      }
      return session;
    });

    setSessions(updatedSessions);
    setShowPostGymForm(false);
    setPostGymData({ weight: '', heartRate: '', duration: '', caloriesBurned: '', exercises: '', notes: '' });
  };

  const handleCompleteSession = () => {
    setShowPostGymForm(true);
  };

  const activeSession = sessions.find(s => s.id === activeSessionId);

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 animate-slide-in stagger-3">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
          QUICK <span className="text-red-500">ACTIONS</span>
        </h2>
        <div className="space-y-3">
          {!activeSessionId ? (
            <button
              onClick={handleStartSession}
              disabled={isStartingSession}
              className={`relative w-full bg-red-500 hover:bg-red-600 p-4 font-bold transition-all transform hover:scale-105 flex items-center justify-center space-x-2 overflow-hidden ${
                isStartingSession ? 'animate-button-pop cursor-wait opacity-95' : ''
              }`}
            >
              {isStartingSession && (
                <span className="absolute inset-0 bg-white/10 animate-shimmer" aria-hidden="true"></span>
              )}
              <span className="text-xl">🔥</span>
              <span>{isStartingSession ? 'STARTING SESSION...' : 'PRE WORKOUT'}</span>
            </button>
          ) : (
            <>
              <div className="bg-green-500/20 border border-green-500 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl animate-pulse">🟢</span>
                    <span className="font-bold text-green-400">SESSION IN PROGRESS</span>
                  </div>
                </div>
              </div>
              {!showPostGymForm && (
                <button
                  onClick={handleCompleteSession}
                  className="w-full bg-green-500 hover:bg-green-600 p-4 font-bold transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span className="text-xl">✅</span>
                  <span>POST WORKOUT</span>
                </button>
              )}
              {activeSession?.afterGym && !showPostGymForm && (
                <button
                  onClick={() => setShowProgressReport(!showProgressReport)}
                  className="w-full bg-blue-500 hover:bg-blue-600 p-4 font-bold transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span className="text-xl">📊</span>
                  <span>{showProgressReport ? 'HIDE PROGRESS' : 'VIEW PROGRESS'}</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Pre-Gym Form Modal */}
      {showPreGymForm && (
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-red-500">PRE-GYM ASSESSMENT</h3>
          <form onSubmit={handlePreGymSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Current Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={preGymData.weight}
                  onChange={(e) => setPreGymData({ ...preGymData, weight: e.target.value })}
                  placeholder="e.g., 75.5"
                  className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded text-white focus:outline-none focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Resting Heart Rate (BPM)</label>
                <input
                  type="number"
                  value={preGymData.heartRate}
                  onChange={(e) => setPreGymData({ ...preGymData, heartRate: e.target.value })}
                  placeholder="e.g., 72"
                  className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded text-white focus:outline-none focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Energy Level (1-10)</label>
                <select
                  value={preGymData.energy}
                  onChange={(e) => setPreGymData({ ...preGymData, energy: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded text-white focus:outline-none focus:border-red-500"
                  required
                >
                  <option value="">Select energy level</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} - {num <= 3 ? 'Low' : num <= 6 ? 'Medium' : 'High'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Mood</label>
                <select
                  value={preGymData.mood}
                  onChange={(e) => setPreGymData({ ...preGymData, mood: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded text-white focus:outline-none focus:border-red-500"
                  required
                >
                  <option value="">Select mood</option>
                  <option value="💪 Pumped">💪 Pumped</option>
                  <option value="😌 Calm">😌 Calm</option>
                  <option value="😴 Tired">😴 Tired</option>
                  <option value="😤 Frustrated">😤 Frustrated</option>
                  <option value="😊 Good">😊 Good</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Additional Notes</label>
              <textarea
                value={preGymData.notes}
                onChange={(e) => setPreGymData({ ...preGymData, notes: e.target.value })}
                placeholder="Any injuries, soreness, or notes..."
                className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded text-white focus:outline-none focus:border-red-500 h-24"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-red-500 hover:bg-red-600 px-4 py-2 font-bold rounded transition-colors"
              >
                START SESSION
              </button>
              <button
                type="button"
                onClick={() => setShowPreGymForm(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 px-4 py-2 font-bold rounded transition-colors"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Post-Gym Form Modal */}
      {showPostGymForm && activeSession && (
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-green-500">POST-GYM ASSESSMENT</h3>
          <form onSubmit={handlePostGymSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Weight After Gym (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={postGymData.weight}
                  onChange={(e) => setPostGymData({ ...postGymData, weight: e.target.value })}
                  placeholder="e.g., 74.8"
                  className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded text-white focus:outline-none focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Post-Workout Heart Rate (BPM)</label>
                <input
                  type="number"
                  value={postGymData.heartRate}
                  onChange={(e) => setPostGymData({ ...postGymData, heartRate: e.target.value })}
                  placeholder="e.g., 85"
                  className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded text-white focus:outline-none focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Workout Duration (minutes)</label>
                <input
                  type="number"
                  value={postGymData.duration}
                  onChange={(e) => setPostGymData({ ...postGymData, duration: e.target.value })}
                  placeholder="e.g., 60"
                  className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded text-white focus:outline-none focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Calories Burned (kcal)</label>
                <input
                  type="number"
                  value={postGymData.caloriesBurned}
                  onChange={(e) => setPostGymData({ ...postGymData, caloriesBurned: e.target.value })}
                  placeholder="e.g., 450"
                  className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded text-white focus:outline-none focus:border-green-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Exercises Completed</label>
              <textarea
                value={postGymData.exercises}
                onChange={(e) => setPostGymData({ ...postGymData, exercises: e.target.value })}
                placeholder="e.g., Chest press, Squats, Deadlifts, Cardio..."
                className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded text-white focus:outline-none focus:border-green-500 h-20"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Additional Notes</label>
              <textarea
                value={postGymData.notes}
                onChange={(e) => setPostGymData({ ...postGymData, notes: e.target.value })}
                placeholder="How did you feel? Any observations..."
                className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded text-white focus:outline-none focus:border-green-500 h-20"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-green-500 hover:bg-green-600 px-4 py-2 font-bold rounded transition-colors"
              >
                COMPLETE SESSION
              </button>
              <button
                type="button"
                onClick={() => setShowPostGymForm(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 px-4 py-2 font-bold rounded transition-colors"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Session Progress Report */}
      {showProgressReport && activeSession && (
        <SessionProgressReport 
          beforeGym={activeSession.beforeGym}
          afterGym={activeSession.afterGym}
          date={activeSession.date}
        />
      )}
    </div>
  );
}
