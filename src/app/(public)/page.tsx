import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Bot,
  BarChart3,
  Battery,
  Scale,
  Sparkles,
  Moon,
  Star,
  BookOpen,
  Clock,
  Mail,
} from 'lucide-react';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';

// ========================
// Section 1: Hero
// ========================

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-cream px-4 py-20 md:py-32">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-secondary/10" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-accent/10" />

      <div className="relative mx-auto max-w-3xl text-center">
        <span className="inline-block rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary">
          12주 저속노화 프로그램
        </span>

        <h1 className="mt-6 text-3xl font-bold leading-tight text-text md:text-5xl md:leading-tight">
          나이는 숫자일 뿐,
          <br />
          <span className="text-primary">당신의 노화 속도</span>는
          <br />
          바꿀 수 있습니다
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-text-light md:text-lg">
          과학적으로 검증된 12주 프로그램으로 식단, 운동, 수면 습관을 개선하고
          AI 코칭을 통해 당신만의 저속노화 루틴을 만들어보세요.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-md transition-colors hover:bg-primary-dark sm:w-auto"
          >
            시작하기
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/blog"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary bg-white px-6 py-3.5 text-base font-semibold text-primary transition-colors hover:bg-primary-50 sm:w-auto"
          >
            무료 콘텐츠 보기
          </Link>
        </div>

        <p className="mt-4 text-sm text-text-lighter">
          무료로 시작 &middot; 신용카드 불필요
        </p>
      </div>
    </section>
  );
}

// ========================
// Section 2: Problem
// ========================

const problems = [
  {
    icon: Battery,
    title: '만성 피로',
    description: '충분히 잤는데도 피곤하고, 오후만 되면 에너지가 바닥나시나요?',
  },
  {
    icon: Scale,
    title: '체중 관리',
    description: '예전에 먹던 양인데 체중이 늘고, 뱃살이 빠지지 않나요?',
  },
  {
    icon: Sparkles,
    title: '피부 변화',
    description: '피부 탄력이 떨어지고, 잔주름과 칙칙함이 늘어나셨나요?',
  },
  {
    icon: Moon,
    title: '수면 문제',
    description: '잠들기 어렵거나, 자도 자도 개운하지 않으신가요?',
  },
];

