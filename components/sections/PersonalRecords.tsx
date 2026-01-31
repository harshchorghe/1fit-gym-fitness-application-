'use client';

export default function PersonalRecords() {
  const personalRecords = [
    { exercise: 'Bench Press', weight: '120 kg', date: 'Jan 20, 2026' },
    { exercise: 'Deadlift', weight: '180 kg', date: 'Jan 15, 2026' },
    { exercise: 'Squat', weight: '150 kg', date: 'Jan 18, 2026' },
    { exercise: '5K Run', weight: '22:15', date: 'Jan 10, 2026' }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
      <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
        PERSONAL <span className="text-red-500">RECORDS</span>
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {personalRecords.map((record, i) => (
          <div key={i} className="bg-black/50 border border-gray-800 p-4 hover:border-red-500 transition-all">
            <div className="text-xs text-gray-500 mb-1">{record.exercise}</div>
            <div className="text-2xl font-bold text-red-500 mb-1" style={{ fontFamily: 'Oswald, sans-serif' }}>
              {record.weight}
            </div>
            <div className="text-xs text-gray-600">{record.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}