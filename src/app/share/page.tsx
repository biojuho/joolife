import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getShareData } from "./actions";
import ShareActions from "@/components/share/ShareActions";

export default async function SharePage() {
  const { loggedIn, today, nickname } = await getShareData();

  // No data to share
  if (!today) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm">
          <p className="text-5xl">📱</p>
          <h1 className="text-2xl font-bold">공유할 점수가 없어요</h1>
          <p className="text-muted-foreground text-sm">
            {!loggedIn
              ? "로그인 후 오늘의 체크를 완료하면 SNS 공유 카드를 만들 수 있어요."
              : "오늘의 체크를 먼저 완료해주세요!"}
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Button asChild>
              <Link href="/check">오늘의 체크하기</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">홈으로</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <h1 className="text-lg font-bold">📱 공유하기</h1>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">대시보드</Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-8">
        <ShareActions
          score={today.total_score}
          scores={{
            sleep: today.sleep_score,
            exercise: today.exercise_score,
            diet: today.diet_score,
            stress: today.stress_score,
            social: today.social_score,
          }}
          date={today.check_date}
          nickname={nickname}
        />
      </main>
    </div>
  );
}
