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

// ---------- Microsoft Stock dataset (user-provided CSV expected) ----------
// Expected columns (case-insensitive): Date,Open,High,Low,Close,Adj Close,Volume
// Provide the CSV content in the MICROSOFT_STOCK_CSV constant below. If left empty,
// the affected forecasts will render empty charts until populated.
// Truncated Microsoft stock sample (synthetic/representative subset)
// Note: Replace or extend with full dataset if needed.
const MICROSOFT_STOCK_CSV = `Date,Open,High,Low,Close,Adj Close,Volume
2025-01-02,413.50,417.20,409.85,415.32,415.32,21234500
2025-01-03,415.10,416.90,408.40,410.05,410.05,23890123
2025-01-06,409.80,412.75,404.60,406.11,406.11,25500456
2025-01-07,407.25,414.30,406.90,412.88,412.88,23111234
2025-01-08,413.90,418.60,411.55,417.77,417.77,22765001
2025-01-09,418.10,420.25,415.40,416.02,416.02,21988765
2025-01-10,415.95,417.10,410.05,411.44,411.44,24670012
2025-01-13,410.80,413.55,407.90,409.33,409.33,19876543
2025-01-14,409.50,411.20,403.75,405.26,405.26,26544321
2025-01-15,405.90,409.10,401.30,402.48,402.48,28110999
2025-01-16,403.25,407.85,402.10,406.77,406.77,25432100
2025-01-17,407.20,409.40,403.95,404.61,404.61,26007891
2025-01-21,405.10,410.65,404.25,409.98,409.98,21004567
2025-01-22,410.50,412.95,407.80,411.73,411.73,20550001
2025-01-23,412.40,415.55,409.60,414.92,414.92,22345000
2025-01-24,415.20,416.40,410.15,411.02,411.02,22988776
2025-01-27,410.80,412.30,406.70,407.58,407.58,24001234
2025-01-28,408.00,409.85,403.50,405.11,405.11,25119990
2025-01-29,405.60,408.95,404.40,407.33,407.33,23455670
2025-01-30,407.90,411.75,406.25,410.88,410.88,22003456
2025-01-31,411.30,413.40,408.55,409.22,409.22,23670045
2025-02-03,409.15,412.05,405.95,410.44,410.44,22114560
2025-02-04,410.90,414.80,409.10,413.66,413.66,22778890
2025-02-05,414.10,416.20,411.35,415.55,415.55,23345678
2025-02-06,416.00,419.75,414.50,418.92,418.92,24400123
2025-02-07,419.20,421.40,416.85,417.06,417.06,23876543
2025-02-10,417.50,420.15,415.30,419.77,419.77,22654321
2025-02-11,420.05,422.60,417.90,421.88,421.88,21890011
2025-02-12,422.10,425.25,420.55,424.66,424.66,23004567
2025-02-13,424.90,426.40,421.35,422.07,422.07,23567890
2025-02-14,422.50,424.10,419.00,420.33,420.33,22876500`;

function parseMicrosoftStock(): {
  open: DataPoint[];
  high: DataPoint[];
  low: DataPoint[];
  close: DataPoint[];
  volume: DataPoint[];
} {
  const open: DataPoint[] = [];
  const high: DataPoint[] = [];
  const low: DataPoint[] = [];
  const close: DataPoint[] = [];
  const volume: DataPoint[] = [];
  if (!MICROSOFT_STOCK_CSV.trim()) {
    return { open, high, low, close, volume };
  }
  const lines = MICROSOFT_STOCK_CSV.trim().split(/\r?\n/);
  if (!lines.length) return { open, high, low, close, volume };
  const header = lines.shift()!;
  const cols = header.split(/,|;|\t/).map((h) => h.trim().toLowerCase());
  const idx = (name: string) => cols.findIndex((c) => c === name.toLowerCase());
  const dateIdx = idx('date');
  const openIdx = idx('open');
  const highIdx = idx('high');
  const lowIdx = idx('low');
  const closeIdx = idx('close');
  const volumeIdx = idx('volume');
  for (const line of lines) {
    if (!line.trim()) continue;
    const parts = line.split(/,|;|\t/);
    if (dateIdx < 0 || parts.length < cols.length) continue;
    const dateRaw = parts[dateIdx].trim();
    // Accept ISO or YYYY-MM-DD or M/D/YYYY
    let dt: Date | null = null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateRaw)) dt = new Date(dateRaw + 'T00:00:00Z');
    else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateRaw)) {
      const [m, d, y] = dateRaw.split('/').map(Number); dt = new Date(Date.UTC(y, m - 1, d));
    } else if (!isNaN(Date.parse(dateRaw))) dt = new Date(dateRaw);
    if (!dt) continue;
    const iso = new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate())).toISOString();
    const num = (i: number) => (i >= 0 && parts[i] ? Number(parts[i]) : NaN);
    const o = num(openIdx); if (!isNaN(o)) open.push({ t: iso, y: o });
    const h = num(highIdx); if (!isNaN(h)) high.push({ t: iso, y: h });
    const l = num(lowIdx); if (!isNaN(l)) low.push({ t: iso, y: l });
    const c = num(closeIdx); if (!isNaN(c)) close.push({ t: iso, y: c });
    const v = num(volumeIdx); if (!isNaN(v)) volume.push({ t: iso, y: v });
  }
  return { open, high, low, close, volume };
}

