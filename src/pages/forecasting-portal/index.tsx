import React, { useState, useCallback } from 'react';
import './font.less';
import { mockFolders, type Folder } from './data';
import ControlPanel from './components/ControlPanel';
import CreateFolderModal from './components/CreateFolderModal';
import DisplayArea from './components/DisplayArea';
import { LayoutGrid, Maximize2 } from 'lucide-react';

const ForecastingPortal: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>(mockFolders);
  // Default select all favorites on initial render
  const initialFavoriteIds = React.useMemo(
    () => mockFolders.flatMap(f => f.forecasts.filter(fc => fc.isFavorite).map(fc => fc.id)),
    []
  );
  const [selectedForecastIds, setSelectedForecastIds] = useState<string[]>(initialFavoriteIds);
  const [viewMode, setViewMode] = useState<'compact' | 'expanded'>('compact');
  const [creatingFolder, setCreatingFolder] = useState(false);

  const toggleView = useCallback(() => {
    setViewMode((v) => (v === 'compact' ? 'expanded' : 'compact'));
  }, []);

  return (
    // make the page fill the viewport so internal columns can scroll independently
  <div className="p-6 h-screen flex flex-col min-h-0 font-forecasting-portal">
      <header className="flex items-start justify-between">
        <div>
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
            onCreateFolder={() => setCreatingFolder(true)}
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
      <CreateFolderModal
        open={creatingFolder}
        allForecasts={folders.flatMap((f) => f.forecasts)}
        onClose={() => setCreatingFolder(false)}
        onSave={(newFolder) => setFolders((prev) => [...prev, newFolder])}
      />
    </div>
  );
};

export default ForecastingPortal;
