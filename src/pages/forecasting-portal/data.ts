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
