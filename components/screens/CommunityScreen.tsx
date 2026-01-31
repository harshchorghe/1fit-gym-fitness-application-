'use client';

export default function CommunityScreen() {
  const leaderboard = [
    { rank: 1, name: 'Sarah Burns', workouts: 28, streak: 42, points: 2840, avatar: '👩' },
    { rank: 2, name: 'Marcus Steel', workouts: 26, streak: 38, points: 2650, avatar: '👨' },
    { rank: 3, name: 'Alex Thompson', workouts: 24, streak: 28, points: 2420, avatar: '👤', isYou: true },
    { rank: 4, name: 'Luna Peace', workouts: 22, streak: 35, points: 2280, avatar: '👩' },
    { rank: 5, name: 'Rocky Iron', workouts: 21, streak: 21, points: 2140, avatar: '👨' },
    { rank: 6, name: 'Jake Titan', workouts: 20, streak: 25, points: 2050, avatar: '👨' },
    { rank: 7, name: 'Emma Swift', workouts: 19, streak: 19, points: 1920, avatar: '👩' },
    { rank: 8, name: 'Max Power', workouts: 18, streak: 30, points: 1880, avatar: '👨' }
  ];

  const challenges = [
    {
      id: 1,
      name: '30-Day Streak Challenge',
      description: 'Complete a workout every day for 30 days',
      participants: 234,
      daysLeft: 12,
      progress: 18,
      total: 30,
      reward: '500 Points + Badge',
      difficulty: 'Hard'
    },
    {
      id: 2,
      name: 'Cardio King',
      description: 'Burn 5000 calories through cardio this month',
      participants: 156,
      daysLeft: 8,
      progress: 3200,
      total: 5000,
      reward: '300 Points',
      difficulty: 'Medium'
    },
    {
      id: 3,
      name: 'Iron Warrior',
      description: 'Complete 20 strength training sessions',
      participants: 189,
      daysLeft: 15,
      progress: 14,
      total: 20,
      reward: '400 Points + Trophy',
      difficulty: 'Medium'
    }
  ];

  const recentActivity = [
    {
      user: 'Sarah Burns',
      action: 'completed',
      activity: 'HIIT Explosion class',
      time: '2 hours ago',
      likes: 24
    },
    {
      user: 'Marcus Steel',
      action: 'achieved',
      activity: 'Personal Record in Deadlift (200kg)',
      time: '4 hours ago',
      likes: 45
    },
    {
      user: 'Luna Peace',
      action: 'joined',
      activity: '30-Day Streak Challenge',
      time: '6 hours ago',
      likes: 12
    },
    {
      user: 'Rocky Iron',
      action: 'completed',
      activity: 'Boxing Circuit',
      time: '8 hours ago',
      likes: 18
    }
  ];

  const groups = [
    {
      id: 1,
      name: 'Morning Warriors',
      members: 156,
      description: 'For those who crush their workouts before sunrise',
      category: 'Schedule'
    },
    {
      id: 2,
      name: 'Strength Squad',
      members: 234,
      description: 'Dedicated to building strength and muscle',
      category: 'Training'
    },
    {
      id: 3,
      name: 'Cardio Crew',
      members: 189,
      description: 'Running, cycling, and all things cardio',
      category: 'Training'
    },
    {
      id: 4,
      name: 'Nutrition Nerds',
      members: 145,
      description: 'Sharing meal plans, recipes, and nutrition tips',
      category: 'Nutrition'
    }
  ];

  const workoutBuddies = [
    { name: 'Sarah Burns', status: 'online', lastWorkout: 'Today', avatar: '👩' },
    { name: 'Marcus Steel', status: 'working out', lastWorkout: 'Today', avatar: '👨' },
    { name: 'Luna Peace', status: 'offline', lastWorkout: 'Yesterday', avatar: '👩' },
    { name: 'Rocky Iron', status: 'online', lastWorkout: 'Today', avatar: '👨' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-slide-in">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
          1FIT <span className="text-red-500">COMMUNITY</span>
        </h1>
        <p className="text-gray-400">Connect, compete, and grow together</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-in stagger-1">
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 hover:border-red-500 transition-all">
          <div className="text-gray-500 text-sm mb-2 uppercase tracking-wider">Your Rank</div>
          <div className="text-3xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
            #3
          </div>
          <div className="text-xs text-gray-600 mt-1">This month</div>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 hover:border-red-500 transition-all">
          <div className="text-gray-500 text-sm mb-2 uppercase tracking-wider">Points</div>
          <div className="text-3xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
            2420
          </div>
          <div className="text-xs text-gray-600 mt-1">+180 this week</div>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 hover:border-red-500 transition-all">
          <div className="text-gray-500 text-sm mb-2 uppercase tracking-wider">Challenges</div>
          <div className="text-3xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
            3
          </div>
          <div className="text-xs text-gray-600 mt-1">Active</div>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 hover:border-red-500 transition-all">
          <div className="text-gray-500 text-sm mb-2 uppercase tracking-wider">Friends</div>
          <div className="text-3xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
            24
          </div>
          <div className="text-xs text-gray-600 mt-1">8 online now</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard */}
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 animate-slide-in stagger-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>
              <span className="text-red-500">LEADERBOARD</span>
            </h2>
            <select className="bg-gray-800 border border-gray-700 px-3 py-1 text-sm">
              <option>This Month</option>
              <option>This Week</option>
              <option>All Time</option>
            </select>
          </div>
          <div className="space-y-2">
            {leaderboard.map((user) => (
              <div
                key={user.rank}
                className={`flex items-center justify-between p-4 border-l-4 ${
                  user.isYou
                    ? 'border-red-500 bg-red-500/10'
                    : user.rank <= 3
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-gray-800 bg-black/50'
                } hover:bg-gray-900/50 transition-all`}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`text-2xl font-bold ${user.rank <= 3 ? 'text-yellow-500' : 'text-gray-500'}`} style={{ fontFamily: 'Oswald, sans-serif' }}>
                    #{user.rank}
                  </div>
                  <div className="text-3xl">{user.avatar}</div>
                  <div>
                    <div className="font-bold flex items-center space-x-2">
                      <span>{user.name}</span>
                      {user.isYou && <span className="text-xs bg-red-500 px-2 py-1 rounded">YOU</span>}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.workouts} workouts • {user.streak} day streak
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-red-500">{user.points}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workout Buddies */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 animate-slide-in stagger-3">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
            WORKOUT <span className="text-red-500">BUDDIES</span>
          </h2>
          <div className="space-y-3">
            {workoutBuddies.map((buddy, idx) => (
              <div key={idx} className="flex items-center space-x-3 p-3 bg-black/50 border border-gray-800 hover:border-red-500 transition-all">
                <div className="text-3xl">{buddy.avatar}</div>
                <div className="flex-1">
                  <div className="font-bold text-sm">{buddy.name}</div>
                  <div className="text-xs text-gray-500">Last: {buddy.lastWorkout}</div>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  buddy.status === 'online' ? 'bg-green-500' :
                  buddy.status === 'working out' ? 'bg-red-500 animate-pulse' :
                  'bg-gray-600'
                }`}></div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 bg-gray-800 hover:bg-red-500 py-3 font-bold transition-colors">
            + ADD BUDDY
          </button>
        </div>
      </div>

      {/* Active Challenges */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>
            ACTIVE <span className="text-red-500">CHALLENGES</span>
          </h2>
          <button className="text-red-500 hover:text-red-400 text-sm font-bold">VIEW ALL</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="bg-black/50 border border-gray-800 p-4 hover:border-red-500 transition-all">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg">{challenge.name}</h3>
                <span className={`text-xs px-2 py-1 rounded ${
                  challenge.difficulty === 'Hard' ? 'bg-red-500' :
                  challenge.difficulty === 'Medium' ? 'bg-yellow-500 text-black' :
                  'bg-green-500 text-black'
                }`}>
                  {challenge.difficulty}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-4">{challenge.description}</p>
              
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{challenge.progress}/{challenge.total}</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all"
                    style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Participants</span>
                  <span className="font-bold">{challenge.participants}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Days Left</span>
                  <span className="font-bold text-red-500">{challenge.daysLeft}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reward</span>
                  <span className="font-bold text-yellow-500">{challenge.reward}</span>
                </div>
              </div>

              <button className="w-full bg-gray-800 hover:bg-red-500 py-2 text-sm font-bold transition-colors">
                VIEW DETAILS
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
          RECENT <span className="text-red-500">ACTIVITY</span>
        </h2>
        <div className="space-y-3">
          {recentActivity.map((activity, idx) => (
            <div key={idx} className="flex items-start space-x-4 p-4 bg-black/50 border border-gray-800 hover:border-red-500 transition-all">
              <div className="text-3xl">💪</div>
              <div className="flex-1">
                <div className="text-sm">
                  <span className="font-bold">{activity.user}</span>
                  <span className="text-gray-500"> {activity.action} </span>
                  <span className="text-white">{activity.activity}</span>
                </div>
                <div className="text-xs text-gray-600 mt-1">{activity.time}</div>
              </div>
              <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500">
                <span>❤️</span>
                <span className="text-sm">{activity.likes}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Groups */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>
            FITNESS <span className="text-red-500">GROUPS</span>
          </h2>
          <button className="text-red-500 hover:text-red-400 text-sm font-bold">+ CREATE GROUP</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {groups.map((group) => (
            <div key={group.id} className="bg-black/50 border border-gray-800 p-4 hover:border-red-500 transition-all">
              <div className="text-3xl mb-3">👥</div>
              <h3 className="font-bold mb-2">{group.name}</h3>
              <p className="text-sm text-gray-400 mb-3">{group.description}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-gray-500">{group.members} members</span>
                <span className="text-xs bg-gray-800 px-2 py-1 rounded">{group.category}</span>
              </div>
              <button className="w-full bg-gray-800 hover:bg-red-500 py-2 text-sm font-bold transition-colors">
                JOIN GROUP
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}