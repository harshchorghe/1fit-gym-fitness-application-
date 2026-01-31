'use client';

import { useRouter } from 'next/navigation';

interface TopNavigationProps {
  onMenuClick: () => void;
}

export default function TopNavigation({ onMenuClick }: TopNavigationProps) {
  const router = useRouter();
  
  const user = {
    name: 'Alex Thompson',
    membershipType: 'Pro',
    image: '👤',
  };

  return (
    <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-lg border-b border-gray-900 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <button 
              className="lg:hidden text-white"
              onClick={onMenuClick}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div 
              className="text-2xl font-bold cursor-pointer" 
              style={{ fontFamily: 'Oswald, sans-serif' }}
              onClick={() => router.push('/home/overview')}
            >
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
            <div 
              className="flex items-center space-x-3 p-2 hover:bg-gray-900 rounded-lg transition-colors cursor-pointer"
              onClick={() => router.push('/profile')}
            >
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
  );
}