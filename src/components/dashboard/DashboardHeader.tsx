"use client";

import { useEffect, useState } from "react";
import { Bell, Search, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardHeader() {
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setDisplayName(
          user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "사용자"
        );
      }
    };

    fetchProfile();
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center gap-3 max-w-md flex-1">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3A39E]"
          />
          <input
            type="text"
            placeholder="검색..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 text-[#1A1A1A] placeholder:text-[#D1D1CC] text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors">
          <Plus size={16} />
          <span className="hidden sm:inline">저장하기</span>
        </button>

        <button className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-[#6B6B66]">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
        </button>

        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-accent">
              {displayName.charAt(0)}
            </span>
          </div>
          <span className="text-sm font-medium text-[#333330] hidden md:block">
            {displayName}
          </span>
        </div>
      </div>
    </header>
  );
}
