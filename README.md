# 1FitGym - AI-Powered Fitness Platform

1FitGym is a full-stack fitness web app built with Next.js, Firebase, AI APIs, and real-time pose detection. It combines workout tracking, class booking, nutrition planning, community leaderboard, and admin management in one product.

## Table of Contents
1. Product Overview
2. Core Features
3. Tech Stack
4. App Routes
5. API Endpoints
6. Firestore Data Model
7. Security Rules Summary
8. Environment Variables
9. Local Setup
10. Running and Building
11. Project Structure
12. Current Gaps and Notes

## Product Overview

### What this product does
- User authentication with profile and membership data.
- Smart workout flow with AI-generated workout plans.
- Camera-based rep detection and form feedback using MediaPipe.
- Nutrition tracking with AI-generated meal plans.
- Class discovery, booking, and cancellation.
- Progress analytics with achievements and AI insights.
- Community leaderboard using daily streaks.
- Nearby gym discovery from OpenStreetMap data.
- Admin dashboard for workouts, classes, and meal plans.

### Primary users
- Gym members who want guided plans and progress tracking.
- Users who prefer form feedback during workouts.
- Admins who manage workouts, classes, and meal plans.

## Core Features

### 1. Authentication and User Profiles
- Email/password sign-up and sign-in (Firebase Auth).
- User profile stored in Firestore with:
	- name and contact details
	- membership type (Starter, Pro, Elite)
	- streak and role metadata
- Editable profile screen with optional profile photo upload (Firebase Storage).

### 2. Workout System
- Workout library from Firestore collection workouts.
- AI workout generator from prompt input.
- Workout detail pages with:
	- exercise steps
	- coach mode selection
	- rest timers
	- session complete feedback
- Workout quality scoring utility that evaluates:
	- warmup/cooldown presence
	- rest guidance
	- movement variety
	- estimated session volume balance

### 3. Camera Coach and Pose Detection
- MediaPipe Pose Landmarker integration.
- Auto-inferred detection mode by exercise text:
	- squat
	- lunge
	- pushup/upper-body
	- core
	- jumping-jack
	- plank hold
- Rep counting uses phase and validity checks to reduce false increments.
- Plank hold timer support.
- Optional target reached callback for step progression.

### 4. Nutrition
- Daily macro dashboard (calories, protein, carbs, fats).
- Logged meal history for current day.
- Available meal plans from Firestore.
- AI meal plan generation (JSON output parsing and validation).
- Generated meal plan can be logged into user meal history.

### 5. Classes and Booking
- View and filter classes by type.
- Book class flow with capacity check on UI.
- My bookings section.
- Cancel booking support.
- Upcoming classes helper for date-window queries.

### 6. Progress and Insights
- Monthly and weekly progress metrics from completed workouts.
- Achievement badges based on milestones.
- AI insight generation for:
	- general progress interpretation
	- body metrics guidance
- Body measurement logging to user subcollection.

### 7. Community and Streaks
- Leaderboard from users collection.
- Sorted by streak with rank assignment.
- Current user highlight in community list.
- Daily streak increment helpers with transaction safety.

### 8. Nearby Gyms
- API endpoint accepts lat/lon/radius.
- Queries Overpass endpoints with fallback.
- Returns nearby gyms with:
	- name
	- approximate address
	- distance
	- OpenStreetMap link

### 9. Admin
- Admin gate checks role/isAdmin from user document.
- Admin actions:
	- add workout
	- add class
	- add meal plan

## Tech Stack

- Framework: Next.js 16 (App Router)
- UI: React 19, Tailwind CSS
- Language: TypeScript
- Auth/DB/Storage: Firebase Auth, Firestore, Firebase Storage
- Pose AI: @mediapipe/tasks-vision
- LLM APIs:
	- GitHub Models via OpenAI SDK for workout generation
	- Google Gemini for nutrition and gemini route generation
- Icons and Theme: lucide-react, next-themes

## App Routes

### Public/Auth
- / -> Landing page
- /signin -> Sign-in
- /signup -> Sign-up

### Dashboard and Main App
- /home/overview -> Overview dashboard
- /home/workouts -> Workouts listing and creation
- /home/workouts/[id] -> Workout detail + camera coach
- /home/nutrition -> Nutrition tracker and plans
- /home/classes -> Class booking interface
- /home/progress -> Progress analytics
- /home/community -> Leaderboard/community
- /home/profile -> User profile

