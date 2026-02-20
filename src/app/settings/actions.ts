"use server";

import { createClient } from "@/lib/supabase/server";

export async function getProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { loggedIn: false, profile: null, email: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return {
    loggedIn: true,
    profile,
    email: user.email ?? null,
  };
}

export async function updateProfile(input: {
  nickname: string;
  birth_year: number | null;
  gender: string | null;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  if (!input.nickname || input.nickname.trim().length < 2) {
    return { success: false, error: "닉네임은 2자 이상이어야 합니다." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      nickname: input.nickname.trim(),
      birth_year: input.birth_year,
      gender: input.gender,
    })
    .eq("id", user.id);

  if (error) {
    return { success: false, error: "프로필 저장에 실패했습니다." };
  }

  return { success: true };
}
