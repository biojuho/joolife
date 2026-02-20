"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface CategoryRadarChartProps {
  data: {
    category: string;
    score: number;
    maxScore: number;
  }[];
}

export function CategoryRadarChart({ data }: CategoryRadarChartProps) {
  const chartData = data.map((d) => ({
    subject: d.category,
    value: d.maxScore > 0 ? (d.score / d.maxScore) * 100 : 0,
    fullMark: 100,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#E8DFD1" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 12, fill: "#636E72" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="점수"
            dataKey="value"
            stroke="#4A7C59"
            fill="#4A7C59"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
