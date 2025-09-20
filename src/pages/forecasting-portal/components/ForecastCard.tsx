import React from 'react';
import type { Forecast } from '../data';
import { Star } from 'lucide-react';
import ForecastChart from './ForecastChart';

export type ForecastCardProps = {
  forecast: Forecast;
  onToggleFavorite?: (id: string) => void;
};

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast, onToggleFavorite }) => {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <h3 className="font-medium leading-tight">{forecast.name}</h3>
        <button
          type="button"
          aria-label={forecast.isFavorite ? 'Unfavorite' : 'Favorite'}
          onClick={() => onToggleFavorite?.(forecast.id)}
          className="text-yellow-500 hover:text-yellow-600"
          title={forecast.isFavorite ? 'Unfavorite' : 'Favorite'}
        >
          <Star className={forecast.isFavorite ? 'fill-yellow-500' : ''} />
        </button>
      </div>
      {forecast.description ? (
        <p className="mt-2 text-sm text-muted-foreground">{forecast.description}</p>
      ) : null}
      <div className="mt-3 text-xs text-muted-foreground">{forecast.periodLabel ?? `Updated ${new Date(forecast.updatedAt).toLocaleString()}`}</div>
      <div className="mt-3">
        <ForecastChart forecast={forecast} height={140} />
      </div>
    </div>
  );
};

export default ForecastCard;
