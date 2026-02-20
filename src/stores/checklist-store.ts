"use client";

import { create } from "zustand";
import { calculateScores } from "@/lib/scoring";
import type { DailyChecklist, ScoreBreakdown } from "@/lib/types";

interface ChecklistState {
  // Boolean toggle items
  booleans: Record<string, boolean>;

  // Number values
  meal_water_liters: number;
  exercise_duration_min: number;
  exercise_steps: number;
  exercise_type: string;
  exercise_intensity: "low" | "medium" | "high" | "";
  sleep_hours: number;
  sleep_quality: number;
  lifestyle_supplements: string[];
  lifestyle_stress_level: number;
  lifestyle_meditation_min: number;

  // Condition
  overall_energy: number;
  overall_mood: number;
  overall_skin_condition: number;
  meal_note: string;

  // Computed scores
  scores: ScoreBreakdown;

  // State flags
  isDirty: boolean;
  isSaving: boolean;
  checkDate: string;

  // Actions
  toggleBoolean: (key: string) => void;
  setNumber: (key: string, value: number) => void;
  setString: (key: string, value: string) => void;
  setSupplements: (supplements: string[]) => void;
  loadFromDB: (data: Partial<DailyChecklist>) => void;
  setCheckDate: (date: string) => void;
  setSaving: (saving: boolean) => void;
  markClean: () => void;
  getChecklistData: () => Partial<DailyChecklist>;
}

function recalcScores(state: Partial<ChecklistState>): ScoreBreakdown {
  return calculateScores({
    meal_vegetables: state.booleans?.meal_vegetables ?? false,
    meal_protein: state.booleans?.meal_protein ?? false,
    meal_whole_grain: state.booleans?.meal_whole_grain ?? false,
    meal_fermented: state.booleans?.meal_fermented ?? false,
    meal_antioxidant: state.booleans?.meal_antioxidant ?? false,
    meal_water_liters: state.meal_water_liters ?? 0,
    meal_processed_food: state.booleans?.meal_processed_food ?? false,
    meal_sugar_avoided: state.booleans?.meal_sugar_avoided ?? false,
    exercise_done: state.booleans?.exercise_done ?? false,
    exercise_duration_min: state.exercise_duration_min ?? 0,
    exercise_steps: state.exercise_steps ?? 0,
    sleep_hours: state.sleep_hours ?? 0,
    sleep_quality: state.sleep_quality ?? 3,
    sleep_before_screen: state.booleans?.sleep_before_screen ?? false,
    lifestyle_sunscreen: state.booleans?.lifestyle_sunscreen ?? false,
    lifestyle_supplements: state.lifestyle_supplements ?? [],
    lifestyle_meditation_min: state.lifestyle_meditation_min ?? 0,
  } as Partial<DailyChecklist>);
}

export const useChecklistStore = create<ChecklistState>((set, get) => ({
  booleans: {},
  meal_water_liters: 0,
  exercise_duration_min: 0,
  exercise_steps: 0,
  exercise_type: "",
  exercise_intensity: "",
  sleep_hours: 7,
  sleep_quality: 3,
  lifestyle_supplements: [],
  lifestyle_stress_level: 3,
  lifestyle_meditation_min: 0,
  overall_energy: 3,
  overall_mood: 3,
  overall_skin_condition: 3,
  meal_note: "",
  scores: { diet_score: 0, exercise_score: 0, sleep_score: 0, lifestyle_score: 0, total_score: 0 },
  isDirty: false,
  isSaving: false,
  checkDate: new Date().toISOString().split("T")[0],

  toggleBoolean: (key) => {
    const booleans = { ...get().booleans, [key]: !get().booleans[key] };
    const scores = recalcScores({ ...get(), booleans });
    set({ booleans, scores, isDirty: true });
  },

  setNumber: (key, value) => {
    set({ [key]: value, isDirty: true } as Partial<ChecklistState>);
    const scores = recalcScores({ ...get(), [key]: value });
    set({ scores });
  },

  setString: (key, value) => {
    set({ [key]: value, isDirty: true } as Partial<ChecklistState>);
  },

  setSupplements: (supplements) => {
    set({ lifestyle_supplements: supplements, isDirty: true });
    const scores = recalcScores({ ...get(), lifestyle_supplements: supplements });
    set({ scores });
  },

  loadFromDB: (data) => {
    const booleans: Record<string, boolean> = {};
    const booleanKeys = [
      "meal_vegetables", "meal_protein", "meal_whole_grain", "meal_fermented",
      "meal_antioxidant", "meal_processed_food", "meal_sugar_avoided",
      "exercise_done", "sleep_before_screen", "lifestyle_sunscreen",
    ];
    booleanKeys.forEach((key) => {
      booleans[key] = !!(data as Record<string, unknown>)[key];
    });

    const newState = {
      booleans,
      meal_water_liters: data.meal_water_liters ?? 0,
      exercise_duration_min: data.exercise_duration_min ?? 0,
      exercise_steps: data.exercise_steps ?? 0,
      exercise_type: data.exercise_type ?? "",
      exercise_intensity: (data.exercise_intensity ?? "") as "low" | "medium" | "high" | "",
      sleep_hours: data.sleep_hours ?? 7,
      sleep_quality: data.sleep_quality ?? 3,
      lifestyle_supplements: data.lifestyle_supplements ?? [],
      lifestyle_stress_level: data.lifestyle_stress_level ?? 3,
      lifestyle_meditation_min: data.lifestyle_meditation_min ?? 0,
      overall_energy: data.overall_energy ?? 3,
      overall_mood: data.overall_mood ?? 3,
      overall_skin_condition: data.overall_skin_condition ?? 3,
      meal_note: data.meal_note ?? "",
      isDirty: false,
    };

    const scores = recalcScores(newState);
    set({ ...newState, scores });
  },

  setCheckDate: (date) => set({ checkDate: date }),
  setSaving: (saving) => set({ isSaving: saving }),
  markClean: () => set({ isDirty: false }),

  getChecklistData: () => {
    const state = get();
    return {
      check_date: state.checkDate,
      ...state.booleans,
      meal_water_liters: state.meal_water_liters,
      exercise_duration_min: state.exercise_duration_min,
      exercise_steps: state.exercise_steps,
      exercise_type: state.exercise_type || undefined,
      exercise_intensity: state.exercise_intensity || undefined,
      sleep_hours: state.sleep_hours,
      sleep_quality: state.sleep_quality,
      lifestyle_supplements: state.lifestyle_supplements,
      lifestyle_stress_level: state.lifestyle_stress_level,
      lifestyle_meditation_min: state.lifestyle_meditation_min,
      overall_energy: state.overall_energy,
      overall_mood: state.overall_mood,
      overall_skin_condition: state.overall_skin_condition,
      meal_note: state.meal_note || undefined,
      daily_score: state.scores.total_score,
    } as Partial<DailyChecklist>;
  },
}));
