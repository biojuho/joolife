import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function sanitizeRedirect(redirect: string | null): string {
  if (!redirect) return "/dashboard";
  // 내부 경로만 허용: /로 시작하고 //는 불허
  if (redirect.startsWith("/") && !redirect.startsWith("//")) {
    return redirect;
  }
  return "/dashboard";
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = sanitizeRedirect(searchParams.get("redirect"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${redirect}`);
    }
  }

  // Auth error - redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
