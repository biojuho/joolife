'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/blog', label: '블로그' },
  { href: '/newsletter', label: '뉴스레터' },
];

function GNB() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-cream-darker bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 text-lg font-bold text-primary"
        >
          슬로에이징 코치
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text-light transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark"
          >
            시작하기
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-text-light transition-colors hover:bg-cream-dark md:hidden"
          aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'overflow-hidden border-t border-cream-darker bg-white transition-all duration-300 md:hidden',
          mobileOpen ? 'max-h-60' : 'max-h-0 border-t-0',
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-text-light transition-colors hover:bg-cream-dark hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2">
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark"
            >
              시작하기
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export { GNB };
