import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            SlowAge
          </h1>
          <p className="text-lg text-muted-foreground">
            슬로에이지 — 매일의 슬로에이징 점수
          </p>
        </div>

        <p className="text-muted-foreground/80 text-sm leading-relaxed">
          하루 30초, 5가지 건강 체크로
          <br />
          나만의 슬로에이징 점수를 확인하세요.
        </p>

        <div className="flex flex-col gap-3">
          <Button asChild size="lg" className="w-full">
            <Link href="/check">오늘의 체크 시작</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/dashboard">대시보드</Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground/40">
          프로젝트 셋업 완료 — Step 1 Done
        </p>
      </div>
    </main>
  );
}
