"use client";

import { create } from "zustand";
import type { Profile } from "@/lib/types";

interface UserState {
  profile: Profile | null;
  isLoading: boolean;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  updateProfile: (updates: Partial<Profile>) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  isLoading: true,

  setProfile: (profile) => set({ profile, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),

  updateProfile: (updates) => {
    const current = get().profile;
    if (current) {
      set({ profile: { ...current, ...updates } });
    }
  },
}));