const msftStock = parseMicrosoftStock();
const msftHighSeries: Series = { id: 'fc-4001-series', name: 'MSFT High', kind: 'line', data: msftStock.high };
const msftOpenSeries: Series = { id: 'fc-4002-series', name: 'MSFT Open', kind: 'line', data: msftStock.open };
const msftVolumeSeries: Series = { id: 'fc-4003-series', name: 'MSFT Volume', kind: 'line', data: msftStock.volume };
const msftLowSeries: Series = { id: 'fc-3001-series', name: 'MSFT Low', kind: 'line', data: msftStock.low };
const msftCloseSeries: Series = { id: 'fc-1002-series', name: 'MSFT Close', kind: 'line', data: msftStock.close };

// ---------- D202 dataset (Usage & Cost) truncated sample ----------
// Expected columns: date,usage,cost (lowercase headers required here)
// Replace or extend with full dataset as needed.
const D202_CSV = `date,usage,cost
2025-01-02,1200,4500.75
2025-01-03,1310,4702.10
2025-01-06,1255,4621.55
2025-01-07,1402,4890.20
2025-01-08,1388,4815.90
2025-01-09,1422,4922.33
2025-01-10,1375,4784.10
2025-01-13,1330,4699.05
2025-01-14,1295,4610.42
2025-01-15,1355,4755.88
2025-01-16,1410,4866.11
2025-01-17,1392,4822.67
2025-01-21,1450,4975.00
2025-01-22,1475,5033.44
2025-01-23,1505,5110.20
2025-01-24,1490,5077.32
2025-01-27,1433,4933.10
2025-01-28,1380,4820.55
2025-01-29,1402,4869.77
2025-01-30,1425,4920.43
2025-01-31,1418,4895.26
2025-02-03,1399,4855.10
2025-02-04,1433,4938.88
2025-02-05,1460,5002.11
2025-02-06,1488,5066.44
2025-02-07,1470,5022.70
2025-02-10,1495,5081.33
2025-02-11,1510,5125.55
2025-02-12,1533,5188.66
2025-02-13,1522,5155.42
2025-02-14,1508,5110.05`;

function parseD202(): { usage: DataPoint[]; cost: DataPoint[] } {
  const usage: DataPoint[] = [];
  const cost: DataPoint[] = [];
  if (!D202_CSV.trim()) return { usage, cost };
  const lines = D202_CSV.trim().split(/\r?\n/);
  if (!lines.length) return { usage, cost };
  const header = lines.shift()!; // enforce expected order
  for (const line of lines) {
    if (!line.trim()) continue;
    const [date, usageStr, costStr] = line.split(',');
    if (!date) continue;
    const dt = new Date(date.trim() + 'T00:00:00Z');
    const iso = new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate())).toISOString();
    const u = Number(usageStr);
    const c = Number(costStr);
    if (!isNaN(u)) usage.push({ t: iso, y: u });
    if (!isNaN(c)) cost.push({ t: iso, y: c });
  }
  return { usage, cost };
}

const d202 = parseD202();
const d202UsageSeries: Series = { id: 'fc-3001-usage', name: 'Usage', kind: 'line', data: d202.usage };
const d202CostSeries: Series = { id: 'fc-4002-cost', name: 'Cost', kind: 'line', data: d202.cost };

