"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "홈", emoji: "🏠" },
  { href: "/check", label: "체크", emoji: "✅" },
  { href: "/dashboard", label: "대시보드", emoji: "📊" },
  { href: "/settings", label: "설정", emoji: "⚙️" },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Don't show on landing, login, onboarding pages
  const hiddenPaths = ["/", "/login", "/onboarding"];
  if (hiddenPaths.includes(pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/90 backdrop-blur-xl safe-area-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
