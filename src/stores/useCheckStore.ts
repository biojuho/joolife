"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CheckCategory } from "@/types";

interface CheckScores {
  sleep: number;
  exercise: number;
  diet: number;
  stress: number;
  social: number;
}

interface CheckState {
  scores: CheckScores;
  currentStep: number;
  setScore: (category: CheckCategory, value: number) => void;
  setCurrentStep: (step: number) => void;
  reset: () => void;
}

const initialScores: CheckScores = {
  sleep: 0,
  exercise: 0,
  diet: 0,
  stress: 0,
  social: 0,
};

export const useCheckStore = create<CheckState>()(
  persist(
    (set) => ({
      scores: { ...initialScores },
      currentStep: 0,
      setScore: (category, value) =>
        set((state) => ({
          scores: { ...state.scores, [category]: value },
        })),
      setCurrentStep: (step) => set({ currentStep: step }),
      reset: () => set({ scores: { ...initialScores }, currentStep: 0 }),
    }),
    {
      name: "slowage-check",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
    }
  )
);