// ---------- station_rio dataset (truncated sample) ----------
// Columns: YEAR,JAN,FEB,MAR,APR,MAY,JUN,JUL,AUG,SEP,OCT,NOV,DEC,D-J-F,M-A-M,J-J-A,S-O-N,metANN
// We generate separate time series for JAN..JUN monthly means and metANN (annual mean).
// Missing values encoded as 999.90 are skipped.
// Date handling: monthly points use first of the month (UTC). Annual mean uses Dec 31 of the year.
// Extend or replace STATION_RIO_CSV with more rows if needed.
const STATION_RIO_CSV = `YEAR,JAN,FEB,MAR,APR,MAY,JUN,JUL,AUG,SEP,OCT,NOV,DEC,D-J-F,M-A-M,J-J-A,S-O-N,metANN\n1973,27.73,27.97,25.70,26.49,22.42,22.76,22.14,21.03,21.46,22.46,23.06,25.85,27.45,24.87,21.98,22.33,24.16\n1974,26.68,27.16,26.56,23.94,22.76,20.70,21.20,21.81,22.91,22.80,24.51,24.54,26.56,24.42,21.24,23.41,23.91\n1975,25.27,26.92,26.43,22.82,21.37,20.50,19.68,22.98,22.40,22.65,24.11,26.53,25.58,23.54,21.05,23.05,23.31\n1976,27.48,26.20,25.55,24.99,22.01,21.18,20.14,21.15,21.27,22.06,24.40,25.56,26.74,24.18,20.82,22.58,23.58\n1977,27.13,28.51,26.88,24.22,22.35,22.13,23.07,22.29,22.44,23.92,24.48,24.84,27.07,24.48,22.50,23.61,24.42\n1978,27.44,26.55,26.42,23.39,21.85,20.03,21.94,21.28,22.49,23.51,25.00,25.66,26.28,23.89,21.08,23.67,23.73\n1979,23.86,25.69,24.80,23.36,23.05,20.30,20.29,22.42,22.05,24.25,24.07,26.02,25.07,23.74,21.00,23.46,23.32\n1980,25.39,27.24,27.83,24.63,23.41,21.20,21.81,22.22,21.05,23.10,24.20,27.01,26.22,25.29,21.74,22.78,24.01\n1981,27.42,28.06,26.26,23.85,22.87,20.94,19.90,21.50,23.19,22.49,25.25,25.73,27.50,24.33,20.78,23.64,24.06\n1982,24.55,27.51,25.00,22.73,21.58,22.44,21.30,22.34,22.41,23.50,26.15,24.98,25.93,23.10,22.03,24.02,23.77\n1983,26.81,27.63,25.99,24.08,23.82,21.18,21.55,20.91,20.53,23.03,25.25,25.94,26.47,24.63,21.21,22.94,23.81\n1984,28.56,28.85,26.54,24.46,24.77,22.91,22.20,21.00,21.91,24.44,25.11,25.24,27.78,25.26,22.04,23.82,24.72\n1985,25.53,999.90,999.90,999.90,999.90,999.90,999.90,999.90,999.90,999.90,999.90,999.90,25.65,999.90,999.90,999.90,999.90\n1986,999.90,27.93,26.95,25.97,999.90,22.70,21.09,22.66,21.46,23.04,25.76,26.17,999.90,25.45,22.15,23.42,24.60\n1987,27.68,27.25,25.86,25.85,22.73,20.48,22.43,20.80,21.02,22.96,24.59,26.07,27.03,24.81,21.24,22.86,23.99\n1988,28.82,26.03,26.49,24.65,22.70,19.74,19.24,21.36,21.89,22.19,23.57,25.75,26.97,24.61,20.11,22.55,23.56\n1989,26.98,26.59,26.45,25.43,21.92,20.90,19.47,21.67,21.70,22.07,24.85,25.86,26.44,24.60,20.68,22.87,23.65\n1990,28.63,27.47,27.50,27.05,22.19,21.50,20.25,19.95,21.17,24.21,26.19,26.08,27.32,25.58,20.57,23.86,24.33\n1991,25.44,26.43,25.52,24.72,21.69,21.42,19.64,20.91,20.80,23.59,24.49,27.26,25.98,23.98,20.66,22.96,23.39\n1992,27.37,999.90,26.75,24.63,23.55,23.31,20.77,20.94,21.74,23.67,23.83,25.38,27.58,24.98,21.67,23.08,24.33\n1993,27.48,27.25,26.81,25.68,22.85,20.98,999.90,999.90,999.90,999.90,999.90,999.90,26.70,25.11,999.90,999.90,999.90\n1994,999.90,999.90,26.56,24.97,23.95,21.16,21.59,20.85,22.72,24.56,25.63,27.32,999.90,25.16,21.20,24.30,24.48\n1995,28.64,27.59,26.75,24.97,23.17,21.84,23.06,23.90,23.05,23.21,25.13,25.93,27.85,24.96,22.93,23.80,24.89\n1996,28.48,28.17,26.76,25.09,22.01,21.16,19.65,20.59,21.44,23.50,23.96,26.51,27.53,24.62,20.47,22.97,23.90\n1997,26.52,28.03,25.35,24.57,22.43,21.53,22.00,21.76,23.28,24.25,26.27,27.77,27.02,24.12,21.76,24.60,24.38\n1998,28.57,28.32,27.72,26.03,22.89,20.59,21.30,23.21,23.48,23.23,23.54,26.86,28.22,25.55,21.70,23.42,24.72\n1999,27.83,27.96,27.00,24.69,22.21,21.25,21.56,20.94,22.77,21.62,23.04,25.70,27.55,24.63,21.25,22.48,23.98\n2000,27.08,26.89,25.85,24.95,22.78,21.94,20.23,21.46,22.28,25.24,25.28,26.75,26.56,24.53,21.21,24.27,24.14\n2001,28.25,28.55,27.83,27.17,23.24,22.67,21.32,22.23,22.20,23.06,24.47,25.82,27.85,26.08,22.07,23.24,24.81\n2002,27.04,26.29,27.72,26.34,23.38,23.08,21.27,23.49,21.78,25.67,25.67,26.45,26.38,25.81,22.61,24.37,24.80\n2003,26.94,999.90,999.90,999.90,999.90,999.90,999.90,999.90,999.90,999.90,999.90,999.90,26.96,999.90,999.90,999.90,999.90\n2004,999.90,999.90,25.61,25.42,22.46,21.50,20.70,21.23,23.76,23.19,25.07,25.65,999.90,24.50,21.14,24.01,24.14\n2005,26.75,26.12,26.64,26.09,23.85,22.41,20.91,23.41,22.18,25.45,24.60,25.26,26.17,25.53,22.24,24.08,24.51\n2006,27.62,27.60,27.01,24.88,21.94,21.39,21.47,22.63,22.23,23.55,24.57,26.62,26.83,24.61,21.83,23.45,24.18\n2007,999.90,999.90,999.90,999.90,999.90,999.90,999.90,999.90,999.90,24.91,25.07,26.97,999.90,999.90,999.90,24.36,999.90\n2008,26.25,26.54,26.37,25.28,22.69,21.59,21.08,22.66,21.88,24.37,24.27,25.39,26.59,24.78,21.78,23.51,24.16\n2009,26.32,27.96,26.55,24.21,23.16,20.71,21.21,21.88,24.01,24.07,27.91,26.20,26.56,24.64,21.27,25.33,24.45\n2010,28.58,29.10,26.49,24.59,22.87,20.35,21.93,21.25,22.74,22.86,24.45,26.92,27.96,24.65,21.18,23.35,24.28\n2011,28.14,28.69,25.50,25.48,21.86,20.52,20.61,22.32,21.79,23.71,23.24,25.47,27.92,24.28,21.15,22.91,24.07\n2012,25.87,27.90,26.57,25.29,22.25,22.67,21.67,22.07,23.02,25.22,24.14,28.53,26.41,24.70,22.14,24.13,24.35\n2013,26.13,28.18,26.18,24.20,22.94,22.59,20.86,21.71,23.42,23.60,24.75,26.05,27.61,24.44,21.72,23.92,24.42\n2014,28.99,28.95,27.59,25.99,23.29,22.84,21.44,22.64,23.89,24.84,25.84,28.38,28.00,25.62,22.31,24.86,25.20\n2015,29.93,28.43,26.78,25.93,23.18,21.98,22.93,23.53,23.28,25.33,26.43,999.90,28.91,25.30,22.81,25.01,25.51\n2016,27.08,28.98,27.43,27.93,22.93,20.53,21.53,23.23,23.03,24.48,24.78,27.22,27.63,26.10,21.76,24.10,24.90\n2017,28.92,28.27,26.97,25.52,22.57,21.97,20.02,22.42,24.22,25.97,25.47,27.01,28.14,25.02,21.47,25.22,24.96\n2018,28.06,27.21,27.81,26.26,23.81,22.91,22.96,21.91,23.71,24.56,25.61,27.55,27.43,25.96,22.59,24.63,25.15\n2019,30.25,28.05,27.50,26.55,24.85,23.10,21.75,22.30,23.05,25.25,999.90,999.90,28.62,26.30,22.38,24.74,25.51`;

