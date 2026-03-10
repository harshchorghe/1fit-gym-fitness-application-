'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { getAllUsersForLeaderboard } from '@/lib/firestore/users';

type LeaderboardUser = {
  uid: string;
  name: string;
  streak: number;
  photoURL?: string;
  rank: number;
};

export default function CommunityScreen() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        setLoading(true);
        setError(null);

        // Fetch up to 200 users (you can increase this number if needed)
        const users = await getAllUsersForLeaderboard(200);

        if (users.length === 0) {
          setError("No users found in the system yet.");
        }

        setLeaderboard(users);
      } catch (err: any) {
        console.error("Failed to load leaderboard:", err);
        setError("Failed to load community leaderboard. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 mt-14">
      {/* Header */}
      <div className="animate-fade-in">
        <h1
          className="text-4xl sm:text-5xl font-bold mb-2"
          style={{ fontFamily: 'Oswald, sans-serif' }}
        >
          1FIT <span className="text-red-500">COMMUNITY</span>
        </h1>
        <p className="text-gray-400">Connect, compete, and grow together</p>
      </div>

      {/* Leaderboard Section */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 md:p-8 rounded-2xl shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            <span className="text-red-500">LEADERBOARD</span>
          </h2>
          <div className="text-sm text-gray-400 bg-gray-800/50 px-4 py-2 rounded-lg">
            Sorted by streak • {leaderboard.length} users shown
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
            <p className="mt-4 text-gray-400">Loading community leaderboard...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-400">{error}</div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No users found yet. Be the first to start your streak!
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((user) => {
              const isYou = user.uid === currentUserId;

              return (
                <div
                  key={user.uid}
                  className={`
                    flex items-center justify-between p-4 rounded-xl border-l-4 transition-all duration-200
                    ${isYou
                      ? 'border-red-500 bg-red-950/30 shadow-md'
                      : user.rank <= 3
                      ? 'border-yellow-500 bg-yellow-950/20'
                      : 'border-gray-700 bg-black/40 hover:bg-gray-800/50'
                    }
                  `}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`
                        text-2xl font-bold min-w-[3.5rem] text-center
                        ${user.rank <= 3 ? 'text-yellow-400' : 'text-gray-400'}
                      `}
                      style={{ fontFamily: 'Oswald, sans-serif' }}
                    >
                      #{user.rank}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base flex items-center gap-2 flex-wrap">
                        <span className="truncate">{user.name}</span>
                        {isYou && (
                          <span className="text-xs bg-red-600 px-2.5 py-1 rounded-full font-medium">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400 mt-0.5">
                        {user.streak} day{user.streak !== 1 ? 's' : ''} streak
                      </div>
                    </div>
                  </div>

                  <div className="text-right min-w-[5rem]">
                    <div className="text-2xl font-bold text-red-400">
                      {user.streak}
                    </div>
                    <div className="text-xs text-gray-500">days</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* You can keep the rest of your component here (challenges, recent activity, groups, etc.) */}
      {/* ... */}
    </div>
  );
}