import React, { useMemo, useState } from 'react';
import type { Folder, Forecast } from '../data';
import { ChevronDown, ChevronRight, Star } from 'lucide-react';

export type ControlPanelProps = {
  folders: Folder[];
  selectedForecastIds: string[];
  onSelectionChange: (ids: string[]) => void;
  /** current search query provided by parent toolbar */
  query: string;
};

const ControlPanel: React.FC<ControlPanelProps> = ({
  folders,
  selectedForecastIds,
  onSelectionChange,
  query,
}) => {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  const normalizedQuery = query.trim().toLowerCase();

  const favorites = useMemo<Forecast[]>(() => {
    const all = folders.flatMap((f) => f.forecasts);
    const favs = all.filter((x) => x.isFavorite);
    if (!normalizedQuery) return favs;
    return favs.filter((x) => x.name.toLowerCase().includes(normalizedQuery));
  }, [folders, normalizedQuery]);

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
        className="h-full flex flex-col gap-3 bg-sidebar p-3 rounded-md forecasting-control-scroll overflow-y-auto text-xs"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >

      {/* Favorites as a normal folder */}
      <div className="mt-1 space-y-1">
        {(() => {
          const favId = '__favorites__';
          const isOpen = openFolders[favId] ?? true; // default open
          const Icon = isOpen ? ChevronDown : ChevronRight;
          return (
            <div className="border-b border-border pb-2" key={favId}>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleFolder(favId)}
                  className="flex items-center gap-1 py-0.5 text-left text-foreground hover:bg-bg-card/40 rounded-md px-1 min-w-0 flex-1 text-[11px]"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 shrink-0" />
                  <span className="font-medium truncate" title="Favorites">Favorites</span>
                </button>
                {isOpen && favorites.length > 0 ? (
                  (() => {
                    const favIds = favorites.map((f) => f.id);
                    const allSelected = favIds.length > 0 && favIds.every((id) => selectedForecastIds.includes(id));
                    return (
                      <button
                        type="button"
                        onClick={() => {
                          const set = new Set(selectedForecastIds);
                          if (allSelected) {
                            for (const id of favIds) set.delete(id);
                          } else {
                            for (const id of favIds) set.add(id);
                          }
                          onSelectionChange(Array.from(set));
                        }}
                        className="text-[10px] text-foreground/80 hover:text-foreground px-1.5 py-0.5 rounded"
                        title={allSelected ? 'Unselect all favorites' : 'Select all favorites'}
                      >
                        {allSelected ? 'Unselect all' : 'Select all'}
                      </button>
                    );
                  })()
                ) : null}
              </div>
              {isOpen && (
                <div className="ml-6 mt-1">
                  {favorites.length ? (
                    favorites.map((f) => (
                      <label key={f.id} className="flex items-center gap-1 py-0.5 px-1 rounded hover:bg-bg-card/30 text-foreground text-[11px]">
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
                    <div className="text-[10px] text-muted-foreground">No favorites</div>
                  )}
                </div>
              )}
            </div>
          );
        })()}
      </div>

  <div className="mt-2 space-y-1">
        {filteredFolders.map((folder) => {
          const isOpen = !!openFolders[folder.id];
          const Icon = isOpen ? ChevronDown : ChevronRight;
          return (
            <div key={folder.id} className="border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleFolder(folder.id)}
                  className="flex items-center gap-1 py-0.5 text-left text-foreground hover:bg-bg-card/40 rounded-md px-1 min-w-0 flex-1 text-[11px]"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="font-medium truncate" title={folder.name}>{folder.name}</span>
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
                        className="text-[10px] text-foreground/80 hover:text-foreground px-1.5 py-0.5 rounded shrink-0"
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
                      <label key={f.id} className="flex items-center gap-1 py-0.5 px-1 rounded hover:bg-bg-card/30 text-foreground text-[11px]">
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
                    <div className="text-[10px] text-muted-foreground">No forecasts</div>
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
