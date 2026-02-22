'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { getUserData, incrementDailyStreak, hasClaimedStreakToday } from '@/lib/firestore/users';

interface SidebarProps {
  isSidebarOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isSidebarOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [streak, setStreak] = useState(0);
  const [claiming, setClaiming] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [streakClaimed, setStreakClaimed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load real streak from Firestore
  useEffect(() => {
    async function loadStreak() {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getUserData(user.uid);
        if (userData) {
          setStreak(userData.streak || 0);
        }

        const claimed = await hasClaimedStreakToday(user.uid);
        setStreakClaimed(claimed);
      } catch (error) {
        console.error("Failed to load streak:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStreak();
  }, []);

  const navigationItems = [
    { name: 'Overview', icon: '📊', path: '/home/overview' },
    { name: 'Workouts', icon: '💪', path: '/home/workouts' },
    { name: 'Classes', icon: '📅', path: '/home/classes' },
    { name: 'Progress', icon: '📈', path: '/home/progress' },
    { name: 'Nutrition', icon: '🥗', path: '/home/nutrition' },
    { name: 'Community', icon: '👥', path: '/home/community' },
    { name: 'Profile', icon: '👤', path: '/profile' }
  ];

  const handleClaimStreak = async () => {
    const user = auth.currentUser;
    if (!user) {
      setMessage("Please sign in first");
      return;
    }

    if (streakClaimed) {
      setMessage("You've already claimed your streak today!");
      return;
    }

    setClaiming(true);
    try {
      const newStreak = await incrementDailyStreak(user.uid);
      if (newStreak !== null) {
        setStreak(newStreak);
        setStreakClaimed(true);
        setMessage(`Streak updated! Current: ${newStreak} 🔥`);
      }
    } catch (err: any) {
      console.error(err);
      setMessage("Failed to update streak");
    } finally {
      setClaiming(false);
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-gray-900/50 backdrop-blur-lg border-r border-gray-800 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 z-40 mt-16 lg:mt-0`}>
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              pathname === item.path
                ? 'bg-red-500 text-white' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="font-semibold">{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Daily Streak Claim Button */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleClaimStreak}
          disabled={claiming || streakClaimed || loading}
          className={`w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg font-semibold transition-all mb-4 ${
            streakClaimed || loading
              ? 'bg-gray-700 cursor-not-allowed' 
              : claiming
              ? 'bg-gray-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white'
          }`}
        >
          <span className="text-xl">{streakClaimed ? '✓' : '🔥'} {streakClaimed ? 'Claimed Today' : 'Claim Daily Streak'}</span>
        </button>

        {message && (
          <div className="text-center text-sm mb-3 px-2 py-1.5 bg-gray-800/80 rounded border border-gray-700">
            {message}
          </div>
        )}
      </div>

      {/* Current Streak Display */}
      <div className="p-4 border-t border-gray-800">
        <div className="bg-gradient-to-br from-red-500/20 to-black border border-red-500/30 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">🔥</span>
            <div>
              <div className="text-xs text-gray-400">Current Streak</div>
              <div className="text-xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
                {loading ? '...' : `${streak} Days`}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Keep it going! {streak >= 15 ? '🎉 Amazing!' : `Only ${Math.max(0, 15 - streak)} more to unlock 15-day badge.`}
          </div>
        </div>
      </div>
    </aside>
  );
}