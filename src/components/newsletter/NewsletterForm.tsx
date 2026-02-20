'use client';

import { useState, type FormEvent } from 'react';
import { Mail, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsletterFormProps {
  variant: 'inline' | 'card' | 'banner';
  className?: string;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

function NewsletterForm({ variant, className }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email.trim()) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '구독 신청에 실패했습니다.');
      }

      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorMessage(
        err instanceof Error ? err.message : '오류가 발생했습니다.'
      );
    }
  }

  if (status === 'success') {
    return (
      <div
        className={cn(
          'flex items-center justify-center gap-2 rounded-xl bg-primary-50 p-4 text-sm font-medium text-primary',
          variant === 'card' && 'rounded-2xl border border-cream-darker bg-white p-6',
          variant === 'banner' && 'rounded-none p-3',
          className
        )}
      >
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        <span>구독이 완료되었습니다! 매주 유익한 콘텐츠를 보내드릴게요.</span>
      </div>
    );
  }

  // Inline variant: email + button in a row
  if (variant === 'inline') {
    return (
      <form
        onSubmit={handleSubmit}
        className={cn('mx-auto max-w-md', className)}
      >
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-lighter" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              required
              className="w-full rounded-xl border border-cream-darker bg-white py-3 pl-10 pr-4 text-sm text-text placeholder:text-text-lighter focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
            {status === 'loading' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              '구독하기'
            )}
          </button>
        </div>
        {status === 'error' && (
          <p className="mt-2 flex items-center gap-1 text-sm text-error">
            <AlertCircle className="h-3.5 w-3.5" />
            {errorMessage}
          </p>
        )}
      </form>
    );
  }

  // Card variant: full card with description
  if (variant === 'card') {
    return (
      <div
        className={cn(
          'rounded-2xl border border-cream-darker bg-white p-6 shadow-sm',
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
            <Mail className="h-5 w-5 text-accent-dark" />
          </div>
          <div>
            <h3 className="font-semibold text-text">뉴스레터 구독</h3>
            <p className="text-sm text-text-light">
              매주 저속노화 인사이트를 받아보세요
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            required
            className="w-full rounded-xl border border-cream-darker bg-cream py-3 px-4 text-sm text-text placeholder:text-text-lighter focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
            {status === 'loading' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              '무료 구독하기'
            )}
          </button>
          {status === 'error' && (
            <p className="mt-2 flex items-center gap-1 text-sm text-error">
              <AlertCircle className="h-3.5 w-3.5" />
              {errorMessage}
            </p>
          )}
        </form>
      </div>
    );
  }

  // Banner variant: horizontal full-width
  return (
    <div
      className={cn(
        'bg-primary-50 px-4 py-4',
        className
      )}
    >
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-2xl flex-col items-center gap-3 sm:flex-row"
      >
        <p className="shrink-0 text-sm font-medium text-primary">
          매주 건강 인사이트를 받아보세요
        </p>
        <div className="flex w-full flex-1 gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            required
            className="w-full rounded-lg border border-primary/20 bg-white py-2 px-3 text-sm text-text placeholder:text-text-lighter focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
            {status === 'loading' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              '구독'
            )}
          </button>
        </div>
        {status === 'error' && (
          <p className="flex w-full items-center gap-1 text-sm text-error">
            <AlertCircle className="h-3.5 w-3.5" />
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
}

export { NewsletterForm };
