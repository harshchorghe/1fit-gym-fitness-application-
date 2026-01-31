'use client';

import { useState } from 'react';

export default function ClassesScreen() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', name: 'All Classes', icon: '🎯' },
    { id: 'strength', name: 'Strength', icon: '💪' },
    { id: 'cardio', name: 'Cardio', icon: '🏃' },
    { id: 'yoga', name: 'Yoga', icon: '🧘' },
    { id: 'hiit', name: 'HIIT', icon: '⚡' }
  ];

  const todayClasses = [
    {
      id: 1,
      name: 'Morning Power Flow',
      time: '06:00 AM',
      duration: '45 min',
      trainer: 'Luna Peace',
      type: 'Yoga',
      spots: 12,
      totalSpots: 15,
      intensity: 'Low',
      status: 'available'
    },
    {
      id: 2,
      name: 'HIIT Explosion',
      time: '07:30 AM',
      duration: '30 min',
      trainer: 'Sarah Burns',
      type: 'HIIT',
      spots: 3,
      totalSpots: 20,
      intensity: 'High',
      status: 'filling-fast'
    },
    {
      id: 3,
      name: 'Strength & Conditioning',
      time: '09:00 AM',
      duration: '60 min',
      trainer: 'Marcus Steel',
      type: 'Strength',
      spots: 8,
      totalSpots: 15,
      intensity: 'High',
      status: 'available'
    },
    {
      id: 4,
      name: 'Lunch Time Cardio',
      time: '12:00 PM',
      duration: '40 min',
      trainer: 'Alex Thunder',
      type: 'Cardio',
      spots: 15,
      totalSpots: 20,
      intensity: 'Medium',
      status: 'available'
    },
    {
      id: 5,
      name: 'Evening Burn',
      time: '06:00 PM',
      duration: '45 min',
      trainer: 'Rocky Iron',
      type: 'Boxing',
      spots: 2,
      totalSpots: 12,
      intensity: 'High',
      status: 'filling-fast'
    },
    {
      id: 6,
      name: 'Sunset Yoga',
      time: '07:30 PM',
      duration: '50 min',
      trainer: 'Luna Peace',
      type: 'Yoga',
      spots: 10,
      totalSpots: 15,
      intensity: 'Low',
      status: 'available'
    }
  ];

  const upcomingWeek = [
    {
      day: 'Tomorrow',
      classes: [
        { name: 'CrossFit Basics', time: '06:00 AM', trainer: 'Jake Titan', spots: 5 },
        { name: 'Spin Class', time: '07:00 PM', trainer: 'Alex Thunder', spots: 8 }
      ]
    },
    {
      day: 'Wednesday',
      classes: [
        { name: 'Boxing Fundamentals', time: '06:30 AM', trainer: 'Rocky Iron', spots: 4 },
        { name: 'Power Yoga', time: '06:00 PM', trainer: 'Luna Peace', spots: 12 }
      ]
    },
    {
      day: 'Thursday',
      classes: [
        { name: 'HIIT Circuit', time: '07:00 AM', trainer: 'Sarah Burns', spots: 6 },
        { name: 'Strength Training', time: '05:30 PM', trainer: 'Marcus Steel', spots: 7 }
      ]
    }
  ];

  const myBookedClasses = [
    {
      id: 1,
      name: 'Strength & Conditioning',
      date: 'Today',
      time: '09:00 AM',
      trainer: 'Marcus Steel',
      status: 'confirmed'
    },
    {
      id: 2,
      name: 'Sunset Yoga',
      date: 'Today',
      time: '07:30 PM',
      trainer: 'Luna Peace',
      status: 'confirmed'
    },
    {
      id: 3,
      name: 'CrossFit Basics',
      date: 'Tomorrow',
      time: '06:00 AM',
      trainer: 'Jake Titan',
      status: 'confirmed'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-slide-in">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
          GROUP <span className="text-red-500">CLASSES</span>
        </h1>
        <p className="text-gray-400">Join our expert-led group fitness classes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-in stagger-1">
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 hover:border-red-500 transition-all">
          <div className="text-gray-500 text-sm mb-2 uppercase tracking-wider">Classes Today</div>
          <div className="text-3xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
            {todayClasses.length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 hover:border-red-500 transition-all">
          <div className="text-gray-500 text-sm mb-2 uppercase tracking-wider">Your Bookings</div>
          <div className="text-3xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
            {myBookedClasses.length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 hover:border-red-500 transition-all">
          <div className="text-gray-500 text-sm mb-2 uppercase tracking-wider">This Week</div>
          <div className="text-3xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
            12
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 hover:border-red-500 transition-all">
          <div className="text-gray-500 text-sm mb-2 uppercase tracking-wider">Attended</div>
          <div className="text-3xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
            28
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 animate-slide-in stagger-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`flex items-center space-x-2 px-4 py-2 font-semibold transition-all ${
              selectedFilter === filter.id
                ? 'bg-red-500 text-white'
                : 'bg-gray-900 border border-gray-800 text-gray-400 hover:border-red-500 hover:text-white'
            }`}
          >
            <span>{filter.icon}</span>
            <span>{filter.name}</span>
          </button>
        ))}
      </div>

      {/* My Booked Classes */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 animate-slide-in stagger-3">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
          YOUR <span className="text-red-500">BOOKINGS</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {myBookedClasses.map((classItem) => (
            <div
              key={classItem.id}
              className="bg-black/50 border-l-4 border-green-500 p-4 hover:bg-gray-900/50 transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold mb-1">{classItem.name}</h3>
                  <div className="text-sm text-gray-400">
                    {classItem.date} • {classItem.time}
                  </div>
                </div>
                <span className="text-xs bg-green-500 px-2 py-1 rounded">BOOKED</span>
              </div>
              <div className="text-sm text-gray-500 mb-3">with {classItem.trainer}</div>
              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 text-xs font-bold transition-colors">
                  VIEW DETAILS
                </button>
                <button className="flex-1 border border-gray-700 hover:border-red-500 py-2 text-xs font-bold transition-colors">
                  CANCEL
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Classes */}
      <div className="animate-slide-in stagger-3">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
          TODAY'S <span className="text-red-500">SCHEDULE</span>
        </h2>
        <div className="space-y-3">
          {todayClasses.map((classItem) => (
            <div
              key={classItem.id}
              className={`bg-gradient-to-br from-gray-900 to-black border-l-4 p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 ${
                classItem.status === 'filling-fast' ? 'border-yellow-500' : 'border-gray-800'
              } hover:border-red-500 transition-all`}
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    {classItem.name}
                  </h3>
                  {classItem.status === 'filling-fast' && (
                    <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded font-bold">
                      FILLING FAST
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <span>⏰</span>
                    <span>{classItem.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>⏱️</span>
                    <span>{classItem.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>👤</span>
                    <span>{classItem.trainer}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>🏷️</span>
                    <span>{classItem.type}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>📊</span>
                    <span>{classItem.intensity} Intensity</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Available Spots</div>
                  <div className="text-xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    {classItem.spots}/{classItem.totalSpots}
                  </div>
                </div>
                <button className="bg-red-500 hover:bg-red-600 px-6 py-3 font-bold transition-colors whitespace-nowrap">
                  BOOK NOW
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming This Week */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
          UPCOMING <span className="text-red-500">THIS WEEK</span>
        </h2>
        <div className="space-y-4">
          {upcomingWeek.map((day, idx) => (
            <div key={idx}>
              <h3 className="text-lg font-bold text-red-500 mb-3" style={{ fontFamily: 'Oswald, sans-serif' }}>
                {day.day}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {day.classes.map((classItem, cidx) => (
                  <div
                    key={cidx}
                    className="bg-black/50 border border-gray-800 p-4 hover:border-red-500 transition-all"
                  >
                    <h4 className="font-bold mb-2">{classItem.name}</h4>
                    <div className="text-sm text-gray-400 space-y-1 mb-3">
                      <div>{classItem.time} • {classItem.trainer}</div>
                      <div className="text-red-500">{classItem.spots} spots left</div>
                    </div>
                    <button className="w-full bg-gray-800 hover:bg-red-500 py-2 text-sm font-bold transition-colors">
                      BOOK NOW
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}