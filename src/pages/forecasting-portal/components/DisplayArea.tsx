import React, { useMemo, useState, useCallback } from 'react';
import type { Folder, Forecast } from '../data';
import ForecastCard from './ForecastCard';
import { ChevronDown, ChevronRight } from 'lucide-react';

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

  // collapse state: store favorites under key '__favorites__' and folder ids.
  // Hooks must be declared unconditionally (before any return) to preserve order across renders.
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const isSectionOpen = useCallback((id: string, defaultOpen = true) => {
    return openSections[id] ?? defaultOpen;
  }, [openSections]);
  const toggleSection = (id: string) => setOpenSections((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));

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

  if (!selectedForecasts.length) {
    return (
      <div className="min-h-0 text-sm text-muted-foreground">Select forecasts from the left panel to display them here.</div>
    );
  }

  return (
    <div className="min-h-0 space-y-6">
      {favoritesSelected.length > 0 && (() => {
        const favKey = '__favorites__';
        const open = isSectionOpen(favKey);
        const Icon = open ? ChevronDown : ChevronRight;
        return (
          <section key={favKey} className="pt-2 first:pt-0 border-t border-border first:border-t-0">
            <button
              type="button"
              onClick={() => toggleSection(favKey)}
              className="flex items-center gap-2 mb-3 group min-w-0 overflow-hidden"
            >
              <Icon className="h-4 w-4 text-foreground shrink-0" />
              <span className="text-lg font-semibold group-hover:underline truncate flex-1 min-w-0" title="Favorite Forecasts">Favorite Forecasts</span>
            </button>
            {open && (
              <div className={`grid ${colsClass} gap-4`}>
                {favoritesSelected.map((f) => (
                  <ForecastCard key={f.id} forecast={f} onToggleFavorite={onToggleFavorite} />
                ))}
              </div>
            )}
          </section>
        );
      })()}

      {[...folderMap.entries()].map(([folderId, items]) => {
        const folder = folders.find((f) => f.id === folderId);
        if (!folder) return null;
        const open = isSectionOpen(folderId);
        const Icon = open ? ChevronDown : ChevronRight;
        return (
          <section key={folderId} className="pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => toggleSection(folderId)}
              className="flex items-center gap-2 mb-3 group min-w-0 overflow-hidden"
            >
              <Icon className="h-4 w-4 text-foreground shrink-0" />
              <span className="text-lg font-semibold group-hover:underline truncate flex-1 min-w-0" title={folder.name}>{folder.name}</span>
            </button>
            {open && (
              <div className={`grid ${colsClass} gap-4`}>
                {items.map((f) => (
                  <ForecastCard key={f.id} forecast={f} onToggleFavorite={onToggleFavorite} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};

export default DisplayArea;
