'use client';

import { useUserData } from '@/lib/hooks/useUserData';
import TodaySchedule from '../sections/TodaySchedule';
import QuickActions from '../sections/QuickActions';
import WeekStats from '../sections/WeekStats';
import RecentWorkouts from '../sections/RecentWorkouts';
import GoalsProgress from '../sections/GoalsProgress';
import PersonalRecords from '../sections/TodayMealsOverview';
import Achievements from '../sections/Achievements';
import UpcomingClasses from '../sections/UpcomingClasses';

export default function OverviewScreen() {
  const { user, loading, error } = useUserData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl text-gray-300 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-950">
        <div className="text-center px-6 max-w-md">
          <h2 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h2>
          <p className="text-gray-400 text-lg mb-8">
            {error || 'Please sign in to view your personal dashboard'}
          </p>
          <button
            onClick={() => window.location.href = '/signin'}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const firstName = user.name.split(' ')[0].toUpperCase() || 'User';
  const streak = user.streak || 0;
  const isPro = user.membershipType?.toLowerCase().includes('pro') || false;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">

        {/* Hero / Welcome Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-950/40 via-gray-950 to-black border border-red-900/30 p-8 md:p-12 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-3" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  WELCOME BACK, <span className="text-red-500">{firstName}</span>
                </h1>
                <p className="text-xl text-gray-300">
                  Ready to dominate today? 🔥
                </p>
              </div>

              {/* Streak & Membership Badge */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="bg-gradient-to-br from-orange-900/50 to-red-900/40 border border-orange-700/50 rounded-2xl px-6 py-4 text-center min-w-[180px]">
                  <div className="text-4xl font-black text-orange-400 mb-1">
                    {streak}
                  </div>
                  <div className="text-sm text-orange-300 font-medium">
                    DAY STREAK
                  </div>
                </div>

                <div className={`px-5 py-3 rounded-full font-bold text-sm tracking-wider ${
                  isPro 
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-red-500/30' 
                    : 'bg-gray-800 text-gray-300 border border-gray-700'
                }`}>
                  {isPro ? 'PRO MEMBER' : 'ACTIVE MEMBER'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Week Stats & Quick Actions – reordered on mobile */}
        <div className="flex flex-col gap-10">
          <div className="order-2 lg:order-1">
            <WeekStats user={user} />
          </div>
          <div className="order-1 lg:order-2">
            <QuickActions />
          </div>
        </div>

        {/* Secondary sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
          <RecentWorkouts user={user} />
          <GoalsProgress user={user} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
          <PersonalRecords user={user} />
          <UpcomingClasses user={user} />
        </div>

        {/* Footer note */}
        <div className="text-center text-gray-600 text-sm pt-8">
          More insights and personal stats coming soon...
        </div>
      </div>
    </div>
  );
}