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

// ---------- Embedded real example dataset (Air Passengers 1949-1960) ----------
// Source: Classic Box & Jenkins airline passengers dataset
const AIR_PASSENGERS_CSV = `ds,y\n1/1/1949,112\n2/1/1949,118\n3/1/1949,132\n4/1/1949,129\n5/1/1949,121\n6/1/1949,135\n7/1/1949,148\n8/1/1949,148\n9/1/1949,136\n10/1/1949,119\n11/1/1949,104\n12/1/1949,118\n1/1/1950,115\n2/1/1950,126\n3/1/1950,141\n4/1/1950,135\n5/1/1950,125\n6/1/1950,149\n7/1/1950,170\n8/1/1950,170\n9/1/1950,158\n10/1/1950,133\n11/1/1950,114\n12/1/1950,140\n1/1/1951,145\n2/1/1951,150\n3/1/1951,178\n4/1/1951,163\n5/1/1951,172\n6/1/1951,178\n7/1/1951,199\n8/1/1951,199\n9/1/1951,184\n10/1/1951,162\n11/1/1951,146\n12/1/1951,166\n1/1/1952,171\n2/1/1952,180\n3/1/1952,193\n4/1/1952,181\n5/1/1952,183\n6/1/1952,218\n7/1/1952,230\n8/1/1952,242\n9/1/1952,209\n10/1/1952,191\n11/1/1952,172\n12/1/1952,194\n1/1/1953,196\n2/1/1953,196\n3/1/1953,236\n4/1/1953,235\n5/1/1953,229\n6/1/1953,243\n7/1/1953,264\n8/1/1953,272\n9/1/1953,237\n10/1/1953,211\n11/1/1953,180\n12/1/1953,201\n1/1/1954,204\n2/1/1954,188\n3/1/1954,235\n4/1/1954,227\n5/1/1954,234\n6/1/1954,264\n7/1/1954,302\n8/1/1954,293\n9/1/1954,259\n10/1/1954,229\n11/1/1954,203\n12/1/1954,229\n1/1/1955,242\n2/1/1955,233\n3/1/1955,267\n4/1/1955,269\n5/1/1955,270\n6/1/1955,315\n7/1/1955,364\n8/1/1955,347\n9/1/1955,312\n10/1/1955,274\n11/1/1955,237\n12/1/1955,278\n1/1/1956,284\n2/1/1956,277\n3/1/1956,317\n4/1/1956,313\n5/1/1956,318\n6/1/1956,374\n7/1/1956,413\n8/1/1956,405\n9/1/1956,355\n10/1/1956,306\n11/1/1956,271\n12/1/1956,306\n1/1/1957,315\n2/1/1957,301\n3/1/1957,356\n4/1/1957,348\n5/1/1957,355\n6/1/1957,422\n7/1/1957,465\n8/1/1957,467\n9/1/1957,404\n10/1/1957,347\n11/1/1957,305\n12/1/1957,336\n1/1/1958,340\n2/1/1958,318\n3/1/1958,362\n4/1/1958,348\n5/1/1958,363\n6/1/1958,435\n7/1/1958,491\n8/1/1958,505\n9/1/1958,404\n10/1/1958,359\n11/1/1958,310\n12/1/1958,337\n1/1/1959,360\n2/1/1959,342\n3/1/1959,406\n4/1/1959,396\n5/1/1959,420\n6/1/1959,472\n7/1/1959,548\n8/1/1959,559\n9/1/1959,463\n10/1/1959,407\n11/1/1959,362\n12/1/1959,405\n1/1/1960,417\n2/1/1960,391\n3/1/1960,419\n4/1/1960,461\n5/1/1960,472\n6/1/1960,535\n7/1/1960,622\n8/1/1960,606\n9/1/1960,508\n10/1/1960,461\n11/1/1960,390\n12/1/1960,432`;

function parseAirPassengers(): Series {
  const lines = AIR_PASSENGERS_CSV.trim().split(/\r?\n/);
  const header = lines.shift();
  const data: DataPoint[] = [];
  for (const line of lines) {
    const [ds, yStr] = line.split(',');
    const parts = ds.split('/'); // m/d/yyyy
    const month = Number(parts[0]) - 1;
    const day = Number(parts[1]);
    const year = Number(parts[2]);
    const dt = new Date(Date.UTC(year, month, day));
    data.push({ t: dt.toISOString(), y: Number(yStr) });
  }
  return { id: 'fc-5001-series', name: 'Passengers', kind: 'line', data };
}

const airPassengersSeries = parseAirPassengers();

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
        periodLabel: 'Monthly 1949–1960',
        series: [airPassengersSeries],
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
