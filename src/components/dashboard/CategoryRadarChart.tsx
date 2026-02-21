"use client";

import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryData {
  sleep: number | null;
  exercise: number | null;
  diet: number | null;
  stress: number | null;
  social: number | null;
}

interface CategoryRadarChartProps {
  weeklyData: CategoryData[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const value = payload[0].value;
  const label = payload[0].payload?.label;

  return (
    <div className="rounded-lg border bg-card px-3 py-2 shadow-md">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-bold" style={{ color: "#00B894" }}>
        {value !== undefined ? `평균 ${value}` : "-"}
      </p>
    </div>
  );
}

export default function CategoryRadarChart({
  weeklyData,
}: CategoryRadarChartProps) {
  const categories = [
    { key: "sleep" as const, emoji: "😴", label: "수면" },
    { key: "exercise" as const, emoji: "🏃", label: "운동" },
    { key: "diet" as const, emoji: "🥗", label: "식단" },
    { key: "stress" as const, emoji: "🧘", label: "스트레스" },
    { key: "social" as const, emoji: "👥", label: "사회활동" },
  ];

  // Calculate average for each category across the week
  const radarData = categories.map(({ key, emoji, label }) => {
    const values = weeklyData
      .map((d) => d[key])
      .filter((v): v is number => v !== null);
    const avg =
      values.length > 0
        ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) /
          10
        : 0;
    return {
      category: `${emoji} ${label}`,
      label,
      value: avg,
      fullMark: 5,
    };
  });

  const hasData = radarData.some((d) => d.value > 0);

  // Find strongest and weakest
  const sorted = [...radarData].filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">카테고리별 균형</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex items-center justify-center h-[220px] text-muted-foreground text-sm">
            데이터가 쌓이면 균형 분석을 보여드려요
          </div>
        ) : (
          <>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  data={radarData}
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                >
                  <PolarGrid
                    stroke="hsl(240 5% 25%)"
                    gridType="polygon"
                  />
                  <PolarAngleAxis
                    dataKey="category"
                    tick={{ fontSize: 11, fill: "hsl(240 5% 65%)" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Radar
                    dataKey="value"
                    stroke="#00B894"
                    strokeWidth={2}
                    fill="#00B894"
                    fillOpacity={0.15}
                    dot={{
                      r: 3,
                      fill: "#00B894",
                      stroke: "#0F0F1A",
                      strokeWidth: 1,
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Insight text */}
            {strongest && weakest && strongest.label !== weakest.label && (
              <div className="mt-2 px-1 space-y-1">
                <p className="text-xs text-muted-foreground">
                  <span className="text-secondary-500 font-medium">
                    강점
                  </span>{" "}
                  {strongest.label} (평균 {strongest.value})
                  {" · "}
                  <span className="text-orange-400 font-medium">
                    개선
                  </span>{" "}
                  {weakest.label} (평균 {weakest.value})
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