interface StationRioParsed {
  jan: DataPoint[]; feb: DataPoint[]; mar: DataPoint[]; apr: DataPoint[]; may: DataPoint[]; jun: DataPoint[]; annual: DataPoint[];
}

function parseStationRio(): StationRioParsed {
  const res: StationRioParsed = { jan: [], feb: [], mar: [], apr: [], may: [], jun: [], annual: [] };
  if (!STATION_RIO_CSV.trim()) return res;
  const lines = STATION_RIO_CSV.trim().split(/\r?\n/);
  const header = lines.shift();
  const cols = header!.split(',');
  const colIndex = (name: string) => cols.findIndex(c => c.trim().toLowerCase() === name.toLowerCase());
  const idxYear = colIndex('YEAR');
  const idxJan = colIndex('JAN');
  const idxFeb = colIndex('FEB');
  const idxMar = colIndex('MAR');
  const idxApr = colIndex('APR');
  const idxMay = colIndex('MAY');
  const idxJun = colIndex('JUN');
  const idxAnn = colIndex('metANN');
  const monthDate = (year: number, monthZero: number) => new Date(Date.UTC(year, monthZero, 1)).toISOString();
  const isValid = (v: string) => v !== undefined && v.trim() !== '' && v.trim() !== '999.90' && !isNaN(Number(v));
  for (const line of lines) {
    const parts = line.split(',');
    if (parts.length < cols.length) continue;
    const yearStr = parts[idxYear];
    if (!yearStr) continue;
    const year = Number(yearStr);
    if (isNaN(year)) continue;
    const pushIfValid = (idx: number, arr: DataPoint[], monthZero: number) => {
      const raw = parts[idx];
      if (isValid(raw)) arr.push({ t: monthDate(year, monthZero), y: Number(raw) });
    };
    pushIfValid(idxJan, res.jan, 0);
    pushIfValid(idxFeb, res.feb, 1);
    pushIfValid(idxMar, res.mar, 2);
    pushIfValid(idxApr, res.apr, 3);
    pushIfValid(idxMay, res.may, 4);
    pushIfValid(idxJun, res.jun, 5);
    const annRaw = parts[idxAnn];
    if (isValid(annRaw)) {
      const annDate = new Date(Date.UTC(year, 11, 31)).toISOString();
      res.annual.push({ t: annDate, y: Number(annRaw) });
    }
  }
  return res;
}

