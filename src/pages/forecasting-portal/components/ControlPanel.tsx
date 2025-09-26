import React, { useMemo, useState } from 'react';
import type { Folder, Forecast } from '../data';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SearchInput } from '@/components/ui/input';

export type ControlPanelProps = {
  folders: Folder[];
  selectedForecastIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onCreateFolder?: () => void;
};

const ControlPanel: React.FC<ControlPanelProps> = ({
  folders,
  selectedForecastIds,
  onSelectionChange,
  onCreateFolder,
}) => {
  const [query, setQuery] = useState('');
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  const normalizedQuery = query.trim().toLowerCase();

  const favorites = useMemo<Forecast[]>(() => {
    const all = folders.flatMap((f) => f.forecasts);
    const favs = all.filter((x) => x.isFavorite);
    if (!normalizedQuery) return favs;
    return favs.filter((x) => x.name.toLowerCase().includes(normalizedQuery));
  }, [folders, normalizedQuery]);

  const toggleFavoritesSelection = () => {
    const favIds = favorites.map((f) => f.id);
    const favSet = new Set(favIds);
    const allSelected = favIds.length > 0 && favIds.every((id) => selectedForecastIds.includes(id));
    if (allSelected) {
      // unselect all favorites
      onSelectionChange(selectedForecastIds.filter((id) => !favSet.has(id)));
    } else {
      // select all favorites
      onSelectionChange(Array.from(new Set([...selectedForecastIds, ...favIds])));
    }
  };

  const filteredFolders = useMemo(() => {
    if (!normalizedQuery) return folders;
    return folders
      .map((folder) => ({
        ...folder,
        forecasts: folder.forecasts.filter((x) =>
          x.name.toLowerCase().includes(normalizedQuery),
        ),
      }))
      .filter((f) => f.forecasts.length > 0);
  }, [folders, normalizedQuery]);

  const toggleFolder = (id: string) =>
    setOpenFolders((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleSelection = (id: string) => {
    const set = new Set(selectedForecastIds);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    onSelectionChange(Array.from(set));
  };

  const renderForecastRow = (f: Forecast) => (
    <label key={f.id} className="flex items-center gap-2 py-1">
      <input
        type="checkbox"
        checked={selectedForecastIds.includes(f.id)}
        onChange={() => toggleSelection(f.id)}
        className="accent-blue-600"
      />
      <span className="truncate" title={f.name}>
        {f.name}
      </span>
    </label>
  );

  const _scrollStyle = `
  .forecasting-control-scroll::-webkit-scrollbar { display: none; }
  `;

  return (
    <>
      <style>{_scrollStyle}</style>
      <aside
        className="h-full flex flex-col gap-3 bg-sidebar p-3 rounded-md forecasting-control-scroll overflow-y-auto"
        // hide scrollbars in Firefox and IE/Edge
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
      <div className="flex items-center gap-2">
        <SearchInput
        value={query}
        onChange={(e) => setQuery(String((e.target as HTMLInputElement).value))}
        placeholder="Search forecasts..."
        className="text-foreground"
        />
        <button
          type="button"
          onClick={() => onCreateFolder && onCreateFolder()}
          className="ml-2 inline-flex items-center gap-2 rounded-md border border-border bg-bg-card px-3 py-1 text-sm hover:bg-bg-card/80"
        >
          New Group
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium text-muted-foreground mb-1">Favorites</div>
          {favorites.length > 0 && (() => {
            const favIds = favorites.map((f) => f.id);
            const allSelected = favIds.length > 0 && favIds.every((id) => selectedForecastIds.includes(id));
            return (
              <button
                type="button"
                onClick={toggleFavoritesSelection}
                className="text-xs text-foreground/80 hover:text-foreground px-2 py-0.5 rounded"
                title={allSelected ? 'Unselect all favorites' : 'Select all favorites'}
              >
                {allSelected ? 'Unselect all' : 'Select all'}
              </button>
            );
          })()}
        </div>
        <div className="pl-1">
          {favorites.length ? favorites.map(renderForecastRow) : (
            <div className="text-xs text-muted-foreground">No favorites</div>
          )}
        </div>
      </div>

      <div className="mt-2 space-y-1">
        {filteredFolders.map((folder) => {
          const isOpen = !!openFolders[folder.id];
          const Icon = isOpen ? ChevronDown : ChevronRight;
          return (
            <div key={folder.id} className="border-b border-border pb-2">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleFolder(folder.id)}
                  className="flex items-center gap-2 py-1 text-left text-foreground hover:bg-bg-card/40 rounded-md px-1"
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{folder.name}</span>
                </button>
                {isOpen && folder.forecasts.length > 0 ? (
                  (() => {
                    const folderIds = folder.forecasts.map((f) => f.id);
                    const allSelected = folderIds.every((id) => selectedForecastIds.includes(id));
                    return (
                      <button
                        type="button"
                        onClick={() => {
                          const set = new Set(selectedForecastIds);
                          if (allSelected) {
                            // unselect all in this folder
                            for (const id of folderIds) set.delete(id);
                          } else {
                            // select all in this folder
                            for (const id of folderIds) set.add(id);
                          }
                          onSelectionChange(Array.from(set));
                        }}
                        className="text-xs text-foreground/80 hover:text-foreground px-2 py-0.5 rounded"
                        title={allSelected ? 'Unselect all items' : 'Select all items'}
                      >
                        {allSelected ? 'Unselect all' : 'Select all'}
                      </button>
                    );
                  })()
                ) : null}
              </div>
              {isOpen && (
                <div className="ml-6 mt-1">
                  {folder.forecasts.length ? (
                    folder.forecasts.map((f) => (
                      <label key={f.id} className="flex items-center gap-2 py-1 px-1 rounded hover:bg-bg-card/30 text-foreground">
                        <input
                          type="checkbox"
                          checked={selectedForecastIds.includes(f.id)}
                          onChange={() => toggleSelection(f.id)}
                          className="accent-blue-600"
                        />
                        <span className="truncate" title={f.name}>
                          {f.name}
                        </span>
                      </label>
                    ))
                  ) : (
                    <div className="text-xs text-muted-foreground">No forecasts</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
    </>
  );
};

export default ControlPanel;
