'use client';

import { useState } from 'react';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('overview');

  const userProfile = {
    name: 'Harsh Chorghe',
    email: 'harsh.chorghe@1fit.com',
    phone: '+1 (555) 123-4567',
    memberSince: 'January 2024',
    membershipType: 'Pro',
    avatar: '👤',
    bio: 'Fitness enthusiast focused on strength training and endurance. Love early morning workouts and helping others reach their goals!',
    location: 'San Francisco, CA',
    age: 20,
    height: '6\'0"',
    currentWeight: '82 kg',
    targetWeight: '78 kg'
  };

  const stats = {
    totalWorkouts: 124,
    totalHours: 98,
    caloriesBurned: 52400,
    currentStreak: 12,
    longestStreak: 42,
    averagePerWeek: 5.2
  };

  const personalRecords = [
    { exercise: 'Bench Press', weight: '120 kg', date: 'Jan 20, 2026', icon: '💪' },
    { exercise: 'Deadlift', weight: '180 kg', date: 'Jan 15, 2026', icon: '🏋️' },
    { exercise: 'Squat', weight: '150 kg', date: 'Jan 18, 2026', icon: '🦵' },
    { exercise: '5K Run', time: '22:15', date: 'Jan 10, 2026', icon: '🏃' }
  ];

  const badges = [
    { id: 1, name: 'Early Bird', icon: '🌅', description: '50 workouts before 7 AM', unlocked: true },
    { id: 2, name: '30 Day Streak', icon: '🔥', description: '30 consecutive days', unlocked: true },
    { id: 3, name: 'Iron Warrior', icon: '⚔️', description: '100 strength sessions', unlocked: true },
    { id: 4, name: 'Cardio King', icon: '👑', description: '50 cardio sessions', unlocked: false },
    { id: 5, name: 'Perfect Week', icon: '⭐', description: '7 workouts in 7 days', unlocked: true },
    { id: 6, name: 'Marathon Ready', icon: '🏅', description: 'Run 100 km total', unlocked: false },
    { id: 7, name: 'Strength Master', icon: '💯', description: '500 kg total lifts', unlocked: true },
    { id: 8, name: 'Consistency', icon: '📅', description: '365 workouts in a year', unlocked: false }
  ];

  const preferences = {
    notifications: {
      email: true,
      push: true,
      sms: false,
      workoutReminders: true,
      classReminders: true,
      achievements: true
    },
    privacy: {
      profileVisible: true,
      showStats: true,
      showActivity: false
    },
    goals: {
      weeklyWorkouts: 6,
      monthlyCalories: 10000,
      targetWeight: 78
    }
  };

  const workoutHistory = [
    { date: 'Jan 30', type: 'Strength', duration: '58 min', calories: 420 },
    { date: 'Jan 29', type: 'HIIT', duration: '35 min', calories: 380 },
    { date: 'Jan 28', type: 'Strength', duration: '62 min', calories: 510 },
    { date: 'Jan 27', type: 'Cardio', duration: '45 min', calories: 340 },
    { date: 'Jan 26', type: 'Yoga', duration: '50 min', calories: 220 }
  ];

  const favoriteWorkouts = [
    { name: 'Morning Power', type: 'Strength', times: 24 },
    { name: 'Cardio Blast', type: 'Cardio', times: 18 },
    { name: 'HIIT Circuit', type: 'HIIT', times: 15 },
    { name: 'Recovery Flow', type: 'Yoga', times: 12 }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-slide-in">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
          YOUR <span className="text-red-500">PROFILE</span>
        </h1>
        <p className="text-gray-400">Manage your account and track your journey</p>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 animate-slide-in stagger-1">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-6xl border-4 border-red-500">
              {userProfile.avatar}
            </div>
            <button className="bg-gray-800 hover:bg-red-500 px-4 py-2 text-sm font-bold transition-colors">
              CHANGE PHOTO
            </button>
            <div className="text-center">
              <div className="text-sm text-gray-500">Member Since</div>
              <div className="font-bold text-red-500">{userProfile.memberSince}</div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  {userProfile.name}
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="bg-red-500 px-3 py-1 text-xs font-bold rounded">
                    {userProfile.membershipType.toUpperCase()} MEMBER
                  </span>
                  <span className="text-sm text-gray-500">Level: Advanced</span>
                </div>
              </div>
              <button className="bg-gray-800 hover:bg-red-500 px-6 py-2 font-bold transition-colors">
                EDIT PROFILE
              </button>
            </div>

            <p className="text-gray-400">{userProfile.bio}</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Email</div>
                <div className="text-sm font-semibold">{userProfile.email}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Phone</div>
                <div className="text-sm font-semibold">{userProfile.phone}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Location</div>
                <div className="text-sm font-semibold">{userProfile.location}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Age</div>
                <div className="text-sm font-semibold">{userProfile.age} years</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Height</div>
                <div className="text-sm font-semibold">{userProfile.height}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Weight</div>
                <div className="text-sm font-semibold">{userProfile.currentWeight} → {userProfile.targetWeight}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-4">
        {[
          { id: 'overview', name: 'Overview', icon: '📊' },
          { id: 'stats', name: 'Statistics', icon: '📈' },
          { id: 'badges', name: 'Badges', icon: '🏆' },
          { id: 'settings', name: 'Settings', icon: '⚙️' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-red-500 text-white'
                : 'bg-gray-900 border border-gray-800 text-gray-400 hover:border-red-500 hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-4 hover:border-red-500 transition-all">
              <div className="text-xs text-gray-500 mb-1">Total Workouts</div>
              <div className="text-2xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
                {stats.totalWorkouts}
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-4 hover:border-red-500 transition-all">
              <div className="text-xs text-gray-500 mb-1">Total Hours</div>
              <div className="text-2xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
                {stats.totalHours}
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-4 hover:border-red-500 transition-all">
              <div className="text-xs text-gray-500 mb-1">Calories</div>
              <div className="text-2xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
                {(stats.caloriesBurned / 1000).toFixed(1)}k
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-4 hover:border-red-500 transition-all">
              <div className="text-xs text-gray-500 mb-1">Current Streak</div>
              <div className="text-2xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
                {stats.currentStreak}
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-4 hover:border-red-500 transition-all">
              <div className="text-xs text-gray-500 mb-1">Best Streak</div>
              <div className="text-2xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
                {stats.longestStreak}
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-4 hover:border-red-500 transition-all">
              <div className="text-xs text-gray-500 mb-1">Avg/Week</div>
              <div className="text-2xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
                {stats.averagePerWeek}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Records */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
                PERSONAL <span className="text-red-500">RECORDS</span>
              </h2>
              <div className="space-y-3">
                {personalRecords.map((record, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-black/50 border border-gray-800 hover:border-red-500 transition-all">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{record.icon}</div>
                      <div>
                        <div className="font-bold">{record.exercise}</div>
                        <div className="text-xs text-gray-500">{record.date}</div>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
                      {record.weight || record.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
                RECENT <span className="text-red-500">ACTIVITY</span>
              </h2>
              <div className="space-y-2">
                {workoutHistory.map((workout, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-black/50 border border-gray-800">
                    <div>
                      <div className="font-bold text-sm">{workout.type}</div>
                      <div className="text-xs text-gray-500">{workout.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-red-500">{workout.duration}</div>
                      <div className="text-xs text-gray-500">{workout.calories} cal</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Favorite Workouts */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
              FAVORITE <span className="text-red-500">WORKOUTS</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {favoriteWorkouts.map((workout, idx) => (
                <div key={idx} className="bg-black/50 border border-gray-800 p-4 text-center hover:border-red-500 transition-all">
                  <div className="text-3xl mb-2">⭐</div>
                  <div className="font-bold mb-1">{workout.name}</div>
                  <div className="text-xs text-gray-500 mb-2">{workout.type}</div>
                  <div className="text-sm text-red-500">Completed {workout.times}x</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Statistics Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-12 text-center">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
              DETAILED <span className="text-red-500">STATISTICS</span>
            </h2>
            <p className="text-gray-400 mb-8">Advanced analytics and charts coming soon</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-4xl font-bold text-red-500 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  {stats.totalWorkouts}
                </div>
                <div className="text-sm text-gray-500">Total Workouts</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-red-500 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  {stats.totalHours}h
                </div>
                <div className="text-sm text-gray-500">Training Time</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-red-500 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  {(stats.caloriesBurned / 1000).toFixed(1)}k
                </div>
                <div className="text-sm text-gray-500">Calories Burned</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-red-500 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  {stats.longestStreak}
                </div>
                <div className="text-sm text-gray-500">Best Streak</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Badges Tab */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
              YOUR <span className="text-red-500">ACHIEVEMENTS</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`text-center p-6 border ${
                    badge.unlocked
                      ? 'border-yellow-500 bg-yellow-500/10'
                      : 'border-gray-800 bg-gray-900/50 opacity-50'
                  } hover:scale-105 transition-transform`}
                >
                  <div className="text-5xl mb-3">{badge.icon}</div>
                  <div className="font-bold mb-1">{badge.name}</div>
                  <div className="text-xs text-gray-500 mb-2">{badge.description}</div>
                  {badge.unlocked ? (
                    <div className="text-xs text-green-500 font-bold">✓ UNLOCKED</div>
                  ) : (
                    <div className="text-xs text-gray-600">🔒 Locked</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Account Settings */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
              ACCOUNT <span className="text-red-500">SETTINGS</span>
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Display Name</label>
                <input
                  type="text"
                  defaultValue={userProfile.name}
                  className="w-full bg-gray-800 border border-gray-700 px-4 py-2 focus:border-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={userProfile.email}
                  className="w-full bg-gray-800 border border-gray-700 px-4 py-2 focus:border-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Bio</label>
                <textarea
                  defaultValue={userProfile.bio}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 px-4 py-2 focus:border-red-500 outline-none"
                />
              </div>
              <button className="bg-red-500 hover:bg-red-600 px-6 py-2 font-bold transition-colors">
                SAVE CHANGES
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
              NOTIFICATION <span className="text-red-500">PREFERENCES</span>
            </h2>
            <div className="space-y-3">
              {Object.entries(preferences.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-black/50 border border-gray-800">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={value} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
              PRIVACY <span className="text-red-500">SETTINGS</span>
            </h2>
            <div className="space-y-3">
              {Object.entries(preferences.privacy).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-black/50 border border-gray-800">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={value} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-gradient-to-br from-red-900/20 to-black border border-red-900 p-6">
            <h2 className="text-2xl font-bold mb-4 text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
              DANGER ZONE
            </h2>
            <div className="space-y-3">
              <button className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 py-3 font-bold transition-colors text-left px-4">
                CHANGE PASSWORD
              </button>
              <button className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 py-3 font-bold transition-colors text-left px-4">
                CANCEL MEMBERSHIP
              </button>
              <button className="w-full bg-red-900/50 hover:bg-red-900 border border-red-800 py-3 font-bold transition-colors text-left px-4">
                DELETE ACCOUNT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}