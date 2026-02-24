"use client";

import Link from "next/link";
import { useCoachingStore } from "@/stores/coaching-store";
import type { CoachingMessage } from "@/lib/types";

// ---------------------
// Coaching card section
// ---------------------

interface CoachingCardProps {
  icon: string;
  title: string;
  content: string;
  accentColor?: string;
}

function CoachingCard({
  icon,
  title,
  content,
  accentColor = "bg-cream",
}: CoachingCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-cream-darker p-5">
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`w-8 h-8 rounded-full ${accentColor} flex items-center justify-center text-sm`}
        >
          {icon}
        </span>
        <h3 className="font-semibold text-text text-sm">{title}</h3>
      </div>
      <p className="text-text-light text-sm leading-relaxed">{content}</p>
    </div>
  );
}

// ---------------------
// Loading skeleton
// ---------------------

function CoachingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-cream-darker p-5 animate-pulse"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-cream" />
            <div className="h-4 w-20 bg-cream rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-cream rounded w-full" />
            <div className="h-3 bg-cream rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------
// Empty state CTA
// ---------------------

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-20 h-20 rounded-full bg-cream flex items-center justify-center text-3xl mb-6">
        <span role="img" aria-label="clipboard">
          📋
        </span>
      </div>
      <h2 className="text-lg font-bold text-text mb-2">
        아직 오늘의 코칭이 없어요
      </h2>
      <p className="text-sm text-text-light text-center mb-6 max-w-xs">
        체크리스트를 먼저 작성하고 AI 코칭을 받아보세요.
        오늘의 습관을 분석해서 맞춤 조언을 드릴게요!
      </p>
      <Link
        href="/checklist"
        className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
      >
        체크리스트 작성하러 가기
      </Link>
    </div>
  );
}

// ---------------------
// Error state
// ---------------------

function ErrorState({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-red-500 text-lg" role="img" aria-label="error">
          ⚠️
        </span>
        <h3 className="font-semibold text-red-700 text-sm">오류가 발생했어요</h3>
      </div>
      <p className="text-red-600 text-sm">{message}</p>
      <Link
        href="/checklist"
        className="inline-block mt-3 text-sm text-primary font-medium hover:underline"
      >
        체크리스트로 돌아가기
      </Link>
    </div>
  );
}

// ---------------------
// Coaching message display
// ---------------------

function CoachingDisplay({ message }: { message: CoachingMessage }) {
  const cards: CoachingCardProps[] = [
    {
      icon: "👋",
      title: "인사",
      content: message.greeting,
      accentColor: "bg-blue-50",
    },
    {
      icon: "🌟",
      title: "오늘의 칭찬",
      content: message.praise,
      accentColor: "bg-yellow-50",
    },
    {
      icon: "💡",
      title: "개선 조언",
      content: message.advice,
      accentColor: "bg-cream",
    },
    {
      icon: "🎯",
      title: "내일의 목표",
      content: message.tomorrow_goal,
      accentColor: "bg-green-50",
    },
    {
      icon: "🔬",
      title: "과학 한 스푼",
      content: message.science_tip,
      accentColor: "bg-purple-50",
    },
    {
      icon: "💪",
      title: "마무리 격려",
      content: message.encouragement,
      accentColor: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-4">
      {cards.map((card) => (
        <CoachingCard key={card.title} {...card} />
      ))}
    </div>
  );
}

// ---------------------
// Page component
// ---------------------

export default function CoachingPage() {
  const { todayMessage, isGenerating, error } = useCoachingStore();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text">AI 코칭</h1>
        <p className="text-sm text-text-light mt-1">
          오늘의 건강 습관에 대한 맞춤 코칭을 확인하세요
        </p>
      </div>

      {isGenerating && <CoachingSkeleton />}

      {!isGenerating && error && <ErrorState message={error} />}

      {!isGenerating && !error && todayMessage && (
        <CoachingDisplay message={todayMessage} />
      )}

      {!isGenerating && !error && !todayMessage && <EmptyState />}
    </div>
  );
}
