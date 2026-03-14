import type { Workout, WorkoutDetailStep } from '@/lib/firestore/Workouts';

export type WorkoutQuality = {
  score: number;
  label: 'Excellent' | 'Good' | 'Fair' | 'Needs Work';
  checks: {
    hasWarmup: boolean;
    hasCooldown: boolean;
    hasRestGuidance: boolean;
    exerciseCount: number;
    movementVariety: number;
  };
  recommendations: string[];
};

function toText(step: WorkoutDetailStep): string {
  return `${step.name} ${step.move} ${step.tip}`.toLowerCase();
}

function parseNumeric(value: string): number | null {
  const match = value.match(/\d+/);
  if (!match) return null;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

function detectMovementBucket(text: string): 'upper' | 'lower' | 'core' | 'cardio' | 'other' {
  if (/(push|pull|row|press|curl|dip|tricep|shoulder|chest)/.test(text)) return 'upper';
  if (/(squat|lunge|deadlift|leg|calf|glute|hip thrust|step-up|step up)/.test(text)) return 'lower';
  if (/(plank|crunch|core|sit-up|sit up|twist|hollow|v-up|leg raise)/.test(text)) return 'core';
  if (/(jump|burpee|jack|high knees|mountain climber|cardio|run)/.test(text)) return 'cardio';
  return 'other';
}

export function evaluateWorkoutQuality(
  workout: Pick<Workout, 'difficulty' | 'duration'>,
  steps: WorkoutDetailStep[]
): WorkoutQuality {
  let score = 100;
  const recommendations: string[] = [];

  const stepTexts = steps.map(toText);
  const hasWarmup = stepTexts.some((text) => /(warm ?up|mobility|activation|dynamic stretch)/.test(text));
  const hasCooldown = stepTexts.some((text) => /(cool ?down|stretch|breath|recovery)/.test(text));
  const hasRestGuidance = steps.some((step) => /\d+/.test(step.rest));

  if (steps.length < 4) {
    score -= 16;
    recommendations.push('Add at least 4 exercises for a complete session.');
  }

  if (!hasWarmup) {
    score -= 14;
    recommendations.push('Add a warm-up movement to reduce injury risk.');
  }

  if (!hasCooldown) {
    score -= 10;
    recommendations.push('Include a cooldown or stretch step at the end.');
  }

  if (!hasRestGuidance) {
    score -= 10;
    recommendations.push('Add rest timings to improve pacing and consistency.');
  }

  const buckets = new Set(stepTexts.map(detectMovementBucket).filter((bucket) => bucket !== 'other'));
  if (buckets.size <= 1 && steps.length >= 4) {
    score -= 12;
    recommendations.push('Mix movement patterns (upper, lower, core, cardio) for better balance.');
  }

  let totalVolume = 0;
  for (const step of steps) {
    const sets = parseNumeric(step.sets) ?? 1;
    const reps = parseNumeric(step.reps) ?? 0;
    totalVolume += sets * reps;
  }

  if (totalVolume > 320) {
    score -= 14;
    recommendations.push('Session volume looks high. Consider reducing sets or reps.');
  }

  if (workout.difficulty === 'Beginner' && totalVolume > 220) {
    score -= 10;
    recommendations.push('Beginner plan volume is heavy. Scale down intensity.');
  }

  const durationNumber = parseNumeric(workout.duration);
  if (durationNumber && durationNumber < 15 && steps.length >= 6) {
    score -= 8;
    recommendations.push('Duration may be too short for number of exercises.');
  }

  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const label: WorkoutQuality['label'] =
    clamped >= 85 ? 'Excellent' : clamped >= 70 ? 'Good' : clamped >= 55 ? 'Fair' : 'Needs Work';

  return {
    score: clamped,
    label,
    checks: {
      hasWarmup,
      hasCooldown,
      hasRestGuidance,
      exerciseCount: steps.length,
      movementVariety: buckets.size,
    },
    recommendations,
  };
}
