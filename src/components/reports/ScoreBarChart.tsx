"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { getScoreColor } from "@/lib/scoring";

interface ScoreBarChartProps {
  data: {
    date: string;
    score: number;
  }[];
}

const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];

export function ScoreBarChart({ data }: ScoreBarChartProps) {
  const chartData = data.map((d) => {
    const day = new Date(d.date).getDay();
    return {
      ...d,
      label: dayLabels[day],
    };
  });

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barCategoryGap="20%">
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: "#636E72" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "#B2BEC3" }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip
            formatter={(value) => [`${value}점`, "점수"]}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #E8DFD1",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="score" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={getScoreColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
