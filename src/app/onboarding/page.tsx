'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import OnboardingProgress from '@/components/layout/OnboardingProgress';
import StepBasicInfo from '@/components/onboarding/StepBasicInfo';
import StepBodyInfo from '@/components/onboarding/StepBodyInfo';
import StepHealthGoals from '@/components/onboarding/StepHealthGoals';
import StepStartDate from '@/components/onboarding/StepStartDate';

interface OnboardingData {
  nickname: string;
  birth_year: number | null;
  gender: 'male' | 'female' | 'other' | null;
  height_cm: number | null;
  weight_kg: number | null;
  health_goals: string[];
  program_started_at: string | null;
}

const INITIAL_DATA: OnboardingData = {
  nickname: '',
  birth_year: null,
  gender: null,
  height_cm: null,
  weight_kg: null,
  health_goals: [],
  program_started_at: null,
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  // Pre-fill nickname from existing profile on mount
  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('nickname, birth_year, gender, height_cm, weight_kg, health_goals')
        .eq('id', user.id)
        .single();

      if (profile) {
        setData((prev) => ({
          ...prev,
          nickname: profile.nickname || prev.nickname,
          birth_year: profile.birth_year ?? prev.birth_year,
          gender: profile.gender ?? prev.gender,
          height_cm: profile.height_cm ?? prev.height_cm,
          weight_kg: profile.weight_kg ?? prev.weight_kg,
          health_goals: profile.health_goals?.length
            ? profile.health_goals
            : prev.health_goals,
        }));
      }
    }
    loadProfile();
  }, []);

  const updateData = useCallback(
    (updates: Partial<OnboardingData>) => {
      setData((prev) => ({ ...prev, ...updates }));
    },
    [],
  );

  const toggleGoal = useCallback((goalKey: string) => {
    setData((prev) => ({
      ...prev,
      health_goals: prev.health_goals.includes(goalKey)
        ? prev.health_goals.filter((g) => g !== goalKey)
        : [...prev.health_goals, goalKey],
    }));
  }, []);

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return data.nickname.trim().length > 0;
      case 2:
        return data.height_cm !== null && data.weight_kg !== null;
      case 3:
        return data.health_goals.length > 0;
      case 4:
        return data.program_started_at !== null;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (!canProceed()) return;

    if (step < 4) {
      setDirection('forward');
      setStep((s) => s + 1);
      return;
    }

    // Final step: save to Supabase
    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError('로그인이 필요합니다. 다시 로그인해주세요.');
        setIsSubmitting(false);
        return;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          nickname: data.nickname.trim(),
          birth_year: data.birth_year,
          gender: data.gender,
          height_cm: data.height_cm,
          weight_kg: data.weight_kg,
          health_goals: data.health_goals,
          program_started_at: data.program_started_at,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      router.push('/dashboard');
    } catch (err) {
      console.error('Onboarding save error:', err);
      setError('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setDirection('backward');
      setStep((s) => s - 1);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-cream/80 backdrop-blur-md">
        <div className="mx-auto max-w-lg px-4 py-3">
          <div className="flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex h-10 w-10 items-center justify-center rounded-full
                  text-text-light transition-colors hover:bg-cream-dark hover:text-text"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            ) : (
              <div className="h-10 w-10" />
            )}
            <h1 className="text-sm font-semibold text-text-light">
              프로필 설정
            </h1>
            <div className="h-10 w-10" />
          </div>
        </div>

        {/* Progress indicator */}
        <OnboardingProgress currentStep={step} />
      </header>

      {/* Step content */}
      <main className="flex-1 overflow-hidden">
        <div className="mx-auto max-w-lg px-6 py-6">
          <div
            key={step}
            className={
              direction === 'forward'
                ? 'animate-slide-up'
                : 'animate-fade-in'
            }
          >
            {step === 1 && (
              <StepBasicInfo
                data={{
                  nickname: data.nickname,
                  birth_year: data.birth_year,
                  gender: data.gender,
                }}
                onUpdate={updateData}
              />
            )}

            {step === 2 && (
              <StepBodyInfo
                data={{
                  height_cm: data.height_cm,
                  weight_kg: data.weight_kg,
                }}
                onUpdate={updateData}
              />
            )}

            {step === 3 && (
              <StepHealthGoals
                selectedGoals={data.health_goals}
                onToggle={toggleGoal}
              />
            )}

            {step === 4 && (
              <StepStartDate
                startDate={data.program_started_at}
                onSelect={(date) => updateData({ program_started_at: date })}
              />
            )}
          </div>
        </div>
      </main>

      {/* Error message */}
      {error && (
        <div className="mx-auto max-w-lg px-6">
          <div className="rounded-xl bg-error/10 px-4 py-3 text-center text-sm text-error">
            {error}
          </div>
        </div>
      )}

      {/* Bottom buttons */}
      <footer className="safe-area-bottom sticky bottom-0 border-t border-cream-dark bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg gap-3 px-6 py-4">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 rounded-xl border-2 border-cream-darker bg-white px-6 py-3.5
                text-sm font-semibold text-text-light transition-colors
                hover:border-primary-200 hover:text-text active:scale-[0.98]"
            >
              이전
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className={`
              flex-[2] rounded-xl px-6 py-3.5 text-sm font-bold
              transition-all duration-200 active:scale-[0.98]
              ${
                canProceed() && !isSubmitting
                  ? 'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-dark'
                  : 'cursor-not-allowed bg-cream-darker text-text-lighter'
              }
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                저장 중...
              </span>
            ) : step === 4 ? (
              '프로그램 시작하기'
            ) : (
              '다음'
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}