function ProblemSection() {
  return (
    <section className="bg-white px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text md:text-3xl">
            이런 고민 있으신가요?
          </h2>
          <p className="mt-3 text-text-light">
            30대 이후 느껴지는 변화, 노화의 신호입니다
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {problems.map((item) => (
            <div
              key={item.title}
              className="flex gap-4 rounded-2xl border border-cream-darker bg-cream p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                <item.icon className="h-6 w-6 text-accent-dark" />
              </div>
              <div>
                <h3 className="font-semibold text-text">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-text-light">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========================
// Section 3: Solution
// ========================

const features = [
  {
    icon: CheckCircle2,
    title: '매일 5분 체크리스트',
    description:
      '식단, 운동, 수면, 생활습관 4가지 영역을 매일 간단히 기록하고 100점 만점으로 점수를 확인하세요.',
  },
  {
    icon: Bot,
    title: 'AI 맞춤 코칭',
    description:
      '당신의 기록을 분석한 AI가 매일 저녁 개인화된 코칭 메시지와 다음 날 목표를 제안합니다.',
  },
  {
    icon: BarChart3,
    title: '주간 리포트',
    description:
      '매주 종합 분석 리포트로 나의 변화를 한눈에 확인하고, 다음 주 전략을 세워보세요.',
  },
];

function SolutionSection() {
  return (
    <section className="bg-cream px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <span className="inline-block rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary">
            12주 프로그램
          </span>
          <h2 className="mt-4 text-2xl font-bold text-text md:text-3xl">
            과학이 증명한 저속노화 습관,
            <br className="hidden sm:block" />
            매일 쉽게 실천하세요
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-text-light">
            복잡한 건강 관리를 하루 5분 체크리스트로 단순화했습니다
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-cream-darker bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-text">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-light">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========================
// Section 4: Testimonials
// ========================

const testimonials = [
  {
    name: '김지현',
    age: '38세',
    quote:
      '12주 동안 매일 체크리스트만 기록했는데 피부 톤이 밝아지고 만성 피로가 사라졌어요. AI 코칭 메시지가 정말 큰 동기부여가 됐습니다.',
    highlight: '피로감 80% 감소',
  },
  {
    name: '박서준',
    age: '45세',
    quote:
      '체중이 고민이었는데, 식단 체크리스트 따라하면서 자연스럽게 5kg이 빠졌어요. 무리한 다이어트 없이 건강하게 관리할 수 있어서 좋았습니다.',
    highlight: '12주 만에 -5kg',
  },
  {
    name: '이수정',
    age: '42세',
    quote:
      '수면 습관이 완전히 바뀌었어요. 스크린 차단 습관 하나로 수면의 질이 달라지니 낮 시간 에너지가 넘칩니다. 주간 리포트 보는 재미도 있어요.',
    highlight: '수면의 질 2배 향상',
  },
];

function TestimonialSection() {
  return (
    <section className="bg-white px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text md:text-3xl">
            실제 참여자들의 이야기
          </h2>
          <p className="mt-3 text-text-light">
            12주 프로그램을 완료한 분들의 후기입니다
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="flex flex-col rounded-2xl border border-cream-darker bg-cream p-6"
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-accent text-accent"
                  />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-text-light">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="mt-4 border-t border-cream-darker pt-4">
                <p className="text-sm font-semibold text-text">
                  {item.name}{' '}
                  <span className="font-normal text-text-lighter">
                    {item.age}
                  </span>
                </p>
                <p className="mt-1 text-xs font-medium text-primary">
                  {item.highlight}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========================
// Section 5: Content Preview
// ========================

const previewArticles = [
  {
    slug: 'slow-aging-diet-basics',
    category: '식단',
    title: '저속노화를 위한 식단의 기본 원칙 5가지',
    excerpt:
      '항산화 식품, 발효식품, 양질의 단백질... 매일 식탁에서 실천할 수 있는 저속노화 식단 가이드.',
    readingTime: 5,
  },
  {
    slug: 'sleep-quality-improvement',
    category: '수면',
    title: '수면의 질을 높이는 과학적 방법',
    excerpt:
      '잠을 잘 자는 것만으로도 노화 속도를 늦출 수 있습니다. 수면 전문가가 알려주는 실천법.',
    readingTime: 7,
  },
  {
    slug: 'daily-exercise-routine',
    category: '운동',
    title: '바쁜 직장인을 위한 20분 저속노화 운동',
    excerpt:
      '시간이 없어도 괜찮아요. 하루 20분이면 충분한 안티에이징 운동 루틴을 소개합니다.',
    readingTime: 4,
  },
];

const categoryColors: Record<string, string> = {
  식단: 'bg-emerald-100 text-emerald-700',
  수면: 'bg-purple-100 text-purple-700',
  운동: 'bg-blue-100 text-blue-700',
};

function ContentPreviewSection() {
  return (
    <section className="bg-cream px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text md:text-3xl">
            무료로 시작하는 건강 지식
          </h2>
          <p className="mt-3 text-text-light">
            저속노화에 대한 유익한 콘텐츠를 무료로 읽어보세요
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {previewArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-cream-darker bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Cover placeholder */}
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-primary-50 to-secondary/20">
                <BookOpen className="h-10 w-10 text-primary/40" />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <span
                  className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[article.category] || 'bg-cream-dark text-text-light'}`}
                >
                  {article.category}
                </span>
                <h3 className="mt-2 font-semibold text-text transition-colors group-hover:text-primary">
                  {article.title}
                </h3>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-text-light">
                  {article.excerpt}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs text-text-lighter">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{article.readingTime}분 읽기</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
          >
            모든 글 보기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ========================
// Section 6: Newsletter
// ========================

function NewsletterSection() {
  return (
    <section className="bg-white px-4 py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
          <Mail className="h-7 w-7 text-accent-dark" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-text md:text-3xl">
          매주 건강 인사이트를 받아보세요
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-text-light">
          최신 저속노화 연구 결과, 실천 팁, 레시피를 매주 화요일 아침에
          보내드립니다. 언제든 구독 해지 가능합니다.
        </p>
        <div className="mt-8">
          <NewsletterForm variant="inline" />
        </div>
      </div>
    </section>
  );
}

// ========================
// Section 7: Final CTA
// ========================

function CTASection() {
  return (
    <section className="bg-gradient-to-b from-primary to-primary-dark px-4 py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          지금 12주 여정을 시작하세요
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/80">
          매일 5분 투자로 식단, 운동, 수면 습관을 개선하고
          AI 코칭으로 나만의 저속노화 루틴을 완성하세요.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-primary shadow-lg transition-transform hover:scale-105"
        >
          무료로 시작하기
          <ArrowRight className="h-5 w-5" />
        </Link>
        <p className="mt-3 text-sm text-white/60">
          가입 후 바로 시작 &middot; 신용카드 불필요
        </p>
      </div>
    </section>
  );
}

// ========================
// Page
// ========================

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <TestimonialSection />
      <ContentPreviewSection />
      <NewsletterSection />
      <CTASection />
    </>
  );
}
