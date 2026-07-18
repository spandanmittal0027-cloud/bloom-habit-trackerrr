"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export function CompletionChart({
  data,
}: {
  data: { date: string; percent: number }[];
}) {
  const chartData = data.map((d) => ({
    day: new Date(d.date + "T00:00:00").getDate(),
    percent: Math.round(d.percent),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="completionFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-blush-deep)" stopOpacity={0.55} />
            <stop offset="100%" stopColor="var(--color-blush-deep)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 6" stroke="var(--color-ink)" strokeOpacity={0.06} />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11, fill: "var(--color-ink-soft)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 11, fill: "var(--color-ink-soft)" }}
          axisLine={false}
          tickLine={false}
          width={32}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid rgba(92,75,82,0.1)",
            fontSize: 12,
          }}
          formatter={(value) => [`${value}%`, "Completed"]}
          labelFormatter={(day) => `Day ${day}`}
        />
        <Area
          type="monotone"
          dataKey="percent"
          stroke="var(--color-blush-deep)"
          strokeWidth={2}
          fill="url(#completionFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
