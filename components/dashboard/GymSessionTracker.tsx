'use client';

import { useState } from 'react';

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

interface GymSessionTrackerProps {
  onSessionStart?: (session: GymSession) => void;
  onSessionComplete?: (session: GymSession) => void;
}

export default function GymSessionTracker({ onSessionStart, onSessionComplete }: GymSessionTrackerProps) {
  const [sessions, setSessions] = useState<GymSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [showPreGymForm, setShowPreGymForm] = useState(false);
  const [showPostGymForm, setShowPostGymForm] = useState(false);
  const [sessionMode, setSessionMode] = useState<'before' | 'complete'>('before');

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
    setShowPreGymForm(true);
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
    
    onSessionStart?.(newSession);
  };

  const handlePostGymSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedSessions = sessions.map(session => {
      if (session.id === activeSessionId) {
        return {
          ...session,
          afterGym: postGymData,
          sessionType: 'complete'
        };
      }
      return session;
    });

    setSessions(updatedSessions);
    const completedSession = updatedSessions.find(s => s.id === activeSessionId);
    
    if (completedSession) {
      onSessionComplete?.(completedSession);
    }
    
    setShowPostGymForm(false);
    setActiveSessionId(null);
    setPostGymData({ weight: '', heartRate: '', duration: '', caloriesBurned: '', exercises: '', notes: '' });
  };

  const handleCompleteSession = () => {
    setShowPostGymForm(true);
  };

  const activeSession = sessions.find(s => s.id === activeSessionId);

  return (
    <div className="space-y-4">
      {/* Session Control Buttons */}
      {!activeSessionId ? (
        <button
          onClick={handleStartSession}
          className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 px-6 py-4 font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 rounded-lg"
        >
          <span className="text-2xl">📝</span>
          <span>ADD INFO - START GYM SESSION</span>
        </button>
      ) : (
        <div className="space-y-2">
          <div className="bg-green-500/20 border border-green-500 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl animate-pulse">🟢</span>
                <span className="font-bold text-green-400">SESSION IN PROGRESS</span>
              </div>
              {!showPostGymForm && (
                <button
                  onClick={handleCompleteSession}
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 font-bold text-sm transition-all rounded"
                >
                  COMPLETE & ADD POST-GYM INFO
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pre-Gym Form */}
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

      {/* Post-Gym Form */}
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
                  placeholder="e.g., 95"
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
                <label className="block text-sm font-semibold mb-2">Calories Burned</label>
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
              <label className="block text-sm font-semibold mb-2">Exercises Performed</label>
              <textarea
                value={postGymData.exercises}
                onChange={(e) => setPostGymData({ ...postGymData, exercises: e.target.value })}
                placeholder="List exercises and sets (e.g., Bench Press 4x10, Squats 4x8, ...)"
                className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded text-white focus:outline-none focus:border-green-500 h-24"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Post-Workout Notes</label>
              <textarea
                value={postGymData.notes}
                onChange={(e) => setPostGymData({ ...postGymData, notes: e.target.value })}
                placeholder="How you felt, next steps, pain points..."
                className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded text-white focus:outline-none focus:border-green-500 h-24"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-green-500 hover:bg-green-600 px-4 py-2 font-bold rounded transition-colors"
              >
                COMPLETE SESSION & GENERATE REPORT
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

      {/* Active Session Summary */}
      {activeSession && !showPostGymForm && (
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-4">SESSION SUMMARY - {activeSession.date}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-red-500 font-bold mb-3">PRE-GYM INFO</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Weight:</span>
                  <span className="font-semibold">{activeSession.beforeGym.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Heart Rate:</span>
                  <span className="font-semibold">{activeSession.beforeGym.heartRate} BPM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Energy:</span>
                  <span className="font-semibold">{activeSession.beforeGym.energy}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Mood:</span>
                  <span className="font-semibold">{activeSession.beforeGym.mood}</span>
                </div>
                {activeSession.beforeGym.notes && (
                  <div className="pt-2 border-t border-gray-700">
                    <span className="text-gray-400 text-xs">Notes: {activeSession.beforeGym.notes}</span>
                  </div>
                )}
              </div>
            </div>
            {activeSession.afterGym && (
              <div>
                <h4 className="text-green-500 font-bold mb-3">POST-GYM INFO</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Weight:</span>
                    <span className="font-semibold">{activeSession.afterGym.weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Heart Rate:</span>
                    <span className="font-semibold">{activeSession.afterGym.heartRate} BPM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="font-semibold">{activeSession.afterGym.duration} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Calories:</span>
                    <span className="font-semibold">{activeSession.afterGym.caloriesBurned} kcal</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Session History */}
      {sessions.length > 0 && (
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-4">SESSION HISTORY</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-black/50 border border-gray-700 rounded hover:border-red-500 transition-all cursor-pointer"
                onClick={() => {
                  if (activeSessionId !== session.id) {
                    setActiveSessionId(session.id);
                  }
                }}>
                <div>
                  <div className="font-semibold">{session.date}</div>
                  <div className="text-xs text-gray-400">Weight: {session.beforeGym.weight}kg → {session.afterGym?.weight || 'pending'}kg</div>
                </div>
                <div className={`px-3 py-1 rounded text-xs font-bold ${session.sessionType === 'complete' ? 'bg-green-500/20 text-green-400 border border-green-500' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500'}`}>
                  {session.sessionType === 'complete' ? '✓ COMPLETE' : 'IN PROGRESS'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
