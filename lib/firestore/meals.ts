import { db, auth } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

export interface LoggedMeal {
  id: string;
  date: string;           // YYYY-MM-DD
  mealType: 'Breakfast' | 'Mid-Morning Snack' | 'Lunch' | 'Afternoon Snack' | 'Dinner' | string;
  name: string;
  items: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  loggedAt: Timestamp;
}

export interface MealPlanMeal {
  mealType: LoggedMeal['mealType'];
  name: string;
  items: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface MealPlan {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs?: number;
  fats?: number;
  description: string;
  duration: string;
  meals?: MealPlanMeal[];           // ← if plan contains separate meals
}

// ────────────────────────────────────────────────
// Get today's logged meals for current user
// ────────────────────────────────────────────────
export async function getTodayLoggedMeals(): Promise<LoggedMeal[]> {
  const user = auth.currentUser;
  if (!user) return [];

  const today = new Date().toISOString().split('T')[0];

  const q = query(
    collection(db, `users/${user.uid}/loggedMeals`),
    where('date', '==', today),
    orderBy('loggedAt', 'asc')
  );

  const snap = await getDocs(q);
  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as LoggedMeal[];
}

// ────────────────────────────────────────────────
// Log a single meal
// ────────────────────────────────────────────────
export async function logMeal(meal: Omit<LoggedMeal, 'id' | 'loggedAt'>): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('User not logged in');

  const docRef = await addDoc(collection(db, `users/${user.uid}/loggedMeals`), {
    ...meal,
    loggedAt: serverTimestamp(),
  });

  return docRef.id;
}

// ────────────────────────────────────────────────
// Log entire meal plan (or fallback to single entry)
// ────────────────────────────────────────────────
export async function logMealPlan(plan: MealPlan): Promise<string[]> {
  const user = auth.currentUser;
  if (!user) throw new Error('User not logged in');

  const today = new Date().toISOString().split('T')[0];
  const loggedIds: string[] = [];

  // If the plan contains separate meals → log them individually
  if (plan.meals && plan.meals.length > 0) {
    for (const m of plan.meals) {
      const mealData: Omit<LoggedMeal, 'id' | 'loggedAt'> = {
        date: today,
        mealType: m.mealType,
        name: m.name,
        items: m.items,
        calories: m.calories,
        protein: m.protein,
        carbs: m.carbs ?? 0,
        fats: m.fats ?? 0,
      };
      const id = await logMeal(mealData);
      loggedIds.push(id);
    }
  }
  // Otherwise → log the whole plan as one meal entry
  else {
    const fallbackCarbs = plan.carbs ?? Math.round((plan.calories * 0.50) / 4);
    const fallbackFats  = plan.fats  ?? Math.round((plan.calories * 0.30) / 9);

    const mealData: Omit<LoggedMeal, 'id' | 'loggedAt'> = {
      date: today,
      mealType: 'Full Plan', // ← you can make this configurable later
      name: plan.name,
      items: [`Complete meal plan: ${plan.name}`],
      calories: plan.calories,
      protein: plan.protein,
      carbs: fallbackCarbs,
      fats: fallbackFats,
    };

    const id = await logMeal(mealData);
    loggedIds.push(id);
  }

  return loggedIds;
}

// ────────────────────────────────────────────────
// Get all available (global) meal plans
// ────────────────────────────────────────────────
export async function getMealPlans(): Promise<MealPlan[]> {
  const snap = await getDocs(collection(db, 'mealPlans'));
  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as MealPlan[];
}