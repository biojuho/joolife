'use client';

import { useEffect, useState, useCallback } from 'react';
import { useUserStore } from '@/stores/user-store';
import { createClient } from '@/lib/supabase/client';
import { getDaysSince, getCurrentWeek, getToday, getGreeting } from '@/lib/utils';
import { calculateScores } from '@/lib/scoring';
import { Skeleton } from '@/components/ui/Skeleton';
import { ScoreCard } from '@/components/dashboard/ScoreCard';
import { WeeklyChart } from '@/components/dashboard/WeeklyChart';
import { WeeklyProgress } from '@/components/dashboard/WeeklyProgress';
import { WeekThemeCard } from '@/components/dashboard/WeekThemeCard';
import { CoachingPreview } from '@/components/dashboard/CoachingPreview';
import dayjs from 'dayjs';
import type { DailyChecklist, ProgramCurriculum } from '@/lib/types';

interface ChartDataPoint {
  date: string;
  score: number;
}

export default function DashboardPage() {
  const { profile } = useUserStore();

  const [isLoading, setIsLoading] = useState(true);
  const [todayScore, setTodayScore] = useState(0);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [completedDays, setCompletedDays] = useState(0);
  const [weekTotalDays, setWeekTotalDays] = useState(7);
  const [curriculum, setCurriculum] = useState<ProgramCurriculum | null>(null);
  const [coachingMessage, setCoachingMessage] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!profile) return;

    const supabase = createClient();
    const today = getToday();

    try {
      // 1) Fetch today's checklist for score
      const { data: todayChecklist } = await supabase
        .from('daily_checklist')
        .select('*')
        .eq('user_id', profile.id)
        .eq('check_date', today)
        .single();

      if (todayChecklist) {
        const checklist = todayChecklist as DailyChecklist;
        const scores = calculateScores(checklist);
        setTodayScore(scores.total_score);

        // Extract coaching message
        if (checklist.ai_coaching_message) {
          try {
            const parsed = JSON.parse(checklist.ai_coaching_message);
            setCoachingMessage(parsed.greeting || parsed.advice || checklist.ai_coaching_message);
          } catch {
            setCoachingMessage(checklist.ai_coaching_message);
          }
        }
      }

      // 2) Fetch last 7 days of scores for chart
      const sevenDaysAgo = dayjs().subtract(6, 'day').format('YYYY-MM-DD');
      const { data: weekData } = await supabase
        .from('daily_checklist')
        .select('check_date, daily_score')
        .eq('user_id', profile.id)
        .gte('check_date', sevenDaysAgo)
        .lte('check_date', today)
        .order('check_date', { ascending: true });

      if (weekData) {
        const chart: ChartDataPoint[] = weekData.map((row) => ({
          date: dayjs(row.check_date).format('M/D'),
          score: row.daily_score || 0,
        }));
        setChartData(chart);
      }

      // 3) Fetch this week's completion count
      const weekStart = dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DD'); // Monday
      const adjustedWeekStart = dayjs(weekStart).isAfter(dayjs())
        ? dayjs(weekStart).subtract(7, 'day').format('YYYY-MM-DD')
        : weekStart;
      const weekEnd = dayjs(adjustedWeekStart).add(6, 'day').format('YYYY-MM-DD');

      const { data: weekChecklists } = await supabase
        .from('daily_checklist')
        .select('check_date')
        .eq('user_id', profile.id)
        .gte('check_date', adjustedWeekStart)
        .lte('check_date', weekEnd);

      if (weekChecklists) {
        setCompletedDays(weekChecklists.length);
      }

      // Calculate how many days have passed this week (up to today)
      const daysSinceWeekStart = dayjs().diff(dayjs(adjustedWeekStart), 'day') + 1;
      setWeekTotalDays(Math.min(daysSinceWeekStart, 7));

      // 4) Fetch current week's curriculum
      const currentWeek = profile.program_started_at
        ? getCurrentWeek(profile.program_started_at)
        : 1;

      const { data: curriculumData } = await supabase
        .from('program_curriculum')
        .select('*')
        .eq('week_number', currentWeek)
        .single();

      if (curriculumData) {
        setCurriculum(curriculumData as ProgramCurriculum);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Derived values
  const nickname = profile?.nickname || '사용자';
  const daysSince = profile?.program_started_at
    ? getDaysSince(profile.program_started_at)
    : 0;
  const currentWeek = profile?.program_started_at
    ? getCurrentWeek(profile.program_started_at)
    : 1;
  const greeting = getGreeting();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-7 w-56" />
        </div>
        {/* Score card skeleton */}
        <Skeleton className="h-52 w-full rounded-2xl" />
        {/* Weekly progress skeleton */}
        <Skeleton className="h-28 w-full rounded-2xl" />
        {/* Chart skeleton */}
        <Skeleton className="h-52 w-full rounded-2xl" />
        {/* Theme card skeleton */}
        <Skeleton className="h-20 w-full rounded-2xl" />
        {/* Coaching skeleton */}
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <p className="text-sm text-text-light">{greeting}</p>
        <h1 className="text-xl font-bold text-text">
          {nickname}님의 슬로에이징 D+{daysSince}
        </h1>
      </div>

      {/* Score Card */}
      <ScoreCard score={todayScore} />

      {/* Weekly Progress */}
      <WeeklyProgress completedDays={completedDays} totalDays={weekTotalDays} />

      {/* Weekly Chart */}
      <WeeklyChart data={chartData} />

      {/* Week Theme */}
      {curriculum && (
        <WeekThemeCard
          weekNumber={currentWeek}
          title={curriculum.theme}
          description={curriculum.focus_area}
        />
      )}

      {/* AI Coaching Preview */}
      <CoachingPreview message={coachingMessage} />
    </div>
  );
}
