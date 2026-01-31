'use client';

export default function Achievements() {
  const achievements = [
    { id: 1, name: '30 Day Streak', icon: '🔥', unlocked: true },
    { id: 2, name: 'Early Bird', icon: '🌅', unlocked: true },
    { id: 3, name: 'Iron Warrior', icon: '⚔️', unlocked: true },
    { id: 4, name: 'Cardio King', icon: '👑', unlocked: false }
  ];

  return (
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
  );
}