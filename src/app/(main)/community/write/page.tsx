"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { PostForm } from "@/components/community/PostForm";

export default function CommunityWritePage() {
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => router.back()}
          className="text-text-light hover:text-text transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold text-text">글쓰기</h1>
      </div>

      <PostForm />
    </div>
  );
}
