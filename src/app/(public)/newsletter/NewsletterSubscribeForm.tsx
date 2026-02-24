'use client';

import { useState, type FormEvent } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InterestTag {
  key: string;
  label: string;
}

interface NewsletterSubscribeFormProps {
  interestTags: InterestTag[];
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

function NewsletterSubscribeForm({
  interestTags,
}: NewsletterSubscribeFormProps) {
  const [email, setEmail] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  function toggleTag(key: string) {
    setSelectedTags((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email.trim()) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          tags: selectedTags,
          source: 'newsletter_page',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '구독 신청에 실패했습니다.');
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(
        err instanceof Error ? err.message : '오류가 발생했습니다.'
      );
    }
  }

  if (status === 'success') {
    return (
      <div className="mt-6 flex flex-col items-center gap-3 rounded-xl bg-primary-50 p-6 text-center">
        <CheckCircle2 className="h-8 w-8 text-primary" />
        <div>
          <p className="font-semibold text-primary">구독이 완료되었습니다!</p>
          <p className="mt-1 text-sm text-text-light">
            매주 화요일 아침, 유익한 건강 콘텐츠를 보내드릴게요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      {/* Interest tags */}
      <div>
        <label className="text-sm font-medium text-text">
          관심 분야 (선택)
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {interestTags.map((tag) => (
            <button
              key={tag.key}
              type="button"
              onClick={() => toggleTag(tag.key)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                selectedTags.includes(tag.key)
                  ? 'border-primary bg-primary-50 text-primary'
                  : 'border-cream-darker bg-cream text-text-light hover:border-primary/30'
              )}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Email input */}
      <div>
        <label htmlFor="newsletter-email" className="text-sm font-medium text-text">
          이메일 주소
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          required
          className="mt-1.5 w-full rounded-xl border border-cream-darker bg-cream py-3 px-4 text-sm text-text placeholder:text-text-lighter focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            구독 신청 중...
          </>
        ) : (
          '무료 구독 신청하기'
        )}
      </button>

      {/* Error message */}
      {status === 'error' && (
        <p className="flex items-center gap-1.5 text-sm text-error">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMessage}
        </p>
      )}

      <p className="text-center text-xs text-text-lighter">
        구독 신청 시 개인정보 처리방침에 동의하는 것으로 간주합니다.
        <br />
        언제든 구독을 해지할 수 있습니다.
      </p>
    </form>
  );
}

export { NewsletterSubscribeForm };
