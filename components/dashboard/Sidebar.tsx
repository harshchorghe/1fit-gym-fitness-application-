'use client';

import { useRouter, usePathname } from 'next/navigation';

interface SidebarProps {
  isSidebarOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isSidebarOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const user = {
    streak: 12,
  };

  const navigationItems = [
    { name: 'Overview', icon: '📊', path: '/home/overview' },
    { name: 'Workouts', icon: '💪', path: '/home/workouts' },
    { name: 'Classes', icon: '📅', path: '/home/classes' },
    { name: 'Progress', icon: '📈', path: '/home/progress' },
    { name: 'Nutrition', icon: '🥗', path: '/home/nutrition' },
    { name: 'Community', icon: '👥', path: '/home/community' },
    { name: 'Profile', icon: '👤', path: '/profile' }
  ];

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
  );
}