'use client';

export default function UpcomingClasses() {
  const upcomingClasses = [
    { id: 1, name: 'Boxing Circuit', day: 'Tomorrow', time: '07:00 AM', trainer: 'Rocky Iron', spots: 3 },
    { id: 2, name: 'Spin Class', day: 'Tomorrow', time: '06:00 PM', trainer: 'Alex Thunder', spots: 5 },
    { id: 3, name: 'CrossFit', day: 'Wed', time: '07:00 PM', trainer: 'Jake Titan', spots: 2 }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
      <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
        UPCOMING <span className="text-red-500">CLASSES</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {upcomingClasses.map((classItem) => (
          <div key={classItem.id} className="bg-black/50 border border-gray-800 p-4 hover:border-red-500 transition-all">
            <h3 className="font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>{classItem.name}</h3>
            <div className="text-sm text-gray-400 space-y-1 mb-4">
              <div>{classItem.day} • {classItem.time}</div>
              <div>Trainer: {classItem.trainer}</div>
              <div className="text-red-500">{classItem.spots} spots left</div>
            </div>
            <button className="w-full bg-red-500 hover:bg-red-600 py-2 text-sm font-bold transition-colors">
              BOOK NOW
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}