const stationRio = parseStationRio();
export const stationRioJanSeries: Series = { id: 'station-rio-jan', name: 'Rio Jan Temp (°C)', kind: 'line', data: stationRio.jan };
export const stationRioFebSeries: Series = { id: 'station-rio-feb', name: 'Rio Feb Temp (°C)', kind: 'line', data: stationRio.feb };
export const stationRioMarSeries: Series = { id: 'station-rio-mar', name: 'Rio Mar Temp (°C)', kind: 'line', data: stationRio.mar };
export const stationRioAprSeries: Series = { id: 'station-rio-apr', name: 'Rio Apr Temp (°C)', kind: 'line', data: stationRio.apr };
export const stationRioMaySeries: Series = { id: 'station-rio-may', name: 'Rio May Temp (°C)', kind: 'line', data: stationRio.may };
export const stationRioJunSeries: Series = { id: 'station-rio-jun', name: 'Rio Jun Temp (°C)', kind: 'line', data: stationRio.jun };
export const stationRioAnnualSeries: Series = { id: 'station-rio-annual', name: 'Rio Annual Mean (°C)', kind: 'line', data: stationRio.annual };

// For convenience if you want to quickly attach multiple: ordered collection
export const stationRioSelectedSeries: Series[] = [
  stationRioJanSeries,
  stationRioFebSeries,
  stationRioMarSeries,
  stationRioAprSeries,
  stationRioMaySeries,
  stationRioJunSeries,
  stationRioAnnualSeries,
];

