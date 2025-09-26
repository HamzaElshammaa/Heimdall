import React, { useState, useCallback } from 'react';
import { mockFolders, type Folder } from './data';
import ControlPanel from './components/ControlPanel';
import DisplayArea from './components/DisplayArea';
import { LayoutGrid, Maximize2 } from 'lucide-react';

const ForecastingPortal: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>(mockFolders);
  const [selectedForecastIds, setSelectedForecastIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'compact' | 'expanded'>('compact');

  const toggleView = useCallback(() => {
    setViewMode((v) => (v === 'compact' ? 'expanded' : 'compact'));
  }, []);

  return (
    // make the page fill the viewport so internal columns can scroll independently
    <div className="p-6 h-screen flex flex-col min-h-0">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Forecasting</h1>
        </div>
        <div>
          <button
            type="button"
            onClick={toggleView}
            title={viewMode === 'compact' ? 'Switch to expanded view' : 'Switch to compact view'}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-bg-card px-3 py-1 text-sm hover:bg-bg-card/80"
          >
            {viewMode === 'compact' ? <LayoutGrid className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            <span>{viewMode === 'compact' ? 'Compact' : 'Expanded'}</span>
          </button>
        </div>
      </header>

      <div className="mt-4 grid grid-cols-12 gap-6 min-h-0 flex-1">
        <div className="col-span-12 md:col-span-4 xl:col-span-3 min-h-0">
          <ControlPanel
            folders={folders}
            selectedForecastIds={selectedForecastIds}
            onSelectionChange={setSelectedForecastIds}
          />
        </div>
        <div className="col-span-12 md:col-span-8 xl:col-span-9 min-h-0">
          <div className="min-h-0 h-full overflow-auto scrollbar-none">
          <DisplayArea
            folders={folders}
            selectedForecastIds={selectedForecastIds}
            viewMode={viewMode}
            onToggleFavorite={(id) => {
              setFolders((prev) =>
                prev.map((folder) => ({
                  ...folder,
                  forecasts: folder.forecasts.map((f) =>
                    f.id === id ? { ...f, isFavorite: !f.isFavorite } : f,
                  ),
                })),
              );
            }}
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastingPortal;
