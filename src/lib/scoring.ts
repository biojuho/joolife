import type { DailyChecklist, ScoreBreakdown } from "./types";
import { MAX_SCORES } from "./constants";

type ChecklistData = Partial<DailyChecklist>;

/**
 * Calculate diet score (max 35pts)
 */
function calculateDietScore(data: ChecklistData): number {
  let score = 0;
  if (data.meal_vegetables) score += 5;
  if (data.meal_protein) score += 5;
  if (data.meal_whole_grain) score += 4;
  if (data.meal_fermented) score += 4;
  if (data.meal_antioxidant) score += 4;

  // Water: 5pts for >= 1.5L, proportional below
  const water = data.meal_water_liters || 0;
  score += Math.min(Math.round((water / 1.5) * 5), 5);

  if (data.meal_processed_food) score += 4;
  if (data.meal_sugar_avoided) score += 4;

  return Math.min(score, MAX_SCORES.diet);
}

/**
 * Calculate exercise score (max 25pts)
 */
function calculateExerciseScore(data: ChecklistData): number {
  let score = 0;

  if (data.exercise_done) {
    score += 10;

    // Duration bonus: up to 8pts (30min = full points)
    const duration = data.exercise_duration_min || 0;
    score += Math.min(Math.round((duration / 30) * 8), 8);
  }

  // Steps: up to 7pts (7000 steps = full points)
  const steps = data.exercise_steps || 0;
  score += Math.min(Math.round((steps / 7000) * 7), 7);

  return Math.min(score, MAX_SCORES.exercise);
}

/**
 * Calculate sleep score (max 25pts)
 */
function calculateSleepScore(data: ChecklistData): number {
  let score = 0;

  // Sleep hours: 10pts for 7-8 hours, less for other durations
  const hours = data.sleep_hours || 0;
  if (hours >= 7 && hours <= 8) {
    score += 10;
  } else if (hours >= 6 && hours < 7) {
    score += 7;
  } else if (hours > 8 && hours <= 9) {
    score += 8;
  } else if (hours >= 5) {
    score += 4;
  } else if (hours > 0) {
    score += 2;
  }

  // Sleep quality: up to 10pts (quality is 1-5)
  const quality = data.sleep_quality || 0;
  score += quality * 2;

  // Screen off before bed: 5pts
  if (data.sleep_before_screen) score += 5;

  return Math.min(score, MAX_SCORES.sleep);
}

/**
 * Calculate lifestyle score (max 15pts)
 */
function calculateLifestyleScore(data: ChecklistData): number {
  let score = 0;
  if (data.lifestyle_sunscreen) score += 5;

  // Supplements: 5pts if any taken
  if (
    data.lifestyle_supplements &&
    data.lifestyle_supplements.length > 0
  ) {
    score += 5;
  }

  // Meditation: up to 5pts (10min = full points)
  const meditation = data.lifestyle_meditation_min || 0;
  score += Math.min(Math.round((meditation / 10) * 5), 5);

  return Math.min(score, MAX_SCORES.lifestyle);
}

/**
 * Calculate all scores
 */
export function calculateScores(data: ChecklistData): ScoreBreakdown {
  const diet_score = calculateDietScore(data);
  const exercise_score = calculateExerciseScore(data);
  const sleep_score = calculateSleepScore(data);
  const lifestyle_score = calculateLifestyleScore(data);
  const total_score = diet_score + exercise_score + sleep_score + lifestyle_score;

  return {
    diet_score,
    exercise_score,
    sleep_score,
    lifestyle_score,
    total_score,
  };
}

/**
 * Get score level label
 */
export function getScoreLevel(score: number) {
  if (score >= 85) return { level: "excellent", label: "훌륭해요!", color: "text-success" };
  if (score >= 65) return { level: "good", label: "잘하고 있어요!", color: "text-primary" };
  if (score >= 40) return { level: "fair", label: "조금 더 노력해봐요", color: "text-accent" };
  return { level: "poor", label: "오늘부터 시작해요", color: "text-text-light" };
}

/**
 * Get score color for circular progress
 */
export function getScoreColor(score: number): string {
  if (score >= 85) return "#00B894";
  if (score >= 65) return "#4A7C59";
  if (score >= 40) return "#F4A261";
  return "#E17055";
}
