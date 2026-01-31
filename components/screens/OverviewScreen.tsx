'use client';

import TodaySchedule from '../sections/TodaySchedule';
import QuickActions from '../sections/QuickActions';
import WeekStats from '../sections/WeekStats';
import RecentWorkouts from '../sections/RecentWorkouts';
import GoalsProgress from '../sections/GoalsProgress';
import PersonalRecords from '../sections/PersonalRecords';
import Achievements from '../sections/Achievements';
import UpcomingClasses from '../sections/UpcomingClasses';

export default function OverviewScreen() {
  const user = {
    name: 'Alex Thompson',
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="animate-slide-in">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
          WELCOME BACK, <span className="text-red-500">{user.name.split(' ')[0].toUpperCase()}</span>
        </h1>
        <p className="text-gray-400">Ready to crush today's goals?</p>
      </div>

      {/* This Week Stats */}
      <WeekStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <TodaySchedule />

        {/* Quick Actions */}
        <QuickActions />
      </div>

      {/* Recent Workouts & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentWorkouts />
        <GoalsProgress />
      </div>

      {/* Personal Records & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PersonalRecords />
        <Achievements />
      </div>

      {/* Upcoming Classes */}
      <UpcomingClasses />
    </div>
  );
}