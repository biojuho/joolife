"use client";

import { useState, useCallback, useEffect } from "react";
import { useCheckStore } from "@/stores/useCheckStore";
import { CHECK_CATEGORIES } from "@/lib/constants";
import { calculateTotalScore } from "@/lib/score";
import { Progress } from "@/components/ui/progress";
import CheckCard from "@/components/check/CheckCard";
import ScoreAnimation from "@/components/check/ScoreAnimation";
import CheckComplete from "@/components/check/CheckComplete";
import { saveCheck } from "./actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { CheckCategory } from "@/types";

type Phase = "check" | "calculating" | "complete" | "already_done";

export default function CheckPage() {
  const { scores, currentStep, setScore, setCurrentStep, reset } =
    useCheckStore();
  const [phase, setPhase] = useState<Phase>("check");
  const [totalScore, setTotalScore] = useState(0);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydration guard for Zustand persist
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelect = useCallback(
    async (value: number) => {
      const category = CHECK_CATEGORIES[currentStep];
      setScore(category.id as CheckCategory, value);

      if (currentStep < CHECK_CATEGORIES.length - 1) {
        // Auto-advance to next card after brief delay
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
        }, 300);
      } else {
        // Last item — calculate score and show animation
        const allScores = { ...scores, [category.id]: value };
        const scoreValues = [
          allScores.sleep,
          allScores.exercise,
          allScores.diet,
          allScores.stress,
          allScores.social,
        ];
        const computed = calculateTotalScore(scoreValues);
        setTotalScore(computed);
        setPhase("calculating");

        // Try to save to Supabase (will fail gracefully if not logged in)
        setSaving(true);
        try {
          const result = await saveCheck({
            sleep_score: allScores.sleep,
            exercise_score: allScores.exercise,
            diet_score: allScores.diet,
            stress_score: allScores.stress,
            social_score: allScores.social,
          });
          if (result.error === "already_checked") {
            setPhase("already_done");
            return;
          }
        } catch {
          // Save failed (likely not logged in) — still show score
        } finally {
          setSaving(false);
        }
      }
    },
    [currentStep, scores, setScore, setCurrentStep]
  );

  const handleAnimationComplete = useCallback(() => {
    setPhase("complete");
  }, []);

  const handleRetry = useCallback(() => {
    reset();
    setPhase("check");
    setTotalScore(0);
  }, [reset]);

  // Don't render until hydrated
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Already checked today
  if (phase === "already_done") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 gap-6">
        <div className="text-center space-y-4">
          <p className="text-5xl">😊</p>
          <h1 className="text-2xl font-bold">오늘은 이미 체크했어요!</h1>
          <p className="text-muted-foreground">내일 다시 만나요</p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <Button asChild size="lg" className="w-full">
            <Link href="/dashboard">대시보드 보기</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/">홈으로</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Score animation phase
  if (phase === "calculating") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ScoreAnimation
          targetScore={totalScore}
          onComplete={handleAnimationComplete}
        />
      </div>
    );
  }

  // Result phase
  if (phase === "complete") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CheckComplete score={totalScore} scores={scores} />
      </div>
    );
  }

  // Main check phase
  const progress = ((currentStep + 1) / CHECK_CATEGORIES.length) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3">
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                if (currentStep > 0) setCurrentStep(currentStep - 1);
              }}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              disabled={currentStep === 0}
            >
              {currentStep > 0 ? "← 이전" : ""}
            </button>
            <span className="text-sm text-muted-foreground">
              {currentStep + 1} / {CHECK_CATEGORIES.length}
            </span>
            <button
              onClick={handleRetry}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              초기화
            </button>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </header>

      {/* Cards */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md relative">
          {CHECK_CATEGORIES.map((cat, index) => (
            <CheckCard
              key={cat.id}
              emoji={cat.emoji}
              label={cat.label}
              question={cat.question}
              selectedValue={scores[cat.id as keyof typeof scores]}
              onSelect={handleSelect}
              isActive={index === currentStep}
            />
          ))}
        </div>
      </main>

      {/* Footer hint */}
      <footer className="pb-8 text-center">
        <p className="text-xs text-muted-foreground/50">
          {saving ? "저장 중..." : "점수를 선택하면 자동으로 다음으로 넘어갑니다"}
        </p>
      </footer>
    </div>
  );
}
