import type { Metadata } from 'next';
import {
  BookOpen,
  FlaskConical,
  Utensils,
  TrendingUp,
  Gift,
  Mail,
} from 'lucide-react';
import { NewsletterSubscribeForm } from './NewsletterSubscribeForm';

export const metadata: Metadata = {
  title: '뉴스레터 구독',
  description:
    '매주 화요일 아침, 저속노화를 위한 과학적 인사이트와 실천 팁을 받아보세요.',
};

const benefits = [
  {
    icon: FlaskConical,
    title: '최신 연구 해석',
    description: '복잡한 논문을 쉽게 풀어서 핵심만 전달합니다.',
  },
  {
    icon: Utensils,
    title: '실천 레시피',
    description: '저속노화에 도움되는 간편 레시피를 매주 공유합니다.',
  },
  {
    icon: TrendingUp,
    title: '트렌드 분석',
    description: '건강 트렌드의 과학적 근거를 검증해드립니다.',
  },
  {
    icon: Gift,
    title: '구독자 전용 콘텐츠',
    description: '블로그에서 볼 수 없는 구독자 전용 심층 분석 글을 제공합니다.',
  },
  {
    icon: BookOpen,
    title: '주간 큐레이션',
    description: '한 주간 가장 주목할 만한 건강 뉴스를 모아 전달합니다.',
  },
];

const interestTags = [
  { key: 'diet', label: '식단' },
  { key: 'exercise', label: '운동' },
  { key: 'sleep', label: '수면' },
  { key: 'lifestyle', label: '생활습관' },
  { key: 'science', label: '과학' },
  { key: 'mindset', label: '마인드셋' },
];

export default function NewsletterPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-16">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
          <Mail className="h-8 w-8 text-accent-dark" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-text md:text-3xl">
          매주 건강 인사이트를 받아보세요
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-text-light">
          매주 화요일 아침, 저속노화를 위한 과학적 인사이트와 실천 팁을
          이메일로 보내드립니다. 언제든 구독 해지할 수 있습니다.
        </p>
      </div>

      {/* Benefits */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="flex gap-3 rounded-2xl border border-cream-darker bg-white p-5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
              <benefit.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text">
                {benefit.title}
              </h3>
              <p className="mt-0.5 text-sm text-text-light">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Subscribe form */}
      <div className="mt-12">
        <div className="mx-auto max-w-lg rounded-2xl border border-cream-darker bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-lg font-bold text-text">뉴스레터 구독 신청</h2>
          <p className="mt-1 text-sm text-text-light">
            관심 분야를 선택하면 맞춤 콘텐츠를 보내드립니다
          </p>

          <NewsletterSubscribeForm interestTags={interestTags} />
        </div>
      </div>

      {/* Social proof */}
      <p className="mt-6 text-center text-sm text-text-lighter">
        이미 많은 분들이 저속노화 뉴스레터를 구독하고 있습니다
      </p>
    </div>
  );
}
