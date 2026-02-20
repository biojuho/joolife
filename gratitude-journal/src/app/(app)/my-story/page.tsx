"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Download, Sparkles, Lock } from "lucide-react";
import type { Profile, LifeBook } from "@/lib/types";

interface BookContent {
  title: string;
  subtitle: string;
  dedication: string;
  chapters: { title: string; content: string }[];
  epilogue: string;
}

export default function MyStoryPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [books, setBooks] = useState<LifeBook[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [bookContent, setBookContent] = useState<BookContent | null>(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const [profileRes, booksRes, entriesRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase
        .from("life_books")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("journal_entries")
        .select("id", { count: "exact" })
        .eq("user_id", user.id)
        .neq("user_answer", ""),
    ]);

    setProfile(profileRes.data);
    setBooks(booksRes.data || []);
    setTotalEntries(entriesRes.count || 0);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const generateBook = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/life-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else if (data.book) {
        setBookContent(data.book);
        fetchData();
      }
    } catch {
      alert("인생책 생성 중 오류가 발생했어요.");
    }
    setGenerating(false);
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <title>${bookContent?.title || "나의 인생 이야기"}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap');
            body {
              font-family: 'Noto Serif KR', serif;
              max-width: 700px;
              margin: 0 auto;
              padding: 40px 20px;
              color: #3d2c1e;
              line-height: 1.9;
              font-size: 16px;
            }
            .cover { text-align: center; page-break-after: always; padding: 120px 0; }
            .cover h1 { font-size: 32px; margin-bottom: 12px; }
            .cover .subtitle { font-size: 18px; color: #8b6914; }
            .cover .dedication { margin-top: 60px; font-style: italic; color: #92400e; }
            .chapter { page-break-before: always; }
            .chapter h2 { font-size: 22px; color: #92400e; margin-bottom: 20px; border-bottom: 1px solid #fde68a; padding-bottom: 8px; }
            .chapter p { margin-bottom: 14px; }
            blockquote { border-left: 3px solid #fbbf24; padding-left: 16px; margin: 16px 0; color: #78350f; font-style: italic; }
            .epilogue { page-break-before: always; text-align: center; padding-top: 80px; }
            .epilogue h2 { font-size: 20px; color: #92400e; }
            hr { border: none; border-top: 1px solid #fde68a; margin: 24px 0; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>${printRef.current.innerHTML}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-warm-500">불러오는 중...</p>
      </div>
    );
  }

  const isPremium = profile?.tier === "premium";

  return (
    <div className="px-5 pt-8">
      <h1 className="mb-6 text-2xl font-bold text-warm-900">
        📖 나의 인생 이야기
      </h1>

      {/* Status Card */}
      <Card className="mb-6 border-warm-200 bg-white">
        <CardContent className="pt-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-warm-500">총 기록 수</p>
              <p className="text-3xl font-bold text-warm-700">
                {totalEntries}개
              </p>
            </div>
            <BookOpen className="h-10 w-10 text-warm-300" />
          </div>
          {totalEntries < 3 && (
            <p className="mt-3 text-sm text-warm-400">
              인생책을 만들려면 최소 3개의 기록이 필요해요.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Generate Button */}
      {isPremium ? (
        <Card className="mb-6 border-warm-300 bg-gradient-to-br from-warm-50 to-orange-50">
          <CardContent className="pt-5 text-center">
            <Sparkles className="mx-auto mb-2 h-8 w-8 text-warm-500" />
            <p className="mb-3 text-warm-700">
              지금까지의 기록으로 인생책을 만들어 보세요
            </p>
            <Button
              onClick={generateBook}
              disabled={generating || totalEntries < 3}
              className="bg-warm-600 text-white hover:bg-warm-700"
            >
              {generating ? (
                <span className="flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-white" />
                    <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-white" />
                    <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                  이야기를 엮는 중...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  인생책 만들기
                </span>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6 border-warm-200 bg-warm-50">
          <CardContent className="py-8 text-center">
            <Lock className="mx-auto mb-3 h-8 w-8 text-warm-400" />
            <p className="mb-1 font-semibold text-warm-700">
              프리미엄 기능
            </p>
            <p className="text-sm text-warm-500">
              프리미엄으로 업그레이드하면 나의 기록을
              <br />
              인생책 PDF로 만들 수 있어요.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Book Preview */}
      {bookContent && (
        <div className="animate-fade-in-up">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-warm-800">미리보기</h2>
            <Button
              variant="outline"
              onClick={handlePrint}
              className="gap-2 border-warm-300 text-warm-700"
            >
              <Download className="h-4 w-4" />
              PDF 저장
            </Button>
          </div>

          <Card className="border-warm-200 bg-white shadow-md">
            <CardContent className="pt-6">
              <div ref={printRef}>
                {/* Cover */}
                <div className="cover mb-8 text-center">
                  <h1 className="text-2xl font-bold text-warm-900">
                    {bookContent.title}
                  </h1>
                  <p className="subtitle mt-2 text-warm-600">
                    {bookContent.subtitle}
                  </p>
                  <p className="dedication mt-8 text-sm italic text-warm-500">
                    {bookContent.dedication}
                  </p>
                </div>

                <Separator className="my-6 bg-warm-200" />

                {/* Chapters */}
                {bookContent.chapters.map((chapter, i) => (
                  <div key={i} className="chapter mb-8">
                    <h2 className="mb-4 text-xl font-bold text-warm-800 border-b border-warm-200 pb-2">
                      {chapter.title}
                    </h2>
                    <div className="prose prose-warm whitespace-pre-wrap text-warm-700 leading-relaxed">
                      {chapter.content}
                    </div>
                    {i < bookContent.chapters.length - 1 && (
                      <Separator className="mt-6 bg-warm-100" />
                    )}
                  </div>
                ))}

                {/* Epilogue */}
                <div className="epilogue mt-8 border-t border-warm-200 pt-8 text-center">
                  <h2 className="mb-4 text-lg font-semibold text-warm-600">
                    에필로그
                  </h2>
                  <p className="text-warm-700 leading-relaxed">
                    {bookContent.epilogue}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Past Books */}
      {books.length > 0 && (
        <div className="mt-6 space-y-3">
          <h2 className="text-lg font-semibold text-warm-800">
            만든 인생책
          </h2>
          {books.map((book) => (
            <Card key={book.id} className="border-warm-200 bg-white">
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium text-warm-800">{book.title}</p>
                  <p className="text-sm text-warm-500">
                    {book.date_range_start} ~ {book.date_range_end}
                  </p>
                </div>
                <BookOpen className="h-5 w-5 text-warm-400" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
