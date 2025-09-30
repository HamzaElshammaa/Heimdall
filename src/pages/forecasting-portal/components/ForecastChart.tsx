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
  Legend,
  CartesianGrid,
} from 'recharts';

export type ForecastChartProps = {
  forecast: Forecast;
  height?: number;
  showTooltip?: boolean;
};

const BLUE = '#3b82f6'; // tailwind blue-500 (training/default)
const BLUE_LIGHT = '#60a5fa'; // tailwind blue-400
const GREEN = '#10b981'; // tailwind emerald-500 (actual)
const ORANGE = '#f97316'; // tailwind orange-500 (forecast)
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

// Tooltip component that hides band payload entries
const BandTooltip: React.FC<any> = ({ active, label, payload }) => {
  if (!active || !payload) return null;
  const filtered = payload.filter((p: any) => !(typeof p.dataKey === 'string' && p.dataKey.endsWith('_band')));
  if (!filtered.length) return null;
  return (
    <div className="recharts-default-tooltip text-xs bg-white/90 backdrop-blur rounded border border-border px-2 py-1">
      <div className="font-semibold mb-1">
        {label && typeof label === 'string' ? new Date(label).toLocaleString() : label}
      </div>
      {filtered.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <span className="font-medium">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const ForecastChart: React.FC<ForecastChartProps> = ({ forecast, height = 140, showTooltip = false }) => {
  // merged timeline rows (one row per timestamp)
  const baseData = useMemo(() => mergeSeries(forecast.series), [forecast.series]);

  // create split keys for actual (first 70%) and prediction (last 30%)
  const data = useMemo(() => {
    const n = baseData.length;
    const cutoff = Math.max(1, Math.floor(n * 0.7));
    return baseData.map((row, idx) => {
      const out: Record<string, any> = { ...row };
      for (const s of forecast.series) {
        const raw = row[s.id] ?? null;
        // variable band width: narrower for observed (actual) region, wider for forecast region
        const pctObserved = 0.06; // ±6%
        const pctForecast = 0.18; // ±18%
        const bandPct = idx <= cutoff ? pctObserved : pctForecast;
        if (idx < cutoff) {
          out[`${s.id}_actual`] = raw;
          out[`${s.id}_pred`] = null;
        } else if (idx === cutoff) {
          // boundary row: set both so lines connect
          out[`${s.id}_actual`] = raw;
          out[`${s.id}_pred`] = raw;
        } else {
          out[`${s.id}_actual`] = null;
          out[`${s.id}_pred`] = raw;
        }
        if (raw != null) {
          const low = Number((raw * (1 - bandPct)).toFixed(2));
          const high = Number((raw * (1 + bandPct)).toFixed(2));
          out[`${s.id}_band`] = [low, high];
        } else {
          out[`${s.id}_band`] = null;
        }
        // remove the original key to avoid duplicate plotting
        delete out[s.id];
      }
      return out;
    });
  }, [baseData, forecast.series]);

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
          <XAxis
            dataKey="t"
            tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            tick={{ fill: 'var(--text-muted-foreground)', fontSize: 8 }}
            axisLine={{ stroke: AXIS }}
            tickLine={{ stroke: AXIS }}
          />
          <YAxis hide domain={["auto", "auto"]} />
          <Tooltip content={<BandTooltip />} wrapperStyle={{ outline: 'none' }} />
          {forecast.series.map((s) => {
            const lname = s.name.toLowerCase();
            const color = lname.includes('forecast') ? BLUE_LIGHT : BLUE;

            if (s.kind === 'area') {
              // render area as filled actual + dotted prediction (prediction as line only)
              return (
                <React.Fragment key={s.id}>
                  <Area
                    type="monotone"
                    dataKey={`${s.id}_band`}
                    stroke="none"
                    fill="#cccccc"
                    fillOpacity={0.5}
                    connectNulls
                    dot={false}
                    activeDot={false}
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey={`${s.id}_actual`}
                    stroke={color}
                    strokeWidth={2}
                    fill={color}
                    fillOpacity={0.18}
                    dot={false}
                    name={`${s.name} (Actual)`}
                  />
                  <Line
                    type="monotone"
                    dataKey={`${s.id}_pred`}
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="5 5"
                    name={`${s.name} (Prediction)`}
                  />
                </React.Fragment>
              );
            }
            // default: line (and previously bar) series -> split into actual (solid) and prediction (dotted)
            return (
              <React.Fragment key={s.id}>
                <Area
                  type="monotone"
                  dataKey={`${s.id}_band`}
                  stroke="none"
                  fill="#cccccc"
                  fillOpacity={0.5}
                  connectNulls
                  dot={false}
                  activeDot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey={`${s.id}_actual`}
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  name={`${s.name} (Actual)`}
                />
                <Line
                  type="monotone"
                  dataKey={`${s.id}_pred`}
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="5 5"
                  name={`${s.name} (Prediction)`}
                />
              </React.Fragment>
            );
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
