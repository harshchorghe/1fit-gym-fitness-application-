'use client';

export default function TodaySchedule() {
  const todayClasses = [
    { id: 1, name: 'HIIT Cardio', time: '06:00 AM', trainer: 'Sarah Burns', status: 'completed', duration: '45 min' },
    { id: 2, name: 'Strength Training', time: '09:00 AM', trainer: 'Marcus Steel', status: 'upcoming', duration: '60 min' },
    { id: 3, name: 'Yoga Flow', time: '06:00 PM', trainer: 'Luna Peace', status: 'booked', duration: '50 min' }
  ];

  return (
    <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 animate-slide-in stagger-2">
      <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
        TODAY'S <span className="text-red-500">SCHEDULE</span>
      </h2>
      <div className="space-y-3">
        {todayClasses.map((classItem) => (
          <div 
            key={classItem.id} 
            className={`flex items-center justify-between p-4 border-l-4 ${
              classItem.status === 'completed' ? 'border-green-500 bg-green-500/10' :
              classItem.status === 'upcoming' ? 'border-yellow-500 bg-yellow-500/10' :
              'border-red-500 bg-red-500/10'
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>{classItem.name}</h3>
                <span className={`text-xs px-2 py-1 rounded ${
                  classItem.status === 'completed' ? 'bg-green-500' :
                  classItem.status === 'upcoming' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}>
                  {classItem.status.toUpperCase()}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                {classItem.time} • {classItem.duration} • {classItem.trainer}
              </div>
            </div>
            {classItem.status !== 'completed' && (
              <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-sm font-semibold transition-colors">
                {classItem.status === 'upcoming' ? 'JOIN' : 'DETAILS'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}