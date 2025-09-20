import React, { useMemo } from 'react';
import type { Forecast, Series } from '../data';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Area,
  Bar,
  CartesianGrid,
} from 'recharts';

export type ForecastChartProps = {
  forecast: Forecast;
  height?: number;
  showTooltip?: boolean;
};

const BLUE = '#3b82f6'; // tailwind blue-500
const BLUE_LIGHT = '#60a5fa'; // tailwind blue-400
const GRID = 'rgba(148,163,184,0.25)'; // slate-400 @ 25%
const AXIS = 'rgba(148,163,184,0.6)';

function mergeSeries(series: Series[]) {
  const map = new Map<string, Record<string, any>>();
  for (const s of series) {
    for (const p of s.data) {
      const row = map.get(p.t) || { t: p.t };
      row[s.id] = p.y;
      map.set(p.t, row);
    }
  }
  // ensure sorted by time
  return Array.from(map.values()).sort((a, b) => (a.t > b.t ? 1 : -1));
}

const ForecastChart: React.FC<ForecastChartProps> = ({ forecast, height = 140, showTooltip = false }) => {
  const data = useMemo(() => mergeSeries(forecast.series), [forecast.series]);

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
          <XAxis
            dataKey="t"
            tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            tick={{ fill: AXIS, fontSize: 11 }}
            axisLine={{ stroke: AXIS }}
            tickLine={{ stroke: AXIS }}
          />
          <YAxis hide domain={["auto", "auto"]} />
          {showTooltip ? (
            <Tooltip
              labelFormatter={(v) => new Date(v as string).toLocaleString()}
              contentStyle={{ fontSize: 12 }}
            />
          ) : null}

          {forecast.series.map((s) => {
            const color = s.kind === 'bar' ? BLUE : s.name.toLowerCase().includes('forecast') ? BLUE_LIGHT : BLUE;
            const dash = s.name.toLowerCase().includes('forecast') && (s.kind === 'line' || s.kind === 'area') ? '5 5' : undefined;
            if (s.kind === 'bar') {
              return <Bar key={s.id} dataKey={s.id} fill={color} radius={[4, 4, 0, 0]} />;
            }
            if (s.kind === 'area') {
              return (
                <Area
                  key={s.id}
                  type="monotone"
                  dataKey={s.id}
                  stroke={color}
                  strokeWidth={2}
                  fill={color}
                  fillOpacity={0.2}
                  dot={false}
                />
              );
            }
            return (
              <Line
                key={s.id}
                type="monotone"
                dataKey={s.id}
                stroke={color}
                strokeWidth={2}
                dot={false}
                strokeDasharray={dash}
              />
            );
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
