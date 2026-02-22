'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { adminAddWorkout } from '@/lib/firestore/admin';
import { adminAddClass } from '@/lib/firestore/admin';
import { adminAddMealPlan } from '@/lib/firestore/admin'; // ← make sure this is imported

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Workout form state
  const [workoutForm, setWorkoutForm] = useState({
    title: '',
    trainer: '',
    duration: '',
    difficulty: 'Beginner',
    calories: '',
  });

  // Class form state
  const [classForm, setClassForm] = useState({
    title: '',
    trainer: '',
    time: '06:00 AM',
    duration: '45 min',
    type: 'Yoga',
    intensity: 'Low',
    capacity: 15,
    startTimeDate: '', // we'll convert to timestamp
  });

  // NEW: Meal Plan form state
  const [mealPlanForm, setMealPlanForm] = useState({
    name: '',
    calories: '',
    protein: '',
    description: '',
    duration: 'Ongoing',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const data = userDoc.data() || {};
        const adminFlag = data.isAdmin === true || data.role === 'admin';
        setIsAdmin(adminFlag);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleWorkoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminAddWorkout(user.uid, {
        title: workoutForm.title.trim(),
        trainer: workoutForm.trainer.trim(),
        duration: workoutForm.duration.trim(),
        difficulty: workoutForm.difficulty,
        calories: Number(workoutForm.calories),
      });
      setMessage('Workout added successfully!');
      setWorkoutForm({ title: '', trainer: '', duration: '', difficulty: 'Beginner', calories: '' });
    } catch (err: any) {
      setMessage('Error: ' + err.message);
    }
  };

  const handleClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const startTime = classForm.startTimeDate
        ? Timestamp.fromDate(new Date(classForm.startTimeDate))
        : Timestamp.now();

      await adminAddClass(user.uid, {
        title: classForm.title.trim(),
        trainer: classForm.trainer.trim(),
        time: classForm.time.trim(),
        duration: classForm.duration.trim(),
        type: classForm.type,
        intensity: classForm.intensity as any,
        capacity: Number(classForm.capacity),
        startTime,
      });
      setMessage('Class added successfully!');
      setClassForm({
        title: '',
        trainer: '',
        time: '06:00 AM',
        duration: '45 min',
        type: 'Yoga',
        intensity: 'Low',
        capacity: 15,
        startTimeDate: '',
      });
    } catch (err: any) {
      setMessage('Error: ' + err.message);
    }
  };

  // NEW: Handle Meal Plan submission
  const handleMealPlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminAddMealPlan(user.uid, {
        name: mealPlanForm.name.trim(),
        calories: Number(mealPlanForm.calories),
        protein: Number(mealPlanForm.protein),
        description: mealPlanForm.description.trim(),
        duration: mealPlanForm.duration.trim(),
      });
      setMessage('Meal Plan added successfully!');
      setMealPlanForm({
        name: '',
        calories: '',
        protein: '',
        description: '',
        duration: 'Ongoing',
      });
    } catch (err: any) {
      setMessage('Error: ' + err.message);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading admin panel...</div>;

  if (!user) return <div className="p-8 text-center text-red-500">Please sign in first</div>;

  if (!isAdmin) return <div className="p-8 text-center text-red-500">Access denied: Admin only</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12">
      <h1 className="text-4xl font-bold text-center mb-8">Admin Dashboard</h1>

      {message && (
        <div className={`p-4 rounded text-center ${message.includes('Error') ? 'bg-red-900' : 'bg-green-900'}`}>
          {message}
        </div>
      )}

      {/* Workout Form */}
      <section className="bg-gray-900 p-8 rounded-xl border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-red-500">Add New Workout</h2>
        <form onSubmit={handleWorkoutSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title *"
            value={workoutForm.title}
            onChange={(e) => setWorkoutForm({ ...workoutForm, title: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
            required
          />
          <input
            type="text"
            placeholder="Trainer"
            value={workoutForm.trainer}
            onChange={(e) => setWorkoutForm({ ...workoutForm, trainer: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
          />
          <input
            type="text"
            placeholder="Duration e.g. 45 min *"
            value={workoutForm.duration}
            onChange={(e) => setWorkoutForm({ ...workoutForm, duration: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
            required
          />
          <select
            value={workoutForm.difficulty}
            onChange={(e) => setWorkoutForm({ ...workoutForm, difficulty: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <input
            type="number"
            placeholder="Calories *"
            value={workoutForm.calories}
            onChange={(e) => setWorkoutForm({ ...workoutForm, calories: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
            required
          />
          <button type="submit" className="w-full bg-red-600 py-3 rounded font-bold hover:bg-red-700">
            Add Workout
          </button>
        </form>
      </section>

      {/* Class Form */}
      <section className="bg-gray-900 p-8 rounded-xl border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-red-500">Add New Class</h2>
        <form onSubmit={handleClassSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title *"
            value={classForm.title}
            onChange={(e) => setClassForm({ ...classForm, title: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
            required
          />
          <input
            type="text"
            placeholder="Trainer *"
            value={classForm.trainer}
            onChange={(e) => setClassForm({ ...classForm, trainer: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
            required
          />
          <input
            type="text"
            placeholder="Time e.g. 06:00 AM *"
            value={classForm.time}
            onChange={(e) => setClassForm({ ...classForm, time: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
            required
          />
          <input
            type="text"
            placeholder="Duration e.g. 45 min *"
            value={classForm.duration}
            onChange={(e) => setClassForm({ ...classForm, duration: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
            required
          />
          <select
            value={classForm.type}
            onChange={(e) => setClassForm({ ...classForm, type: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
          >
            <option value="Yoga">Yoga</option>
            <option value="HIIT">HIIT</option>
            <option value="Strength">Strength</option>
            <option value="Cardio">Cardio</option>
          </select>
          <select
            value={classForm.intensity}
            onChange={(e) => setClassForm({ ...classForm, intensity: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            type="number"
            placeholder="Capacity *"
            value={classForm.capacity}
            onChange={(e) => setClassForm({ ...classForm, capacity: Number(e.target.value) })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
            required
          />
          <input
            type="datetime-local"
            placeholder="Start Date & Time"
            value={classForm.startTimeDate}
            onChange={(e) => setClassForm({ ...classForm, startTimeDate: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
          />
          <button type="submit" className="w-full bg-red-600 py-3 rounded font-bold hover:bg-red-700">
            Add Class
          </button>
        </form>
      </section>

      {/* NEW: Meal Plan Form – added below your class form */}
      <section className="bg-gray-900 p-8 rounded-xl border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-red-500">Add New Meal Plan</h2>
        <form onSubmit={handleMealPlanSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Plan Name * (e.g. Muscle Gain Plan)"
            value={mealPlanForm.name}
            onChange={(e) => setMealPlanForm({ ...mealPlanForm, name: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
            required
          />
          <input
            type="number"
            placeholder="Daily Calories Target *"
            value={mealPlanForm.calories}
            onChange={(e) => setMealPlanForm({ ...mealPlanForm, calories: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
            required
          />
          <input
            type="number"
            placeholder="Daily Protein Target (g) *"
            value={mealPlanForm.protein}
            onChange={(e) => setMealPlanForm({ ...mealPlanForm, protein: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
            required
          />
          <textarea
            placeholder="Description * (e.g. High protein, moderate carbs for muscle building)"
            value={mealPlanForm.description}
            onChange={(e) => setMealPlanForm({ ...mealPlanForm, description: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded h-32"
            required
          />
          <input
            type="text"
            placeholder="Duration (e.g. 4 weeks, 6 weeks, Ongoing)"
            value={mealPlanForm.duration}
            onChange={(e) => setMealPlanForm({ ...mealPlanForm, duration: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
          />
          <button type="submit" className="w-full bg-red-600 py-3 rounded font-bold hover:bg-red-700">
            Add Meal Plan
          </button>
        </form>
      </section>
    </div>
  );
}