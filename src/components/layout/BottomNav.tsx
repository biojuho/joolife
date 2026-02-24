'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ClipboardCheck, Users, BarChart3, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: typeof Home;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: '홈', icon: Home },
  { href: '/checklist', label: '체크리스트', icon: ClipboardCheck },
  { href: '/community', label: '커뮤니티', icon: Users },
  { href: '/reports', label: '리포트', icon: BarChart3 },
  { href: '/mypage', label: 'MY', icon: User },
];

function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-cream-darker bg-white safe-area-bottom">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 py-1 transition-colors duration-200',
                isActive ? 'text-primary' : 'text-text-lighter',
              )}
            >
              <Icon
                className={cn('h-5 w-5', isActive && 'stroke-[2.5]')}
              />
              <span
                className={cn(
                  'text-[10px]',
                  isActive ? 'font-semibold' : 'font-medium',
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export { BottomNav };