### Admin
- /admin -> Admin dashboard (role gated)

## API Endpoints

### POST /api/workouts
- Purpose: AI workout generation.
- Model source: GitHub Models endpoint.
- Input body:
```json
{
	"prompt": "Create a 45 min beginner fat loss workout",
	"model": "openai/gpt-4o-mini"
}
```
- Response:
```json
{
	"reply": "{...json string...}"
}
```

### POST /api/nutrition
- Purpose: AI nutrition and meal plan generation.
- Model source: Gemini (gemini-2.5-flash).
- Input body:
```json
{
	"prompt": "High protein vegetarian meal plan for 2200 kcal"
}
```
- Response:
```json
{
	"reply": "{...json string...}"
}
```

### POST /api/gemini
- Purpose: AI workout-plan style generation through Gemini route.
- Input body:
```json
{
	"prompt": "Create a safe intermediate 5-day split"
}
```
- Response:
```json
{
	"reply": "{...json string...}"
}
```

### GET /api/nearby-gyms
- Purpose: fetch nearby gyms from OpenStreetMap Overpass.
- Query params:
	- lat: number
	- lon: number
	- radius: meters (optional, max 10000)
- Example:
```txt
/api/nearby-gyms?lat=28.6139&lon=77.2090&radius=5000
```

## Firestore Data Model

### users/{uid}
Core user profile and account metadata:
- firstName, lastName, email, phone
- membershipType
- role or isAdmin
- photoURL
- streak, lastStreakIncrement
- createdAt, lastLogin

Subcollections:
- users/{uid}/completedWorkouts
- users/{uid}/loggedMeals
- users/{uid}/bookedClasses
- users/{uid}/bodyMeasurements

### workouts/{workoutId}
- title, trainer, duration, difficulty, calories, createdAt

Nested steps:
- workouts/{workoutId}/details/{detailId}
- fields include order, name, sets, reps, rest, tip, move, gifUrl

### classes/{classId}
- title, trainer, time, startTime, duration
- type, intensity, capacity, enrolledCount, createdAt

### mealPlans/{planId}
- name, calories, protein, carbs, fats
- description, duration, createdAt
- optional meals array for detailed plans

## Security Rules Summary

From firestore.rules:
- workouts: public read, authenticated write
- classes: public read, authenticated write
- mealPlans: public read, admin-only create/update/delete
- users/{uid}: authenticated read, owner-limited update for specific safe fields
- users subcollections: owner read/write
- fallback: deny all else

Important: app-level admin checks exist in UI and helper functions, but rules are the final authority.

## Environment Variables

Create .env.local in the project root.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

GEMINI_API_KEY=
GITHUB_MODELS_TOKEN=
```

Notes:
- NEXT_PUBLIC_* variables are exposed to the client bundle by design.
- GEMINI_API_KEY and GITHUB_MODELS_TOKEN are server-side secrets used by API routes.

## Local Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Firebase
1. Create Firebase project.
2. Enable Authentication (Email/Password).
3. Create Firestore database.
4. Enable Storage.
5. Add web app config to .env.local.

### 3. Configure AI providers
1. Add GEMINI_API_KEY.
2. Add GITHUB_MODELS_TOKEN.

### 4. Run app
```bash
npm run dev
```

Open http://localhost:3000

## Running and Building

- Development: npm run dev
- Lint: npm run lint
- Production build: npm run build
- Start production server: npm run start

## Project Structure

High-level map:
- app/: routes, layouts, and API handlers
- components/: reusable UI and page screen components
- lib/firebase.ts: Firebase initialization
- lib/firestore/: Firestore data access layer
- lib/hooks/: app hooks
- lib/workoutQuality.ts: workout quality evaluator
- firestore.rules: Firestore access control

## Current Gaps and Notes

- Some UI sections display coming soon placeholders.
- Body measurement trend charts are currently static UI placeholders.
- Class booking increments are optimistic in UI; backend counters are not transaction-updated in current booking helper.
- AI output handling depends on model returning parseable JSON (guardrails are implemented but still external-service dependent).
- Nearby gyms depend on third-party Overpass endpoint availability; API returns warning with empty list if unavailable.

## License

No license file is currently present in this repository. Add LICENSE if you plan public distribution.
