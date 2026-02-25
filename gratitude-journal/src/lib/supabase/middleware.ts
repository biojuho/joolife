import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const publicPaths = ["/", "/login", "/auth/callback"];
  const isPublicPath = publicPaths.some(
    (path) => request.nextUrl.pathname === path
  );

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && request.nextUrl.pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/journal";
    return NextResponse.redirect(url);
  }

  // 온보딩 완료 여부 체크 (인증된 사용자, 온보딩 페이지가 아닌 경우)
  if (user && !isPublicPath && request.nextUrl.pathname !== "/onboarding") {
    const onboardingCookie = request.cookies.get("onboarding_complete");
    if (!onboardingCookie) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("nickname")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile?.nickname) {
        const url = request.nextUrl.clone();
        url.pathname = "/onboarding";
        return NextResponse.redirect(url);
      }
      // 온보딩 완료 확인됨 — 쿠키 설정으로 이후 요청에서 DB 조회 스킵
      supabaseResponse.cookies.set("onboarding_complete", "1", {
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1년
        httpOnly: true,
        sameSite: "lax",
      });
    }
  }

  return supabaseResponse;
}
