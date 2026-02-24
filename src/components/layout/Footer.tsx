'use client';

import Link from 'next/link';

const footerLinks = [
  { href: '/blog', label: '블로그' },
  { href: '/newsletter', label: '뉴스레터' },
  { href: '/program', label: '프로그램' },
];

function Footer() {
  return (
    <footer className="border-t border-cream-darker bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Top section */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div>
            <p className="text-lg font-bold text-primary">슬로에이징 코치</p>
            <p className="mt-1 text-sm text-text-light">
              건강한 습관으로 천천히, 아름답게
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-text-light transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <hr className="my-6 border-cream-darker" />

        {/* Bottom section */}
        <div className="flex flex-col gap-2 text-xs text-text-lighter sm:flex-row sm:items-center sm:justify-between">
          <p>JooLife | joolife.io.kr</p>
          <p>&copy; 2025 JooLife. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
