"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bookmark,
  Sparkles,
  Zap,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "대시보드",
  },
  {
    href: "/dashboard/contents",
    icon: Bookmark,
    label: "저장 콘텐츠",
  },
  {
    href: "/dashboard/recommendations",
    icon: Sparkles,
    label: "AI 추천",
  },
  {
    href: "/dashboard/automations",
    icon: Zap,
    label: "자동화",
  },
  {
    href: "/dashboard/settings",
    icon: Settings,
    label: "설정",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 flex flex-col z-30 transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[240px]"
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
          <span className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-heading font-bold text-sm shrink-0">
            J
          </span>
          {!collapsed && (
            <span className="font-heading font-bold text-[#1A1A1A] text-lg truncate">
              JooLife
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-accent-bg text-accent"
                  : "text-[#6B6B66] hover:bg-gray-100 hover:text-[#1A1A1A]"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gray-200 space-y-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#6B6B66] hover:bg-red-50 hover:text-red-600 transition-all"
          title={collapsed ? "로그아웃" : undefined}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span>로그아웃</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-[#A3A39E] hover:bg-gray-100 transition-colors"
          aria-label={collapsed ? "사이드바 열기" : "사이드바 접기"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
