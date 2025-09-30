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

const DisplayArea: React.FC<DisplayAreaProps> = ({
  folders,
  selectedForecastIds,
  viewMode = 'compact',
  onToggleFavorite,
}) => {
  // Determine unique selected forecasts (newest folder wins)
  const selectedForecasts = useMemo<Forecast[]>(() => {
    const idSet = new Set(selectedForecastIds);
    const assigned = new Map<string, { forecast: Forecast; folderId: string }>();
    for (let i = folders.length - 1; i >= 0; i--) {
      const folder = folders[i];
      for (const fc of folder.forecasts) {
        if (!idSet.has(fc.id)) continue;
        if (!assigned.has(fc.id)) {
          assigned.set(fc.id, { forecast: fc, folderId: folder.id });
        }
      }
    }
    return Array.from(assigned.values()).map(({ forecast, folderId }) =>
      ({ ...forecast, _folderId: folderId } as Forecast & { _folderId: string })
    );
  }, [folders, selectedForecastIds]);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const isSectionOpen = useCallback(
    (id: string, def = true) => openSections[id] ?? def,
    [openSections]
  );
  const toggleSection = (id: string) =>
    setOpenSections((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));

  const favoritesSelected = selectedForecasts.filter((f) => f.isFavorite);
  const folderMap = new Map<string, Forecast[]>();
  for (const f of selectedForecasts) {
    if (f.isFavorite) continue;
    const fid = (f as any)._folderId as string;
    const arr = folderMap.get(fid) || [];
    arr.push(f);
    folderMap.set(fid, arr);
  }

  const colsClass =
    viewMode === 'expanded' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2';

  if (!selectedForecasts.length) {
    return (
      <div className="min-h-0 text-sm text-muted-foreground">
        Select forecasts from the left panel to display them here.
      </div>
    );
  }

  const gutter = 'pl-6'; // consistent left gutter for header + cards

  const SectionHeader: React.FC<{
    title: string;
    open: boolean;
    onClick(): void;
    Icon: any;
  }> = ({ title, open, onClick, Icon }) => (
    <div className={gutter}>
      <button
        type="button"
        aria-expanded={open}
        onClick={onClick}
        className={`w-full flex items-center gap-2 mb-2 group min-w-0 overflow-hidden rounded-md border border-border px-3 py-2 text-left transition-colors ${open ? 'bg-transparent' : 'bg-bg-card hover:bg-bg-card/80'}`}
      >
        <Icon className="h-3.5 w-3.5 text-foreground shrink-0" />
        <span
          className="text-xs font-semibold truncate flex-1 min-w-0"
          title={title}
        >
          {title}
        </span>
        <span className="text-xs opacity-70">{open ? '−' : '+'}</span>
      </button>
    </div>
  );

  const renderGrid = (items: Forecast[]) => (
    <div className="relative">
      {/* vertical connector line aligned to header border left edge (gutter offset) */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-border/60 pointer-events-none" />
      <div className={`grid ${colsClass} gap-4 ${gutter}`}>
        {items.map((it) => (
          <div key={it.id} className="relative">
            <div className="absolute -left-4 top-1/2 w-4 h-px bg-border/60" />
            <ForecastCard forecast={it} onToggleFavorite={onToggleFavorite} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-0 space-y-6">
      {/* Favorites Section */}
      {favoritesSelected.length > 0 && (() => {
        const favKey = '__favorites__';
        const open = isSectionOpen(favKey);
        const Icon = open ? ChevronDown : ChevronRight;
        return (
          <section key={favKey} className="pt-2 first:pt-0">
            <SectionHeader
              title="Favorite Forecasts"
              open={open}
              onClick={() => toggleSection(favKey)}
              Icon={Icon}
            />
            {open && renderGrid(favoritesSelected)}
          </section>
        );
      })()}

      {/* Regular Folder Sections */}
      {[...folderMap.entries()].map(([folderId, items]) => {
        const folder = folders.find((f) => f.id === folderId);
        if (!folder) return null;
        const open = isSectionOpen(folderId);
        const Icon = open ? ChevronDown : ChevronRight;
        return (
          <section key={folderId} className="pt-2">
            <SectionHeader
              title={folder.name}
              open={open}
              onClick={() => toggleSection(folderId)}
              Icon={Icon}
            />
            {open && renderGrid(items)}
          </section>
        );
      })}
    </div>
  );
};

export default DisplayArea;
