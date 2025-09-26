import React, { useMemo } from 'react';
import type { Folder, Forecast } from '../data';
import ForecastCard from './ForecastCard';

export type DisplayAreaProps = {
  folders: Folder[];
  selectedForecastIds: string[];
  viewMode?: 'compact' | 'expanded';
  onToggleFavorite?: (id: string) => void;
};

const DisplayArea: React.FC<DisplayAreaProps> = ({ folders, selectedForecastIds, viewMode = 'compact', onToggleFavorite }) => {
  const selectedForecasts = useMemo<Forecast[]>(() => {
    // Assign each selected forecast to exactly one folder (newest folder first).
    const idSet = new Set(selectedForecastIds);
    const assigned = new Map<string, { forecast: Forecast; folderId: string }>();

    // iterate folders from newest to oldest so newest groups take display priority
    for (let i = folders.length - 1; i >= 0; i--) {
      const folder = folders[i];
      for (const fc of folder.forecasts) {
        if (!idSet.has(fc.id)) continue;
        if (!assigned.has(fc.id)) {
          assigned.set(fc.id, { forecast: fc, folderId: folder.id });
        }
      }
    }

    // Build the array of forecasts with assigned folder id
    return Array.from(assigned.values()).map(({ forecast, folderId }) => ({ ...forecast, _folderId: folderId } as Forecast & { _folderId: string }));
  }, [folders, selectedForecastIds]);

  if (!selectedForecasts.length) {
    return (
      <div className="min-h-0 text-sm text-muted-foreground">Select forecasts from the left panel to display them here.</div>
    );
  }

  // favorites first (only those that are selected)
  const favoritesSelected = selectedForecasts.filter((s) => s.isFavorite);

  // group remaining selected forecasts by their assigned folder
  const folderMap = new Map<string, Forecast[]>();
  for (const f of selectedForecasts) {
    if (f.isFavorite) continue; // already shown in favorites
    const fid = (f as any)._folderId as string;
    const arr = folderMap.get(fid) || [];
    arr.push(f);
    folderMap.set(fid, arr);
  }

  const colsClass = viewMode === 'expanded' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2';

  return (
    <div className="min-h-0 space-y-6">
      {favoritesSelected.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-3">Favorite Forecasts</h3>
          <div className={`grid ${colsClass} gap-4`}>
            {favoritesSelected.map((f) => (
              <ForecastCard key={f.id} forecast={f} onToggleFavorite={onToggleFavorite} />
            ))}
          </div>
        </section>
      )}

      {[...folderMap.entries()].map(([folderId, items]) => {
        const folder = folders.find((f) => f.id === folderId);
        if (!folder) return null;
        return (
          <section key={folderId}>
            <h3 className="text-lg font-semibold mb-3">{folder.name}</h3>
            <div className={`grid ${colsClass} gap-4`}>
              {items.map((f) => (
                <ForecastCard key={f.id} forecast={f} onToggleFavorite={onToggleFavorite} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default DisplayArea;
