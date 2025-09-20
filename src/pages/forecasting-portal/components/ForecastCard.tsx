import React from 'react';
import type { Forecast } from '../data';
import { Star } from 'lucide-react';
import ForecastChart from './ForecastChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type ForecastCardProps = {
  forecast: Forecast;
  onToggleFavorite?: (id: string) => void;
};

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast, onToggleFavorite }) => {
  return (
    <Card className="border border-border bg-sidebar">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold leading-tight">
            {forecast.name}
          </CardTitle>
          <button
            type="button"
            aria-label={forecast.isFavorite ? 'Unfavorite' : 'Favorite'}
            onClick={() => onToggleFavorite?.(forecast.id)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-bg-card/50 text-yellow-500 hover:text-yellow-600"
            title={forecast.isFavorite ? 'Unfavorite' : 'Favorite'}
          >
            <Star className={forecast.isFavorite ? 'fill-yellow-500' : ''} />
          </button>
        </div>
        {forecast.description ? (
          <p className="mt-1 text-sm text-muted-foreground">{forecast.description}</p>
        ) : null}
        <div className="mt-1 text-xs text-muted-foreground">
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
