"use server";

import { createClient } from "@/lib/supabase/server";

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  interests: string[];
  onboarding_completed: boolean;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: "ko" | "en";
  notification_settings: {
    email: boolean;
    push: boolean;
  };
  ai_settings: {
    enabled: boolean;
    daily_insight: boolean;
  };
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data as Profile | null;
}

export async function updateProfile(input: {
  display_name?: string;
  bio?: string;
  interests?: string[];
}): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("profiles").update(input).eq("id", user.id);

  await supabase.from("activity_logs").insert({
    user_id: user.id,
    action: "update_profile",
    entity_type: "profile",
  });
}

export async function getUserPreferences(): Promise<UserPreferences | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!data) return null;

  return {
    theme: data.theme || "light",
    language: data.language || "ko",
    notification_settings: data.notification_settings as {
      email: boolean;
      push: boolean;
    } || { email: true, push: false },
    ai_settings: data.ai_settings as {
      enabled: boolean;
      daily_insight: boolean;
    } || { enabled: true, daily_insight: true },
  };
}

export async function updateUserPreferences(
  input: Partial<{
    theme: string;
    language: string;
    notification_settings: Record<string, boolean>;
    ai_settings: Record<string, boolean>;
  }>
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from("user_preferences")
    .update(input)
    .eq("user_id", user.id);
}

export async function getUserEmail(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.email || null;
}

export async function deleteAccount(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  // 활동 로그 기록 (삭제 전)
  await supabase.from("activity_logs").insert({
    user_id: user.id,
    action: "delete_account",
    entity_type: "user",
  });

  // Supabase에서 사용자 삭제는 서버 사이드에서 admin API 필요
  // 여기서는 프로필만 비활성화
  await supabase
    .from("profiles")
    .update({ display_name: "[삭제된 계정]", bio: null, interests: [] })
    .eq("id", user.id);
}