// ---------- Daily Delhi Climate dataset (subset) ----------
// Columns: date, meantemp, humidity, wind_speed, meanpressure
// Source: Public climate dataset (Delhi) - truncated sample
const DAILY_DELHI_CLIMATE_CSV = `date,meantemp,humidity,wind_speed,meanpressure\n2017-01-01,15.91304347826087,85.8695652173913,2.743478260869565,59.0\n2017-01-02,18.5,77.22222222222223,2.8944444444444444,1018.2777777777778\n2017-01-03,17.11111111111111,81.88888888888889,4.016666666666667,1018.3333333333334\n2017-01-04,18.7,70.05,4.545,1015.7\n2017-01-05,18.38888888888889,74.94444444444444,3.3000000000000003,1014.3333333333334\n2017-01-06,19.318181818181817,79.31818181818181,8.681818181818182,1011.7727272727273\n2017-01-07,14.708333333333334,95.83333333333333,10.041666666666664,1011.375\n2017-01-08,15.68421052631579,83.52631578947368,1.95,1015.55\n2017-01-09,14.571428571428571,80.80952380952381,6.542857142857142,1015.952380952381\n2017-01-10,12.11111111111111,71.94444444444444,9.361111111111109,1016.8888888888889\n2017-01-11,11.0,72.11111111111111,9.77222222222222,1016.7777777777778\n2017-01-12,11.789473684210526,74.57894736842105,6.626315789473684,1016.3684210526316\n2017-01-13,13.235294117647058,67.05882352941177,6.435294117647059,1017.5294117647059\n2017-01-14,13.2,74.28,5.276,1018.84\n2017-01-15,16.434782608695652,72.56521739130434,3.630434782608696,1018.1304347826087\n2017-01-16,14.65,78.45,10.38,1017.15\n2017-01-17,11.722222222222221,84.44444444444444,8.038888888888888,1018.3888888888889\n2017-01-18,13.041666666666666,78.33333333333333,6.029166666666664,1021.9583333333334\n2017-01-19,14.619047619047619,75.14285714285714,10.338095238095239,1022.8095238095239\n2017-01-20,15.263157894736842,66.47368421052632,11.226315789473684,1021.7894736842105\n2017-01-21,15.391304347826088,70.8695652173913,13.695652173913043,1020.4782608695652\n2017-01-22,18.44,76.24,5.8679999999999986,1021.04\n2017-01-23,18.11764705882353,76.0,6.752941176470588,1019.8235294117648\n2017-01-24,18.347826086956523,68.1304347826087,3.3913043478260865,1018.8695652173913\n2017-01-25,21.0,69.96,8.755999999999998,1018.4\n2017-01-26,16.178571428571427,91.64285714285714,8.467857142857143,1017.7857142857143\n2017-01-27,16.5,77.04166666666667,14.358333333333333,1018.125\n2017-01-28,14.863636363636363,82.77272727272727,9.690909090909093,1019.6363636363636\n2017-01-29,15.666666666666666,81.77777777777777,10.294444444444444,1017.3888888888889\n2017-01-30,16.444444444444443,77.55555555555556,4.322222222222222,1015.8333333333334\n2017-01-31,16.125,76.0,4.625,1015.5\n2017-02-01,15.25,78.625,5.1000000000000005,1017.5\n2017-02-02,17.09090909090909,66.54545454545455,3.027272727272727,1018.9090909090909\n2017-02-03,15.636363636363637,78.18181818181819,1.8545454545454545,1017.7272727272727\n2017-02-04,18.7,77.6,9.819999999999999,1014.4\n2017-02-05,18.63157894736842,77.63157894736842,8.099999999999998,1014.2105263157895\n2017-02-06,16.88888888888889,69.66666666666667,9.044444444444444,1016.0\n2017-02-07,15.125,63.75,7.637500000000001,1016.125\n2017-02-08,15.7,68.4,4.08,1015.6\n2017-02-09,15.375,68.375,7.875000000000002,1016.375\n2017-02-10,14.666666666666666,71.77777777777777,9.066666666666666,1015.6666666666666\n2017-02-11,15.625,64.0,3.95,1016.625\n2017-02-12,16.25,70.375,1.625,1019.625\n2017-02-13,16.333333333333332,67.0,6.377777777777778,1021.5555555555555\n2017-02-14,16.875,65.5,6.9625,1021.375\n2017-02-15,17.571428571428573,67.71428571428571,5.557142857142857,1020.5714285714286\n2017-02-16,20.25,56.75,10.4375,1017.625\n2017-02-17,21.3,64.4,9.279999999999998,1016.5\n2017-02-18,21.125,70.75,6.25,1016.25\n2017-02-19,22.363636363636363,66.0909090909091,6.054545454545456,1013.0\n2017-02-20,23.375,60.125,6.937499999999999,1005.375\n2017-02-21,21.833333333333332,69.41666666666667,12.341666666666667,1007.4166666666666\n2017-02-22,19.125,57.125,7.4125000000000005,1012.25\n2017-02-23,18.625,42.875,14.35,1015.25\n2017-02-24,19.125,40.375,16.6625,1016.125\n2017-02-25,19.0,50.42857142857143,11.928571428571427,1014.2857142857143\n2017-02-26,18.75,59.0,11.1125,1012.375\n2017-02-27,19.875,58.375,5.1000000000000005,1014.25\n2017-02-28,23.333333333333332,51.666666666666664,3.9111111111111114,1013.1111111111111\n2017-03-01,24.46153846153846,47.92307692307692,6.415384615384617,1012.9230769230769\n2017-03-02,23.75,54.25,5.930000000000001,1012.15\n2017-03-03,20.5,42.5,7.4125000000000005,1010.625\n2017-03-04,19.125,43.125,8.350000000000001,1010.0\n2017-03-05,19.75,41.25,9.962499999999999,1010.5\n2017-03-06,20.0,42.44444444444444,9.666666666666664,1010.3333333333334\n2017-03-07,22.625,41.5,6.025,1007.375\n2017-03-08,21.545454545454547,52.72727272727273,10.263636363636364,1008.9090909090909\n2017-03-09,20.785714285714285,69.07142857142857,8.342857142857143,1007.3571428571429\n2017-03-10,19.9375,67.75,11.4625,1006.875\n2017-03-11,18.533333333333335,60.4,5.566666666666666,1009.8\n2017-03-12,17.375,56.625,7.637499999999999,1014.75\n2017-03-13,17.444444444444443,49.333333333333336,9.055555555555554,1014.8888888888889\n2017-03-14,18.0,56.333333333333336,4.522222222222222,1016.5555555555555\n2017-03-15,19.875,54.75,7.175000000000001,1014.125\n2017-03-16,24.0,49.2,5.5600000000000005,1011.1\n2017-03-17,20.9,59.7,11.489999999999998,1010.7\n2017-03-18,24.692307692307693,46.30769230769231,7.1230769230769235,1009.8461538461538\n2017-03-19,24.666666666666668,52.27777777777778,9.161111111111111,1011.8888888888889\n2017-03-20,23.333333333333332,54.666666666666664,10.077777777777778,1012.5555555555555\n2017-03-21,25.0,49.0,9.2625,1011.75\n2017-03-22,27.25,45.0,10.187500000000002,1009.75\n2017-03-23,28.0,49.75,3.4875000000000003,1008.875\n2017-03-24,28.916666666666668,37.666666666666664,10.033333333333335,1010.5833333333334\n2017-03-25,26.5,39.375,10.425,1009.875\n2017-03-26,29.1,37.1,17.59,1010.2\n2017-03-27,29.5,38.625,13.65,1009.5\n2017-03-28,29.88888888888889,40.666666666666664,8.844444444444445,1009.0\n2017-03-29,31.0,34.5,13.2,1007.125\n2017-03-30,29.285714285714285,36.857142857142854,10.585714285714285,1007.1428571428571\n2017-03-31,30.625,37.625,6.949999999999999,1007.5\n2017-04-01,31.375,35.125,9.0375,1005.0\n2017-04-02,29.75,33.75,9.2625,1004.25\n2017-04-03,30.5,29.75,6.9375,1004.25\n2017-04-04,30.933333333333334,31.866666666666667,14.319999999999999,1007.2\n2017-04-05,29.23076923076923,46.0,14.384615384615387,1005.0\n2017-04-06,31.22222222222222,26.0,13.577777777777776,1002.8888888888889\n2017-04-07,27.0,29.875,4.65,1007.375\n2017-04-08,25.625,29.375,8.337499999999999,1010.375\n2017-04-09,27.125,21.125,14.125,1010.625\n2017-04-10,27.857142857142858,19.428571428571427,19.314285714285713,1008.5714285714286\n2017-04-11,29.25,17.75,15.512500000000001,1006.25\n2017-04-12,29.25,26.0,9.4875,1005.875\n2017-04-13,29.666666666666668,29.11111111111111,4.944444444444445,1006.7777777777778\n2017-04-14,30.5,37.625,1.3875000000000002,1004.625\n2017-04-15,31.22222222222222,30.444444444444443,5.966666666666667,1002.4444444444445\n2017-04-16,31.0,34.25,2.0999999999999996,1003.25\n2017-04-17,32.55555555555556,38.44444444444444,5.366666666666666,1004.4444444444445\n2017-04-18,34.0,27.333333333333332,7.811111111111111,1003.1111111111111\n2017-04-19,33.5,24.125,9.025,1000.875\n2017-04-20,34.5,27.5,5.5625,998.625\n2017-04-21,34.25,39.375,6.9625,999.875\n2017-04-22,32.9,40.9,8.89,1001.6\n2017-04-23,32.875,27.5,9.962499999999999,1002.125\n2017-04-24,32.0,27.142857142857142,12.157142857142858,1004.1428571428571`;

