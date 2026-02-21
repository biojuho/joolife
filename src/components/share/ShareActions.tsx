"use client";

import { useRef, useState, useCallback } from "react";
import html2canvas from "html2canvas-pro";
import { Button } from "@/components/ui/button";
import ShareCard from "./ShareCard";

interface ShareActionsProps {
  score: number;
  scores: {
    sleep: number;
    exercise: number;
    diet: number;
    stress: number;
    social: number;
  };
  date: string;
  nickname: string | null;
}

export default function ShareActions({
  score,
  scores,
  date,
  nickname,
}: ShareActionsProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareResult, setShareResult] = useState<
    "idle" | "copied" | "saved" | "shared" | "error"
  >("idle");

  const generateImage = useCallback(async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });

      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => resolve(blob),
          "image/png",
          1.0
        );
      });
    } catch (err) {
      console.error("Image generation failed:", err);
      return null;
    }
  }, []);

  const handleDownload = useCallback(async () => {
    setIsGenerating(true);
    setShareResult("idle");
    try {
      const blob = await generateImage();
      if (!blob) throw new Error("Failed to generate image");

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `slowage-${date}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      setShareResult("saved");
    } catch {
      setShareResult("error");
    } finally {
      setIsGenerating(false);
    }
  }, [generateImage, date]);

  const handleShare = useCallback(async () => {
    setIsGenerating(true);
    setShareResult("idle");
    try {
      const blob = await generateImage();
      if (!blob) throw new Error("Failed to generate image");

      // Try Web Share API (mobile browsers)
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], `slowage-${date}.png`, {
          type: "image/png",
        });
        const shareData = {
          title: "SlowAge 오늘의 점수",
          text: `오늘의 슬로에이징 점수: ${score}점! 🌿`,
          files: [file],
        };

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          setShareResult("shared");
          return;
        }
      }

      // Fallback: copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setShareResult("copied");
    } catch (err) {
      // User cancelled share dialog — not an error
      if (err instanceof Error && err.name === "AbortError") {
        setShareResult("idle");
      } else {
        setShareResult("error");
      }
    } finally {
      setIsGenerating(false);
    }
  }, [generateImage, date, score]);

  const handleCopyLink = useCallback(() => {
    const url = `${window.location.origin}/check`;
    navigator.clipboard.writeText(url);
    setShareResult("copied");
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Share card preview */}
      <div className="rounded-2xl overflow-hidden shadow-2xl shadow-primary-500/10">
        <ShareCard
          ref={cardRef}
          score={score}
          scores={scores}
          date={date}
          nickname={nickname}
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 w-full max-w-[360px]">
        <Button
          onClick={handleShare}
          disabled={isGenerating}
          size="lg"
          className="w-full"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin text-sm">⏳</span>
              이미지 생성 중...
            </span>
          ) : (
            "📱 SNS에 공유하기"
          )}
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleDownload}
            disabled={isGenerating}
            variant="outline"
            size="lg"
          >
            💾 저장하기
          </Button>
          <Button
            onClick={handleCopyLink}
            variant="outline"
            size="lg"
          >
            🔗 링크 복사
          </Button>
        </div>
      </div>

      {/* Result feedback */}
      {shareResult !== "idle" && (
        <div
          className={`text-sm px-4 py-2 rounded-full animate-fade-in-up ${
            shareResult === "error"
              ? "bg-destructive/10 text-destructive"
              : "bg-secondary-500/10 text-secondary-500"
          }`}
        >
          {shareResult === "copied" && "✅ 클립보드에 복사되었습니다!"}
          {shareResult === "saved" && "✅ 이미지가 저장되었습니다!"}
          {shareResult === "shared" && "✅ 공유 완료!"}
          {shareResult === "error" && "❌ 오류가 발생했습니다. 다시 시도해주세요."}
        </div>
      )}
    </div>
  );
}
