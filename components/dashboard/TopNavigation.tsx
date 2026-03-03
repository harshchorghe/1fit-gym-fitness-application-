'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';  // Adjust path if needed (e.g. '@/lib/firebase')
import ThemeToggle from '@/components/ThemeToggle';

interface TopNavigationProps {
  onMenuClick: () => void;
}

export default function TopNavigation({ onMenuClick }: TopNavigationProps) {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<{
    name: string;
    membershipType: string;
    image?: string;
  }>({
    name: 'Guest',
    membershipType: '',
    image: undefined,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        // Not logged in → show guest or redirect
        setUserInfo({
          name: 'Guest',
          membershipType: '',
          image: undefined,
        });
        // Optional: router.push('/signin');
        setLoading(false);
        return;
      }

      try {
        // Fetch from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userDocRef);

        let name = firebaseUser.displayName || 'User';
        let membership = 'Starter';

        if (userSnap.exists()) {
          const data = userSnap.data();
          name = firebaseUser.displayName || 
                `${data.firstName || ''} ${data.lastName || ''}`.trim() || 
                'User';
          membership = data.membershipType || 'Starter';
        }

        setUserInfo({
          name,
          membershipType: membership,
          image: firebaseUser.photoURL || undefined, // will show default icon if not provided
        });
      } catch (err) {
        console.error('Error fetching user info for nav:', err);
        setUserInfo({
          name: firebaseUser.displayName || 'User',
          membershipType: 'Starter',
          image: undefined,
        });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

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
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
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
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                {userInfo.image ? (
                  <img src={userInfo.image} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-300">
                    <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="currentColor" strokeWidth="2" />
                    <path d="M4 22c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="2" />
                  </svg>
                )}
              </div>
              <div className="hidden sm:block text-left">
                {loading ? (
                  <div className="text-sm text-gray-400">Loading...</div>
                ) : (
                  <>
                    <div className="text-sm font-semibold">{userInfo.name}</div>
                    {userInfo.membershipType && (
                      <div className="text-xs text-gray-500">
                        {userInfo.membershipType} Member
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}