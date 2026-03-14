'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PoseDetector from '@/components/PoseDetector';
import {
  getWorkoutById,
  getWorkoutDetails,
  Workout,
  WorkoutDetailStep,
} from '@/lib/firestore/Workouts';
import { evaluateWorkoutQuality } from '@/lib/workoutQuality';

type MoveType = 'jumping-jack' | 'squat' | 'pushup' | 'plank' | 'lunge' | 'burpee';

function toMoveType(value: string): MoveType {
  const normalized = value.toLowerCase();
  if (normalized === 'squat') return 'squat';
  if (normalized === 'pushup' || normalized === 'push-up') return 'pushup';
  if (normalized === 'plank') return 'plank';
  if (normalized === 'lunge') return 'lunge';
  if (normalized === 'burpee') return 'burpee';
  return 'jumping-jack';
}

function MovePreview({ move }: { move: MoveType }) {
  const animationClass =
    move === 'squat'
      ? 'animate-move-squat'
      : move === 'pushup'
        ? 'animate-move-pushup'
        : move === 'plank'
          ? 'animate-move-plank'
          : move === 'lunge'
            ? 'animate-move-lunge'
            : move === 'burpee'
              ? 'animate-move-burpee'
              : 'animate-move-jumping-jack';

  return (
    <div className="h-24 rounded-xl border border-gray-700 bg-gray-900/70 flex items-center justify-center overflow-hidden">
      <div className={`relative w-16 h-16 ${animationClass}`}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-400" />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1.5 h-7 rounded-full bg-white" />
        <div className="absolute top-6 left-1/2 -translate-x-[1.05rem] w-5 h-1.5 rounded-full bg-white" />
        <div className="absolute top-6 left-1/2 translate-x-[0.2rem] w-5 h-1.5 rounded-full bg-white" />
        <div className="absolute top-10 left-1/2 -translate-x-[0.9rem] w-1.5 h-6 rounded-full bg-white" />
        <div className="absolute top-10 left-1/2 translate-x-[0.2rem] w-1.5 h-6 rounded-full bg-white" />
      </div>
    </div>
  );
}

function parseRestSeconds(value: string | undefined): number {
  if (!value) {
    return 60;
  }

  const normalized = value.toLowerCase().trim();
  const minuteMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(m|min|minute|minutes)/);
  if (minuteMatch) {
    const minutes = Number(minuteMatch[1]);
    if (Number.isFinite(minutes) && minutes > 0) {
      return Math.max(1, Math.round(minutes * 60));
    }
  }

  const secondMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(s|sec|second|seconds)/);
  if (secondMatch) {
    const seconds = Number(secondMatch[1]);
    if (Number.isFinite(seconds) && seconds > 0) {
      return Math.max(1, Math.round(seconds));
    }
  }

  const fallback = normalized.match(/\d+/);
  if (!fallback) {
    return 60;
  }

  const numeric = Number(fallback[0]);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 60;
}

function formatClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export default function WorkoutDetailScreen({ workoutId }: { workoutId: string }) {
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [steps, setSteps] = useState<WorkoutDetailStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [cameraCoachEnabled, setCameraCoachEnabled] = useState(false);
  const [restSecondsLeft, setRestSecondsLeft] = useState<number | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    async function fetchWorkout() {
      try {
        setLoading(true);
        setError(null);
        const [found, detailSteps] = await Promise.all([
          getWorkoutById(workoutId),
          getWorkoutDetails(workoutId),
        ]);

        if (!found) {
          setError('Workout not found');
          return;
        }

        setWorkout(found as Workout);
        setSteps(detailSteps);
      } catch {
        setError('Unable to load workout details');
      } finally {
        setLoading(false);
      }
    }

    fetchWorkout();
  }, [workoutId]);

  const normalizedSteps = useMemo(
    () =>
      steps.map((step, index) => ({
        ...step,
        displayOrder: index + 1,
        moveType: toMoveType(step.move),
      })),
    [steps]
  );

  const [coachStepId, setCoachStepId] = useState<string>('auto-workout');

  useEffect(() => {
    if (normalizedSteps.length === 0) {
      setCoachStepId('auto-workout');
      return;
    }

    const repFirstStep = normalizedSteps.find((step) => /\d+/.test(step.reps));
    setCoachStepId(repFirstStep?.id ?? normalizedSteps[0].id);
  }, [normalizedSteps]);

  useEffect(() => {
    if (!workoutStarted) {
      setRestSecondsLeft(null);
      setSessionComplete(false);
    }
  }, [workoutStarted]);

  const selectedCoachStep = useMemo(() => {
    if (coachStepId === 'auto-workout') {
      return null;
    }

    return normalizedSteps.find((step) => step.id === coachStepId) ?? null;
  }, [coachStepId, normalizedSteps]);

  const coachExercise = useMemo(() => {
    if (selectedCoachStep) {
      const tokens = [selectedCoachStep.name, selectedCoachStep.move, selectedCoachStep.tip]
        .filter(Boolean)
        .join(' ')
        .trim();

      if (tokens) {
        return tokens;
      }
    }

    return `${workout?.title ?? 'General'} workout`;
  }, [selectedCoachStep, workout?.title]);

  const targetReps = useMemo(() => {
    if (!selectedCoachStep) {
      return undefined;
    }

    const match = selectedCoachStep.reps.match(/\d+/);
    if (!match) {
      return undefined;
    }

    const value = Number(match[0]);
    return Number.isFinite(value) ? value : undefined;
  }, [selectedCoachStep]);

  const advanceToNextStep = useCallback(() => {
    if (!selectedCoachStep) {
      return;
    }

    const currentIndex = normalizedSteps.findIndex((step) => step.id === selectedCoachStep.id);
    if (currentIndex < 0) {
      return;
    }

    const nextStep = normalizedSteps[currentIndex + 1];
    if (!nextStep) {
      setSessionComplete(true);
      setRestSecondsLeft(null);
      return;
    }

    setCoachStepId(nextStep.id);
    setRestSecondsLeft(null);
  }, [normalizedSteps, selectedCoachStep]);

  useEffect(() => {
    if (!workoutStarted || restSecondsLeft === null) {
      return;
    }

    if (restSecondsLeft <= 0) {
      advanceToNextStep();
      return;
    }

    const timeout = window.setTimeout(() => {
      setRestSecondsLeft((prev) => (prev === null ? null : Math.max(prev - 1, 0)));
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [advanceToNextStep, restSecondsLeft, workoutStarted]);

  const handleTargetReached = useCallback(() => {
    if (!selectedCoachStep || restSecondsLeft !== null) {
      return;
    }

    const currentIndex = normalizedSteps.findIndex((step) => step.id === selectedCoachStep.id);
    if (currentIndex < 0) {
      return;
    }

    if (!normalizedSteps[currentIndex + 1]) {
      setSessionComplete(true);
      return;
    }

    const restSeconds = parseRestSeconds(selectedCoachStep.rest);
    setRestSecondsLeft(restSeconds);
  }, [normalizedSteps, restSecondsLeft, selectedCoachStep]);

  const quality = useMemo(() => {
    if (!workout) {
      return null;
    }

    return evaluateWorkoutQuality(workout, steps);
  }, [steps, workout]);

  const qualityTone =
    quality?.label === 'Excellent'
      ? 'text-emerald-300 border-emerald-600/40 bg-emerald-950/20'
      : quality?.label === 'Good'
        ? 'text-green-300 border-green-600/40 bg-green-950/20'
        : quality?.label === 'Fair'
          ? 'text-yellow-300 border-yellow-600/40 bg-yellow-950/20'
          : 'text-orange-300 border-orange-600/40 bg-orange-950/20';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 animate-pulse">
        Loading workout details...
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <h1 className="text-2xl font-bold text-red-400">{error || 'Workout unavailable'}</h1>
        <Link href="/home/workouts" className="px-5 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg font-semibold">
          Back to Workouts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-700 hover:border-red-600 rounded-lg text-sm font-medium transition-colors"
        >
          Back
        </button>
        <Link href="/home/workouts" className="px-4 py-2 border border-gray-700 hover:border-red-600 rounded-lg text-sm font-medium transition-colors">
          All Workouts
        </Link>
      </div>

      <header className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 md:p-8">
        <h1 className="text-4xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>
          {workout.title}
        </h1>
        <p className="text-gray-400 mt-2">Trainer: {workout.trainer || 'Unknown'}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-black/50 rounded-xl p-4 text-center">
            <div className="text-xs text-gray-500 uppercase">Duration</div>
            <div className="text-lg font-bold text-red-400 mt-1">{workout.duration}</div>
          </div>
          <div className="bg-black/50 rounded-xl p-4 text-center">
            <div className="text-xs text-gray-500 uppercase">Difficulty</div>
            <div className="text-lg font-bold text-red-400 mt-1">{workout.difficulty}</div>
          </div>
          <div className="bg-black/50 rounded-xl p-4 text-center">
            <div className="text-xs text-gray-500 uppercase">Calories</div>
            <div className="text-lg font-bold text-red-400 mt-1">{workout.calories} kcal</div>
          </div>
          <div className="bg-black/50 rounded-xl p-4 text-center">
            <div className="text-xs text-gray-500 uppercase">Exercises</div>
            <div className="text-lg font-bold text-red-400 mt-1">{normalizedSteps.length}</div>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 md:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>
            WORKOUT <span className="text-red-500">SESSION</span>
          </h2>
          {!workoutStarted ? (
            <button
              onClick={() => {
                setWorkoutStarted(true);
                setCameraCoachEnabled(true);
              }}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition-colors"
            >
              Start Workout
            </button>
          ) : (
            <button
              onClick={() => setWorkoutStarted(false)}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-colors"
            >
              End Session
            </button>
          )}
        </div>

        {!workoutStarted ? (
          <p className="text-sm text-gray-400">
            Start session to enable camera rep counting and posture feedback.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="coachExercise" className="text-sm text-gray-300">
                Track step:
              </label>
              <select
                id="coachExercise"
                value={coachStepId}
                onChange={(event) => {
                  setCoachStepId(event.target.value);
                  setRestSecondsLeft(null);
                  setSessionComplete(false);
                }}
                disabled={restSecondsLeft !== null}
                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
              >
                <option value="auto-workout">Auto from workout title</option>
                {normalizedSteps.map((step) => (
                  <option key={step.id} value={step.id}>
                    {step.displayOrder}. {step.name} ({step.reps})
                  </option>
                ))}
              </select>

              <button
                onClick={() => setCameraCoachEnabled((prev) => !prev)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                {cameraCoachEnabled ? 'Hide Camera Coach' : 'Show Camera Coach'}
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Camera coach now auto-maps AI/backend exercise names to the best free pose model strategy.
            </p>

            {restSecondsLeft !== null && (
              <div className="rounded-xl border border-yellow-600/40 bg-yellow-950/20 px-4 py-3 text-yellow-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Rest time</p>
                  <p className="text-xs text-yellow-300/80">Next exercise starts automatically.</p>
                </div>
                <p className="text-2xl font-bold tabular-nums">{formatClock(restSecondsLeft)}</p>
              </div>
            )}

            {sessionComplete && (
              <div className="rounded-xl border border-emerald-600/40 bg-emerald-950/20 px-4 py-3 text-emerald-200">
                <p className="text-sm font-semibold">Workout track complete</p>
                <p className="text-xs text-emerald-300/80">You finished all tracked exercises in this session.</p>
              </div>
            )}

            {cameraCoachEnabled && restSecondsLeft === null && !sessionComplete && (
              <PoseDetector
                key={selectedCoachStep?.id ?? coachStepId}
                exercise={coachExercise}
                targetReps={targetReps}
                onTargetReached={handleTargetReached}
              />
            )}
          </>
        )}
      </section>

      {quality && (
        <section className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>
              WORKOUT <span className="text-red-500">QUALITY</span>
            </h2>
            <div className={`px-3 py-1.5 rounded-full border text-sm font-semibold ${qualityTone}`}>
              {quality.label} · {quality.score}/100
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="rounded-lg border border-gray-800 bg-black/40 px-3 py-2">
              Warm-up: <span className={quality.checks.hasWarmup ? 'text-green-400' : 'text-red-400'}>{quality.checks.hasWarmup ? 'Yes' : 'No'}</span>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black/40 px-3 py-2">
              Cooldown: <span className={quality.checks.hasCooldown ? 'text-green-400' : 'text-red-400'}>{quality.checks.hasCooldown ? 'Yes' : 'No'}</span>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black/40 px-3 py-2">
              Rest cues: <span className={quality.checks.hasRestGuidance ? 'text-green-400' : 'text-red-400'}>{quality.checks.hasRestGuidance ? 'Yes' : 'No'}</span>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black/40 px-3 py-2">
              Variety: <span className="text-red-300">{quality.checks.movementVariety} groups</span>
            </div>
          </div>

          {quality.recommendations.length > 0 ? (
            <div className="rounded-xl border border-gray-800 bg-black/40 p-4 space-y-2">
              <p className="text-sm font-semibold text-gray-200">Coach Suggestions</p>
              <ul className="text-sm text-gray-400 list-disc pl-5 space-y-1">
                {quality.recommendations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-green-300">This plan looks well-balanced and session-ready.</p>
          )}
        </section>
      )}

      <section>
        <h2 className="text-3xl font-bold mb-5" style={{ fontFamily: 'Oswald, sans-serif' }}>
          WORKOUT <span className="text-red-500">MOVES</span>
        </h2>
        <p className="text-gray-400 mb-6">
          Follow these steps in order. The animated cards mimic a GIF-style movement preview for each exercise.
        </p>

        {normalizedSteps.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 text-center space-y-2">
            <p className="text-lg font-semibold">No detailed steps added yet.</p>
            <p className="text-gray-400 text-sm">
              Add docs in Firestore subcollection: <span className="text-red-400">workouts/{workoutId}/details</span>
            </p>
            <p className="text-gray-500 text-xs">
              Fields: order, name, sets, reps, rest, tip, move, gifUrl(optional)
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {normalizedSteps.map((step) => (
              <article key={step.id} className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold">{step.displayOrder}. {step.name}</h3>
                  <span className="text-xs uppercase tracking-wide bg-red-500/20 text-red-300 px-2.5 py-1 rounded-full">
                    Set {step.sets}
                  </span>
                </div>

                {step.gifUrl ? (
                  <div className="h-24 w-full rounded-xl border border-gray-700 overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={step.gifUrl}
                      alt={`${step.name} movement`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <MovePreview move={step.moveType} />
                )}

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-black/50 rounded-lg py-2">
                    <div className="text-xs text-gray-500 uppercase">Sets</div>
                    <div className="font-semibold text-red-400">{step.sets}</div>
                  </div>
                  <div className="bg-black/50 rounded-lg py-2">
                    <div className="text-xs text-gray-500 uppercase">Reps</div>
                    <div className="font-semibold text-red-400">{step.reps}</div>
                  </div>
                  <div className="bg-black/50 rounded-lg py-2">
                    <div className="text-xs text-gray-500 uppercase">Rest</div>
                    <div className="font-semibold text-red-400">{step.rest}</div>
                  </div>
                </div>

                <p className="text-sm text-gray-400">Tip: {step.tip || 'Maintain proper form and steady breathing.'}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
