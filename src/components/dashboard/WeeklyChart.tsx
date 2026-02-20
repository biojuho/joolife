'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface WeeklyChartProps {
  data: Array<{ date: string; score: number }>;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white rounded-lg border border-cream-darker px-3 py-2 shadow-sm">
      <p className="text-xs text-text-light">{label}</p>
      <p className="text-sm font-semibold text-text">
        {payload[0].value}점
      </p>
    </div>
  );
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  return (
    <div className="bg-white rounded-2xl border border-cream-darker p-4">
      <h2 className="text-sm font-semibold text-text mb-3">7일 점수 추이</h2>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-sm text-text-light">아직 기록이 없어요</p>
        </div>
      ) : (
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#636E72' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#636E72' }}
                tickLine={false}
                axisLine={false}
                tickCount={3}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#4A7C59"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#4A7C59', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#4A7C59', strokeWidth: 2, stroke: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
