'use client';

export default function QuickActions() {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 animate-slide-in stagger-3">
      <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
        QUICK <span className="text-red-500">ACTIONS</span>
      </h2>
      <div className="space-y-3">
        <button className="w-full bg-red-500 hover:bg-red-600 p-4 font-bold transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
          <span className="text-xl">💪</span>
          <span>START WORKOUT</span>
        </button>
        <button className="w-full border-2 border-gray-700 hover:border-red-500 p-4 font-bold transition-all flex items-center justify-center space-x-2">
          <span className="text-xl">📅</span>
          <span>BOOK CLASS</span>
        </button>
        <button className="w-full border-2 border-gray-700 hover:border-red-500 p-4 font-bold transition-all flex items-center justify-center space-x-2">
          <span className="text-xl">👤</span>
          <span>HIRE TRAINER</span>
        </button>
        <button className="w-full border-2 border-gray-700 hover:border-red-500 p-4 font-bold transition-all flex items-center justify-center space-x-2">
          <span className="text-xl">🥗</span>
          <span>MEAL PLAN</span>
        </button>
      </div>
    </div>
  );
}