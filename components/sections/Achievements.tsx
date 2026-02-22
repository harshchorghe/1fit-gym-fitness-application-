'use client';

import { AppUser } from '@/lib/hooks/useUserData';

interface AchievementsProps {
  user: AppUser;
}

export default function Achievements({ user }: AchievementsProps) {
  const streak = user.streak || 0;

  const achievements = [
    { id: 1, name: '7 Day Streak', icon: '🔥', unlocked: streak >= 7 },
    { id: 2, name: '30 Day Streak', icon: '🔥🔥🔥', unlocked: streak >= 30 },
    { id: 3, name: 'Early Bird', icon: '🌅', unlocked: true }, // example static
    { id: 4, name: 'Iron Warrior', icon: '⚔️', unlocked: streak >= 14 },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-2xl">
      <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
        <span className="text-red-500">ACHIEVEMENTS</span>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {achievements.map((ach) => (
          <div 
            key={ach.id} 
            className={`text-center p-4 border rounded-lg transition-all ${
              ach.unlocked 
                ? 'border-red-500 bg-red-500/10 shadow-red-500/20' 
                : 'border-gray-800 bg-gray-900/50 opacity-60'
            }`}
          >
            <div className={`text-4xl mb-2 ${ach.unlocked ? 'animate-pulse' : ''}`}>
              {ach.icon}
            </div>
            <div className="text-xs font-semibold">
              {ach.name}
            </div>
            {ach.unlocked && (
              <div className="text-[10px] text-green-400 mt-1">Unlocked</div>
            )}
          </div>
        ))}
      </div>

      {streak > 0 && (
        <p className="text-center text-sm text-gray-400 mt-4">
          Current streak: <span className="text-orange-400 font-bold">{streak} days 🔥</span>
        </p>
      )}
    </div>
  );
}