'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
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

      {/* Top Navigation */}
      <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-lg border-b border-gray-900 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Mobile Menu */}
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

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-900 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile */}
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
        {/* Sidebar */}
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

          {/* Quick Stats in Sidebar */}
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

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Welcome Header */}
              <div className="animate-slide-in">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  WELCOME BACK, <span className="text-red-500">{user.name.split(' ')[0].toUpperCase()}</span>
                </h1>
                <p className="text-gray-400">Ready to crush today's goals?</p>
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
                    TODAY'S <span className="text-red-500">SCHEDULE</span>
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
                    <button className="w-full bg-red-500 hover:bg-red-600 p-4 font-bold transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
                      <span className="text-xl">💪</span>
                      <span>START WORKOUT</span>
                    </button>
                    <button className="w-full border-2 border-gray-700 hover:border-red-500 p-4 font-bold transition-all flex items-center justify-center space-x-2">
                      <span className="text-xl">📅</span>
                      <span>BOOK CLASS</span>
                    </button>
                    <button className="w-full border-2 border-gray-700 hover:border-red-500 p-4 font-bold transition-all flex items-center justify-center space-x-2">
                      <span className="text-xl">👤</span>
                      <span>HIRE TRAINER</span>
                    </button>
                    <button className="w-full border-2 border-gray-700 hover:border-red-500 p-4 font-bold transition-all flex items-center justify-center space-x-2">
                      <span className="text-xl">🥗</span>
                      <span>MEAL PLAN</span>
                    </button>
                  </div>
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