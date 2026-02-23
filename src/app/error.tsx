"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center space-y-4 max-w-sm">
        <p className="text-5xl">😵</p>
        <h1 className="text-2xl font-bold">문제가 발생했어요</h1>
        <p className="text-sm text-muted-foreground">
          {error.message || "알 수 없는 오류가 발생했습니다."}
        </p>
        <div className="flex flex-col gap-2 pt-2">
          <Button onClick={reset}>다시 시도</Button>
          <Button variant="outline" asChild>
            <a href="/">홈으로</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
