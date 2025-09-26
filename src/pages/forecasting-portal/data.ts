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

// richer series generator: enforces a single line series with light seasonality so charts
// look good and have continuous data (no nulls). Always returns kind='line'.
function makeRichSeries(
  id: string,
  name: string,
  days: number,
  start: number,
  slope: number,
  volatility = 0,
  floor = 0,
): Series {
  const base = generateTrend(days, start, slope, volatility, floor);
  // choose seasonal period (yearly/monthly/weekly) based on length
  const period = days >= 365 ? 365 : days >= 60 ? 30 : 7;
  const amplitude = Math.max(1, Math.abs(start) * 0.06);
  const data = base.map((dp, i) => {
    const seasonal = Math.sin((2 * Math.PI * i) / period) * amplitude;
    const y = Math.max(floor, dp.y + seasonal);
    return { t: dp.t, y: Number(y.toFixed(2)) };
  });
  return { id, name, kind: 'line', data };
}

// ---------- Mock data including plot-ready series ----------
export const mockFolders: Folder[] = [
  {
    id: 'fld-001',
    name: 'EPG Core Nodes',
    forecasts: [
      {
        id: 'fc-1001',
        name: 'Sample #1',
        updatedAt: '2025-09-10T12:00:00Z',
        isFavorite: true,
        periodLabel: 'Last 12 weeks',
        series: [
          makeRichSeries('fc-1001-series', 'Series', 84, 100, 0.4, 3),
        ],
      },
      {
        id: 'fc-1002',
        name: 'Sample #2',
        updatedAt: '2025-09-08T09:30:00Z',
        isFavorite: false,
        periodLabel: 'Last 12 months',
        series: [
          makeRichSeries('fc-1002-series', 'Series', 365, 60, 0.15, 2),
        ],
      },
    ],
  },
  {
    id: 'fld-005',
    name: 'Diameter Signaling',
    forecasts: [
      {
        id: 'fc-5001',
        name: 'Diameter Msgs Throughput',
        description: 'Diameter signaling messages per minute',
        updatedAt: new Date().toISOString(),
        isFavorite: false,
        periodLabel: 'Last 7 days',
        series: [
          makeRichSeries('fc-5001-series', 'Series', 7, 450, 4, 12, 100),
        ],
      },
    ],
  },
  {
    id: 'fld-006',
    name: 'Network BW',
    forecasts: [
      {
        id: 'fc-6001',
        name: 'Backhaul Bandwidth',
        description: 'Aggregate backhaul bandwidth (Mbps)',
        updatedAt: new Date().toISOString(),
        isFavorite: true,
        periodLabel: 'Last 14 days',
        series: [
          makeRichSeries('fc-6001-series', 'Series', 14, 1200, 8, 40, 600),
        ],
      },
    ],
  },
  {
    id: 'fld-007',
    name: 'Call Volume',
    forecasts: [
      {
        id: 'fc-7001',
        name: 'Calls per Day',
        description: 'Total call volume per day',
        updatedAt: new Date().toISOString(),
        isFavorite: false,
        periodLabel: 'Last 30 days',
        series: [
          makeRichSeries('fc-7001-series', 'Series', 30, 5050, 22, 150, 1100),
        ],
      },
    ],
  },
  {
    id: 'fld-008',
    name: 'PS sessions',
    forecasts: [
      {
        id: 'fc-8001',
        name: 'PS Sessions Active',
        description: 'Active PS sessions over time',
        updatedAt: new Date().toISOString(),
        isFavorite: false,
        periodLabel: 'Last 14 days',
        series: [
          makeRichSeries('fc-8001-series', 'Series', 14, 2210, 12, 60, 900),
        ],
      },
    ],
  },
  {
    id: 'fld-002',
    name: 'DownTown Area Traffic',
    forecasts: [
      {
        id: 'fc-2001',
        name: 'Sample #1',
        updatedAt: '2025-09-05T14:15:00Z',
        isFavorite: false,
        periodLabel: 'Next 6 weeks',
        series: [
          makeRichSeries('fc-2001-series', 'Series', 42, 0.2, 0.005, 0.05, 0),
        ],
      },
      {
        id: 'fc-2002',
        name: 'Sample #2',
        updatedAt: '2025-09-01T16:45:00Z',
        isFavorite: true,
        periodLabel: 'Last 8 weeks',
        series: [
          makeRichSeries('fc-2002-series', 'Series', 56, 120, -0.2, 2, 50),
        ],
      },
    ],
  },
  {
    id: 'fld-003',
    name: 'VIP Segment',
    forecasts: [
      {
        id: 'fc-3001',
        name: 'Sample #1',
        updatedAt: '2025-08-28T10:20:00Z',
        isFavorite: false,
        periodLabel: 'Last 90 days',
        series: [
          makeRichSeries('fc-3001-series', 'Series', 90, 5, 0.02, 1, 0),
        ],
      },
      {
        id: 'fc-3002',
        name: 'Sample #2',
        updatedAt: '2025-09-12T08:00:00Z',
        isFavorite: true,
        periodLabel: 'Last 60 days',
        series: [
          makeRichSeries('fc-3002-series', 'Series', 60, 0.08, 0.0006, 0.005, 0),
        ],
      },
    ],
  },
  // Additional folder aligned with the sample UI mock for telecom KPIs
  {
    id: 'fld-004',
    name: 'Interconnect Links',
    forecasts: [
      {
        id: 'fc-4001',
        name: 'Sample #1',
        description: 'Throughput trend across the network',
        updatedAt: new Date().toISOString(),
        isFavorite: true,
        periodLabel: 'Last 7 days',
        series: [
          makeRichSeries('fc-4001-series', 'Series', 7, 120, 1.8, 5),
        ],
      },
      {
        id: 'fc-4002',
        name: 'Sample #2',
        description: 'Daily call counts',
        updatedAt: new Date().toISOString(),
        isFavorite: true,
        periodLabel: 'Last 14 days',
        series: [
          makeRichSeries('fc-4002-series', 'Series', 14, 800, 5, 60, 500),
        ],
      },
      {
        id: 'fc-4003',
        name: 'Sample #3',
        description: 'Aggregate data usage per day (GB)',
        updatedAt: new Date().toISOString(),
        isFavorite: false,
        periodLabel: 'Last 14 days',
        series: [
          makeRichSeries('fc-4003-series', 'Series', 14, 60, 0.9, 2, 10),
        ],
      },
    ],
  },
];
