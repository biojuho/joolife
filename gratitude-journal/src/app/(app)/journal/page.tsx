"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, Sparkles, Flame } from "lucide-react";
import type { JournalEntry, DailyQuestionResponse } from "@/lib/types";

export default function JournalPage() {
  const supabase = createClient();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [question, setQuestion] = useState<DailyQuestionResponse | null>(null);
  const [answer, setAnswer] = useState("");
  const [reflection, setReflection] = useState("");
  const [nickname, setNickname] = useState("");
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [displayedReflection, setDisplayedReflection] = useState("");

  const fetchTodayQuestion = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/daily-question");
      const data = await res.json();

      if (data.entry) {
        setEntry(data.entry);
        if (data.entry.user_answer) {
          setAnswer(data.entry.user_answer);
        }
        if (data.entry.ai_reflection) {
          setReflection(data.entry.ai_reflection);
          setShowReflection(true);
          setDisplayedReflection(data.entry.ai_reflection);
        }
      }
      if (data.question) {
        setQuestion(data.question);
      } else if (data.entry?.custom_question) {
        setQuestion({
          question: data.entry.custom_question,
          category: "gratitude",
          depth_level: 1,
          follow_up_hint: "",
        });
      }
    } catch {
      // Fallback
      setQuestion({
        question: "오늘 하루 중 가장 감사했던 순간은 언제였나요?",
        category: "gratitude",
        depth_level: 1,
        follow_up_hint:
          "아주 작은 것도 좋아요. 따뜻한 햇살, 맛있는 커피 한 잔...",
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("nickname, streak_count")
          .eq("id", user.id)
          .single();
        if (data) {
          setNickname(data.nickname);
          setStreak(data.streak_count);
        }
      }
    };

    fetchProfile();
    fetchTodayQuestion();
  }, [supabase, fetchTodayQuestion]);

  // Typing animation for reflection
  useEffect(() => {
    if (showReflection && reflection && !entry?.ai_reflection) {
      let index = 0;
      setDisplayedReflection("");
      const interval = setInterval(() => {
        if (index < reflection.length) {
          setDisplayedReflection(reflection.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [showReflection, reflection, entry?.ai_reflection]);

  const handleSubmit = async () => {
    if (!answer.trim() || !entry) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/ai/reflection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entryId: entry.id,
          userAnswer: answer.trim(),
        }),
      });

      const data = await res.json();
      if (data.reflection) {
        setReflection(data.reflection.reflection);
        setShowReflection(true);
        setStreak((prev) => prev + 1);
      }
    } catch {
      // Error handling
    }
    setSubmitting(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "좋은 아침이에요";
    if (hour < 18) return "좋은 오후예요";
    return "좋은 저녁이에요";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">🌅</div>
          <p className="text-lg text-warm-600">오늘의 질문을 준비하고 있어요...</p>
          <div className="mt-3 flex justify-center gap-1">
            <span className="typing-dot inline-block h-2 w-2 rounded-full bg-warm-400" />
            <span className="typing-dot inline-block h-2 w-2 rounded-full bg-warm-400" />
            <span className="typing-dot inline-block h-2 w-2 rounded-full bg-warm-400" />
          </div>
        </div>
      </div>
    );
  }

  const isAnswered = !!entry?.user_answer || showReflection;

  return (
    <div className="px-5 pt-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-warm-900">
          🌅 {getGreeting()}, {nickname || "사용자"}님
        </h1>
        {streak > 0 && (
          <p className="mt-1 flex items-center gap-1 text-warm-600">
            <Flame className="h-4 w-4 text-orange-500" />
            연속 {streak}일째 기록 중
          </p>
        )}
      </div>

      {/* Question Card */}
      <Card className="mb-6 border-warm-200 bg-white shadow-md animate-fade-in-up">
        <CardContent className="pt-6">
          <p className="mb-1 text-sm font-medium text-warm-500">
            오늘의 질문
          </p>
          <p className="text-xl font-medium leading-relaxed text-warm-900">
            &ldquo;{question?.question}&rdquo;
          </p>

          {question?.follow_up_hint && !showHint && !isAnswered && (
            <button
              onClick={() => setShowHint(true)}
              className="mt-4 flex items-center gap-1 text-sm text-warm-400 hover:text-warm-600 transition-colors"
            >
              <Lightbulb className="h-4 w-4" />
              힌트 보기
            </button>
          )}

          {showHint && (
            <p className="mt-3 rounded-lg bg-warm-50 px-4 py-3 text-sm text-warm-600 animate-fade-in-up">
              💡 {question?.follow_up_hint}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Answer Input */}
      {!isAnswered ? (
        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="여기에 자유롭게 적어보세요..."
            className="min-h-[200px] resize-none border-warm-200 bg-white text-lg leading-relaxed placeholder:text-warm-300 focus:border-warm-400 focus:ring-warm-400"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-warm-400">
              {answer.length}자
            </span>
            <Button
              onClick={handleSubmit}
              disabled={!answer.trim() || submitting}
              className="h-12 gap-2 bg-warm-600 px-6 text-lg font-semibold text-white hover:bg-warm-700 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="flex gap-1">
                    <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-white" />
                    <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-white" />
                    <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                  생각 중...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  보내기
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Saved answer */}
          <Card className="border-warm-200 bg-warm-50">
            <CardContent className="pt-5">
              <p className="mb-1 text-sm font-medium text-warm-500">
                나의 답변
              </p>
              <p className="whitespace-pre-wrap text-warm-800 leading-relaxed">
                {answer || entry?.user_answer}
              </p>
            </CardContent>
          </Card>

          {/* AI Reflection */}
          {showReflection && (
            <Card className="border-warm-300 bg-gradient-to-br from-warm-50 to-orange-50 shadow-md animate-fade-in-up">
              <CardContent className="pt-5">
                <p className="mb-2 flex items-center gap-1 text-sm font-medium text-warm-600">
                  <Sparkles className="h-4 w-4" />
                  AI 리플렉션
                </p>
                <p className="whitespace-pre-wrap text-warm-800 leading-relaxed">
                  {displayedReflection}
                  {displayedReflection.length < reflection.length && (
                    <span className="inline-block h-5 w-0.5 animate-pulse bg-warm-400 ml-0.5" />
                  )}
                </p>
                {entry?.keywords && entry.keywords.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="rounded-full bg-warm-200 px-3 py-1 text-sm text-warm-700"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
