'use client';

import { useEffect, useState } from 'react';
import { AppUser } from '@/lib/hooks/useUserData';

interface TodayScheduleProps {
  user: AppUser;
}

export default function TodaySchedule({ user }: TodayScheduleProps) {
  const [todayItems, setTodayItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch real data
    // - logged meals from users/{uid}/loggedMeals where date == today
    // - booked classes from users/{uid}/bookings where date == today
    // - planned workouts from gymSessions or workouts

    setTimeout(() => {
      setTodayItems([
        { id: 1, name: 'HIIT Cardio', time: '06:00 AM', trainer: 'Sarah Burns', status: 'completed', duration: '45 min', type: 'class' },
        { id: 2, name: 'Breakfast Log', time: '08:30 AM', status: 'completed', calories: 620, type: 'meal' },
        { id: 3, name: 'Strength Training', time: '09:00 AM', status: 'upcoming', duration: '60 min', type: 'workout' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 animate-slide-in stagger-2">
      <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
        TODAY'S <span className="text-red-500">SCHEDULE</span>
      </h2>

      {loading ? (
        <div className="space-y-3">
          <div className="h-20 bg-gray-800 rounded animate-pulse" />
          <div className="h-20 bg-gray-800 rounded animate-pulse" />
        </div>
      ) : todayItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No schedule items for today yet
        </div>
      ) : (
        <div className="space-y-3">
          {todayItems.map((item) => (
            <div 
              key={item.id} 
              className={`flex items-center justify-between p-4 border-l-4 ${
                item.status === 'completed' ? 'border-green-500 bg-green-500/10' :
                item.status === 'upcoming' ? 'border-yellow-500 bg-yellow-500/10' :
                'border-red-500 bg-red-500/10'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>{item.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.status === 'completed' ? 'bg-green-500' :
                    item.status === 'upcoming' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}>
                    {item.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  {item.time} • {item.duration || item.calories + ' kcal'} • {item.trainer || 'Self'}
                </div>
              </div>
              {item.status !== 'completed' && (
                <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-sm font-semibold transition-colors">
                  {item.type === 'class' ? 'JOIN' : item.type === 'workout' ? 'START' : 'VIEW'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}