import React, { useMemo } from 'react';
import type { Folder, Forecast } from '../data';
import ForecastCard from './ForecastCard';

export type DisplayAreaProps = {
  folders: Folder[];
  selectedForecastIds: string[];
  onToggleFavorite?: (id: string) => void;
};

const DisplayArea: React.FC<DisplayAreaProps> = ({ folders, selectedForecastIds, onToggleFavorite }) => {
  const selectedForecasts = useMemo<Forecast[]>(() => {
    const all = folders.flatMap((f) => f.forecasts);
    const set = new Set(selectedForecastIds);
    return all.filter((x) => set.has(x.id));
  }, [folders, selectedForecastIds]);

  if (!selectedForecasts.length) {
    return (
      <div className="text-sm text-muted-foreground">Select forecasts from the left panel to display them here.</div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {selectedForecasts.map((f) => (
        <ForecastCard key={f.id} forecast={f} onToggleFavorite={onToggleFavorite} />
      ))}
    </div>
  );
};

export default DisplayArea;
