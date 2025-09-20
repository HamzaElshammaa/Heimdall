export interface Forecast {
  id: string;
  name: string;
  description?: string;
  updatedAt: string; // ISO date string
  isFavorite: boolean;
}

export interface Folder {
  id: string;
  name: string;
  forecasts: Forecast[];
}

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
      },
      {
        id: 'fc-1002',
        name: 'Monthly Sales Trend',
        description: 'Rolling 12-month sales trend',
        updatedAt: '2025-09-08T09:30:00Z',
        isFavorite: false,
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
      },
      {
        id: 'fc-2002',
        name: 'Reorder Point Optimization',
        description: 'Optimized reorder points by category',
        updatedAt: '2025-09-01T16:45:00Z',
        isFavorite: true,
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
      },
      {
        id: 'fc-3002',
        name: 'Lead Conversion Rate',
        description: 'Projected conversions from MQL to SQL',
        updatedAt: '2025-09-12T08:00:00Z',
        isFavorite: true,
      },
    ],
  },
];
