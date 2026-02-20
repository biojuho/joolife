"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeeklyDataPoint {
  date: string;
  dayLabel: string;
  score: number | null;
}

interface WeeklyTrendChartProps {
  data: WeeklyDataPoint[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  const value = payload[0].value;

  return (
    <div className="rounded-lg border bg-card px-3 py-2 shadow-md">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-bold" style={{ color: "#6C5CE7" }}>
        {value !== undefined && value !== null ? `${value}점` : "기록 없음"}
      </p>
    </div>
  );
}

export default function WeeklyTrendChart({ data }: WeeklyTrendChartProps) {
  // Filter out null scores for chart (Recharts handles gaps with connectNulls)
  const chartData = data.map((d) => ({
    name: `${d.dayLabel} (${d.date.slice(5)})`,
    score: d.score,
  }));

  const hasAnyData = data.some((d) => d.score !== null);

  // Calculate avg of available scores
  const validScores = data
    .map((d) => d.score)
    .filter((s): s is number => s !== null);
  const avg =
    validScores.length > 0
      ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
      : 0;

  // Trend: compare last 3 days avg vs first 3 days avg
  const firstHalf = data
    .slice(0, 3)
    .map((d) => d.score)
    .filter((s): s is number => s !== null);
  const secondHalf = data
    .slice(4)
    .map((d) => d.score)
    .filter((s): s is number => s !== null);
  const firstAvg =
    firstHalf.length > 0
      ? firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
      : 0;
  const secondAvg =
    secondHalf.length > 0
      ? secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length
      : 0;
  const trendDiff = secondAvg - firstAvg;
  const trendIcon =
    trendDiff > 3 ? "📈" : trendDiff < -3 ? "📉" : "➡️";
  const trendText =
    trendDiff > 3
      ? "상승 추세"
      : trendDiff < -3
        ? "하락 추세"
        : "안정적";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">주간 트렌드</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              주간 평균{" "}
              <span className="font-semibold text-foreground">{avg}점</span>
            </span>
            {hasAnyData && (
              <span className="text-xs">
                {trendIcon} {trendText}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!hasAnyData ? (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
            아직 데이터가 없습니다. 체크를 시작해보세요!
          </div>
        ) : (
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="scoreGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#6C5CE7"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#6C5CE7"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(240 5% 25%)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "hsl(240 5% 55%)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val: string) => val.split(" ")[0]}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "hsl(240 5% 55%)" }}
                  tickLine={false}
                  axisLine={false}
                  tickCount={5}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#6C5CE7"
                  strokeWidth={2.5}
                  fill="url(#scoreGradient)"
                  dot={{
                    r: 4,
                    fill: "#6C5CE7",
                    strokeWidth: 2,
                    stroke: "#0F0F1A",
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#6C5CE7",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                  connectNulls
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
