'use client';

import Link from 'next/link';
import { Lock, Mail } from 'lucide-react';

interface ContentGateProps {
  type: 'subscriber' | 'premium';
}

const gateConfig = {
  subscriber: {
    icon: Mail,
    title: '구독자 전용 콘텐츠입니다',
    description: '뉴스레터를 구독하시면 이 글의 전체 내용을 읽으실 수 있습니다.',
    ctaText: '뉴스레터 구독하면 전체 읽기',
    ctaHref: '/newsletter',
  },
  premium: {
    icon: Lock,
    title: '프리미엄 콘텐츠입니다',
    description: '12주 프로그램을 시작하시면 모든 프리미엄 콘텐츠를 이용하실 수 있습니다.',
    ctaText: '프로그램 시작하면 전체 읽기',
    ctaHref: '/signup',
  },
};

function ContentGate({ type }: ContentGateProps) {
  const config = gateConfig[type];
  const Icon = config.icon;

  return (
    <div className="relative mt-8">
      {/* Blur overlay */}
      <div className="pointer-events-none absolute -top-32 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />

      {/* CTA Card */}
      <div className="rounded-2xl border border-cream-darker bg-white p-8 text-center shadow-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
          <Icon className="h-7 w-7 text-primary" />
        </div>

        <h3 className="mt-4 text-lg font-bold text-text">{config.title}</h3>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-text-light">
          {config.description}
        </p>

        <Link
          href={config.ctaHref}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          {config.ctaText}
        </Link>
      </div>
    </div>
  );
}

export { ContentGate };
