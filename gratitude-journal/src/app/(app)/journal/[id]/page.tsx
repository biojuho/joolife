"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import type { JournalEntry } from "@/lib/types";
import { MOOD_EMOJIS } from "@/lib/types";

export default function EntryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!entry || !confirm("이 기록을 삭제할까요? 되돌릴 수 없어요.")) return;

    setDeleting(true);
    try {
      await fetch("/api/journal", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: entry.id }),
      });
      router.push("/journal/calendar");
    } catch {
      setDeleting(false);
    }
  };

  useEffect(() => {
    const fetchEntry = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("id", params.id)
        .eq("user_id", user.id)
        .single();

      setEntry(data);
      setLoading(false);
    };

    fetchEntry();
  }, [supabase, params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-warm-500">불러오는 중...</p>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-warm-500">기록을 찾을 수 없어요.</p>
      </div>
    );
  }

  return (
    <div className="px-5 pt-6">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4 -ml-2 text-warm-600"
      >
        <ArrowLeft className="mr-1 h-5 w-5" />
        돌아가기
      </Button>

      {/* Date */}
      <div className="mb-6">
        <p className="text-sm text-warm-500">
          {format(parseISO(entry.entry_date), "yyyy년 M월 d일 EEEE", {
            locale: ko,
          })}
        </p>
        {entry.mood_score && (
          <span className="text-2xl">
            {MOOD_EMOJIS[entry.mood_score - 1]}
          </span>
        )}
      </div>

      {/* Question */}
      <Card className="mb-4 border-warm-200 bg-white">
        <CardContent className="pt-5">
          <p className="mb-1 text-sm font-medium text-warm-500">
            질문
          </p>
          <p className="text-lg font-medium text-warm-900 leading-relaxed">
            &ldquo;{entry.custom_question}&rdquo;
          </p>
        </CardContent>
      </Card>

      {/* Answer */}
      <Card className="mb-4 border-warm-200 bg-warm-50">
        <CardContent className="pt-5">
          <p className="mb-1 text-sm font-medium text-warm-500">
            나의 답변
          </p>
          <p className="whitespace-pre-wrap text-warm-800 leading-relaxed">
            {entry.user_answer}
          </p>
          <p className="mt-3 text-sm text-warm-400">
            {entry.word_count}자
          </p>
        </CardContent>
      </Card>

      {/* Reflection */}
      {entry.ai_reflection && (
        <Card className="mb-4 border-warm-300 bg-gradient-to-br from-warm-50 to-orange-50">
          <CardContent className="pt-5">
            <p className="mb-2 flex items-center gap-1 text-sm font-medium text-warm-600">
              <Sparkles className="h-4 w-4" />
              AI 리플렉션
            </p>
            <p className="whitespace-pre-wrap text-warm-800 leading-relaxed">
              {entry.ai_reflection}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Keywords */}
      {entry.keywords && entry.keywords.length > 0 && (
        <div className="flex flex-wrap gap-2">
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

      {/* Delete */}
      <div className="mt-8 text-center">
        <Button
          variant="ghost"
          onClick={handleDelete}
          disabled={deleting}
          className="text-sm text-red-400 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="mr-1 h-4 w-4" />
          {deleting ? "삭제 중..." : "이 기록 삭제하기"}
        </Button>
      </div>
    </div>
  );
}
