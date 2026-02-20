"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenLine, Calendar, BarChart3, User } from "lucide-react";

const tabs = [
  { href: "/journal", label: "오늘", icon: PenLine },
  { href: "/journal/calendar", label: "기록", icon: Calendar },
  { href: "/weekly", label: "회고", icon: BarChart3 },
  { href: "/settings", label: "나", icon: User },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white/95 backdrop-blur-sm safe-area-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(tab.href + "/");
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 transition-colors duration-300 ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
