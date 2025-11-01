import React, { useState } from 'react';
import type { Forecast } from '../data';
import { Star, MoreVertical, Info, Download } from 'lucide-react';
import ForecastChart from './ForecastChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type ForecastCardProps = {
  forecast: Forecast;
  onToggleFavorite?: (id: string) => void;
};

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast, onToggleFavorite }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Card className="border border-border bg-sidebar">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 min-w-0">
          <CardTitle className="text-base font-semibold leading-snug truncate min-w-0 flex-1" title={forecast.name}>
            {forecast.name}
          </CardTitle>
          <div className="flex items-center gap-1 shrink-0">
            <div className="relative">
              <button
                type="button"
                aria-label="More options"
                onClick={() => setMenuOpen(!menuOpen)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-bg-card/50 text-foreground/60 hover:text-foreground"
                title="More options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-8 z-20 w-40 rounded-md border border-border bg-sidebar shadow-lg">
                    <div className="py-1">
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-3 py-2 text-[11px] text-foreground hover:bg-bg-card transition-colors"
                        onClick={() => {
                          setMenuOpen(false);
                          // TODO: Implement information action
                        }}
                      >
                        <Info className="h-3.5 w-3.5" />
                        <span>Information</span>
                      </button>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-3 py-2 text-[11px] text-foreground hover:bg-bg-card transition-colors"
                        onClick={() => {
                          setMenuOpen(false);
                          // TODO: Implement export data action
                        }}
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Export Data</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            <button
              type="button"
              aria-label={forecast.isFavorite ? 'Unfavorite' : 'Favorite'}
              onClick={() => onToggleFavorite?.(forecast.id)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-bg-card/50 text-yellow-500 hover:text-yellow-600"
              title={forecast.isFavorite ? 'Unfavorite' : 'Favorite'}
            >
              <Star className={`h-4 w-4 ${forecast.isFavorite ? 'fill-yellow-500' : ''}`} />
            </button>
          </div>
        </div>
        {forecast.description ? (
          <p className="mt-1 text-xs text-muted-foreground">{forecast.description}</p>
        ) : null}
        <div className="mt-1 text-[10px] text-muted-foreground">
          {forecast.periodLabel ?? `Updated ${new Date(forecast.updatedAt).toLocaleString()}`}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ForecastChart forecast={forecast} height={160} />
      </CardContent>
    </Card>
  );
};

export default ForecastCard;