function parseDailyDelhiClimate(): Series[] {
  const lines = DAILY_DELHI_CLIMATE_CSV.trim().split(/\r?\n/);
  const header = lines.shift();
  const temp: DataPoint[] = [];
  const hum: DataPoint[] = [];
  const wind: DataPoint[] = [];
  const pressure: DataPoint[] = [];
  for (const line of lines) {
    const [date, meantemp, humidity, wind_speed, meanpressure] = line.split(',');
    const dt = new Date(date.trim() + 'T00:00:00Z');
    temp.push({ t: dt.toISOString(), y: Number(meantemp) });
    hum.push({ t: dt.toISOString(), y: Number(humidity) });
    wind.push({ t: dt.toISOString(), y: Number(wind_speed) });
    pressure.push({ t: dt.toISOString(), y: Number(meanpressure) });
  }
  return [
    { id: 'fc-6001-temp', name: 'Mean Temp (°C)', kind: 'line', data: temp },
    { id: 'fc-6001-humidity', name: 'Humidity (%)', kind: 'line', data: hum },
    { id: 'fc-6001-wind', name: 'Wind Speed', kind: 'line', data: wind },
    { id: 'fc-6001-pressure', name: 'Pressure', kind: 'line', data: pressure },
  ];
}

const delhiClimateSeries = parseDailyDelhiClimate();
// Destructure individual Delhi climate metric series for separate forecasts
const [delhiTempSeries, delhiHumiditySeries, delhiWindSeries, delhiPressureSeries] = delhiClimateSeries;

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
          stationRioJanSeries,
        ],
      },
      {
        id: 'fc-1002',
        name: 'Sample #2',
        updatedAt: '2025-09-08T09:30:00Z',
        isFavorite: false,
        periodLabel: 'Last 12 months',
        series: [msftCloseSeries], // Microsoft Close
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
        description: 'Sample mapped to Delhi mean temperature (daily)',
        updatedAt: new Date().toISOString(),
        isFavorite: true,
        periodLabel: 'Jan–Apr 2017 (sample)',
        series: [delhiTempSeries],
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
        series: [delhiWindSeries],
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
          delhiHumiditySeries,
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
         stationRioFebSeries,
        ],
      },
      {
        id: 'fc-2002',
        name: 'Sample #2',
        updatedAt: '2025-09-01T16:45:00Z',
        isFavorite: true,
        periodLabel: 'Last 8 weeks',
        series: [
          stationRioMarSeries,
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
        series: [d202UsageSeries], // D202 Usage
      },
      {
        id: 'fc-3002',
        name: 'Sample #2',
        updatedAt: '2025-09-12T08:00:00Z',
        isFavorite: true,
        periodLabel: 'Last 60 days',
        series: [
          stationRioAprSeries,
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
          delhiPressureSeries,
        ],
      },
      {
        id: 'fc-4002',
        name: 'Sample #2',
        description: 'Daily call counts',
        updatedAt: new Date().toISOString(),
        isFavorite: true,
        periodLabel: 'Last 14 days',
        series: [d202CostSeries], // D202 Cost (replacing MSFT Open per request)
      },
      {
        id: 'fc-4003',
        name: 'Sample #3',
        description: 'Aggregate data usage per day (GB)',
        updatedAt: new Date().toISOString(),
        isFavorite: false,
        periodLabel: 'Last 14 days',
        series: [msftVolumeSeries], // Microsoft Volume
      },
    ],
  },
];
