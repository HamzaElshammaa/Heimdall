export type ChartKind = 'line' | 'bar' | 'area';

export interface DataPoint {
  t: string; // ISO date string
  y: number;
}

export interface Series {
  id: string;
  name: string;
  kind?: ChartKind; // default 'line'
  data: DataPoint[];
}

export interface Forecast {
  id: string;
  name: string;
  description?: string;
  updatedAt: string; // ISO date string
  isFavorite: boolean;
  periodLabel?: string; // e.g., 'Last 7 days'
  series: Series[]; // one or more series to plot
}

export interface Folder {
  id: string;
  name: string;
  forecasts: Forecast[];
}
// ---------- Helpers to generate mock time series ----------
const toISODate = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())).toISOString();

function generateDates(days: number): string[] {
  const dates: string[] = [];
  const base = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(base);
    d.setUTCDate(base.getUTCDate() - i);
    dates.push(toISODate(d));
  }
  return dates;
}

function generateTrend(
  days: number,
  start: number,
  slope: number,
  volatility = 0,
  floor = 0,
): DataPoint[] {
  const dates = generateDates(days);
  let value = start;
  return dates.map((t) => {
    // random walk around linear trend
    const noise = volatility ? (Math.random() - 0.5) * volatility : 0;
    value = Math.max(floor, value + slope + noise);
    return { t, y: Number(value.toFixed(2)) };
  });
}

function makeSeries(
  id: string,
  name: string,
  kind: ChartKind,
  days: number,
  start: number,
  slope: number,
  volatility = 0,
  floor = 0,
): Series {
  return {
    id,
    name,
    kind,
    data: generateTrend(days, start, slope, volatility, floor),
  };
}

// ---------- Mock data including plot-ready series ----------
export const mockFolders: Folder[] = [
  {
    id: 'fld-001',
    name: 'Sales',
    forecasts: [
      {
        id: 'fc-1001',
        name: 'Q4 Revenue Forecast',
        description: 'Projected revenue for Q4 by region',
        updatedAt: '2025-09-10T12:00:00Z',
        isFavorite: true,
        periodLabel: 'Last 12 weeks',
        series: [
          makeSeries('fc-1001-actual', 'Actual', 'line', 84, 100, 0.4, 3),
          makeSeries('fc-1001-forecast', 'Forecast', 'line', 84, 102, 0.45, 2),
        ],
      },
      {
        id: 'fc-1002',
        name: 'Monthly Sales Trend',
        description: 'Rolling 12-month sales trend',
        updatedAt: '2025-09-08T09:30:00Z',
        isFavorite: false,
        periodLabel: 'Last 12 months',
        series: [
          makeSeries('fc-1002-actual', 'Actual', 'area', 365, 60, 0.15, 2),
        ],
      },
    ],
  },
  {
    id: 'fld-002',
    name: 'Inventory',
    forecasts: [
      {
        id: 'fc-2001',
        name: 'Stockout Risk',
        description: 'SKU-level stockout risk over next 6 weeks',
        updatedAt: '2025-09-05T14:15:00Z',
        isFavorite: false,
        periodLabel: 'Next 6 weeks',
        series: [
          makeSeries('fc-2001-prob', 'Probability', 'line', 42, 0.2, 0.005, 0.05, 0),
        ],
      },
      {
        id: 'fc-2002',
        name: 'Reorder Point Optimization',
        description: 'Optimized reorder points by category',
        updatedAt: '2025-09-01T16:45:00Z',
        isFavorite: true,
        periodLabel: 'Last 8 weeks',
        series: [
          makeSeries('fc-2002-rop', 'ROP', 'line', 56, 120, -0.2, 2, 50),
        ],
      },
    ],
  },
  {
    id: 'fld-003',
    name: 'Marketing',
    forecasts: [
      {
        id: 'fc-3001',
        name: 'Campaign Uplift',
        description: 'Expected uplift for Q3 awareness campaigns',
        updatedAt: '2025-08-28T10:20:00Z',
        isFavorite: false,
        periodLabel: 'Last 90 days',
        series: [
          makeSeries('fc-3001-uplift', 'Uplift', 'bar', 90, 5, 0.02, 1, 0),
        ],
      },
      {
        id: 'fc-3002',
        name: 'Lead Conversion Rate',
        description: 'Projected conversions from MQL to SQL',
        updatedAt: '2025-09-12T08:00:00Z',
        isFavorite: true,
        periodLabel: 'Last 60 days',
        series: [
          makeSeries('fc-3002-conv', 'Conversion', 'line', 60, 0.08, 0.0006, 0.005, 0),
        ],
      },
    ],
  },
  // Additional folder aligned with the sample UI mock for telecom KPIs
  {
    id: 'fld-004',
    name: 'Network KPIs',
    forecasts: [
      {
        id: 'fc-4001',
        name: 'Traffic Overview',
        description: 'Throughput trend across the network',
        updatedAt: new Date().toISOString(),
        isFavorite: true,
        periodLabel: 'Last 7 days',
        series: [
          makeSeries('fc-4001-actual', 'Actual', 'line', 7, 120, 1.8, 5),
          makeSeries('fc-4001-forecast', 'Forecast', 'line', 7, 118, 2.0, 3),
        ],
      },
      {
        id: 'fc-4002',
        name: 'Call Volume',
        description: 'Daily call counts',
        updatedAt: new Date().toISOString(),
        isFavorite: true,
        periodLabel: 'Last 14 days',
        series: [
          makeSeries('fc-4002-bars', 'Calls', 'bar', 14, 800, 5, 60, 500),
        ],
      },
      {
        id: 'fc-4003',
        name: 'Data Usage',
        description: 'Aggregate data usage per day (GB)',
        updatedAt: new Date().toISOString(),
        isFavorite: false,
        periodLabel: 'Last 14 days',
        series: [
          makeSeries('fc-4003-usage', 'Usage', 'line', 14, 60, 0.9, 2, 10),
        ],
      },
    ],
  },
];
