import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProfile } from "./actions";
import ProfileForm from "@/components/settings/ProfileForm";

export default async function SettingsPage() {
  const { loggedIn, profile, email } = await getProfile();

  if (!loggedIn) {
    redirect("/login?next=/settings");
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <h1 className="text-lg font-bold">⚙️ 설정</h1>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">대시보드</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Profile Form */}
        <ProfileForm
          nickname={profile?.nickname ?? null}
          birthYear={profile?.birth_year ?? null}
          gender={profile?.gender ?? null}
          email={email}
        />

        {/* Premium section */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span>✨</span> 프리미엄
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { emoji: "📊", text: "30일 이상 트렌드 분석" },
                { emoji: "🏆", text: "전체 유저 퍼센타일 비교" },
                { emoji: "🤖", text: "AI 맞춤 건강 조언" },
                { emoji: "🎨", text: "프리미엄 공유 카드 디자인" },
                { emoji: "📤", text: "데이터 내보내기 (CSV)" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <span className="text-sm">{item.emoji}</span>
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
            <Button asChild className="w-full" variant="outline">
              <Link href="/premium">프리미엄 알아보기</Link>
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">앱 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">버전</span>
              <span>0.1.0 (Beta)</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">개발</span>
              <span>JooLife</span>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <form action="/auth/logout" method="POST">
          <Button
            type="submit"
            variant="outline"
            className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            로그아웃
          </Button>
        </form>
      </main>
    </div>
  );
}
