"use client";

import { create } from "zustand";
import type { CoachingMessage } from "@/lib/types";

interface CoachingState {
  todayMessage: CoachingMessage | null;
  isGenerating: boolean;
  error: string | null;

  setMessage: (message: CoachingMessage | null) => void;
  setGenerating: (generating: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCoachingStore = create<CoachingState>((set) => ({
  todayMessage: null,
  isGenerating: false,
  error: null,

  setMessage: (message) => set({ todayMessage: message, isGenerating: false, error: null }),
  setGenerating: (generating) => set({ isGenerating: generating, error: null }),
  setError: (error) => set({ error, isGenerating: false }),
}));
