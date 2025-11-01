import React, { useState, useCallback } from 'react';
import './font.less';
import { mockFolders, type Folder } from './data';
import ControlPanel from './components/ControlPanel';
import CreateFolderModal from './components/CreateFolderModal';
import EditFolderModal from './components/EditFolderModal';
import ConfirmDeleteDialog from './components/ConfirmDeleteDialog';
import DisplayArea from './components/DisplayArea';
import { LayoutGrid, Maximize2, Filter, User, Clock } from 'lucide-react';
import { SearchInput } from '@/components/ui/input';

const ForecastingPortal: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>(mockFolders);
  const initialFavoriteIds = React.useMemo(
    () =>
      mockFolders.flatMap((f) =>
        f.forecasts.filter((fc) => fc.isFavorite).map((fc) => fc.id)
      ),
    []
  );
  const [selectedForecastIds, setSelectedForecastIds] = useState<string[]>(
    initialFavoriteIds
  );
  const [viewMode, setViewMode] = useState<'compact' | 'expanded'>('compact');
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [deletingFolder, setDeletingFolder] = useState<Folder | null>(null);
  const [query, setQuery] = useState('');

  // Get unique forecasts across all folders (deduplicated by ID)
  const allUniqueForecasts = React.useMemo(() => {
    const forecastMap = new Map();
    folders.forEach((folder) => {
      folder.forecasts.forEach((forecast) => {
        if (!forecastMap.has(forecast.id)) {
          forecastMap.set(forecast.id, forecast);
        }
      });
    });
    return Array.from(forecastMap.values());
  }, [folders]);

  const toggleView = useCallback(() => {
    setViewMode((v) => (v === 'compact' ? 'expanded' : 'compact'));
  }, []);

  return (
    <div className="p-6 h-screen flex flex-col min-h-0 font-forecasting-portal">
      <header className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-3 min-w-0">
          <SearchInput
            style={{ width: '258px' }}
            value={query}
            onChange={(e) =>
              setQuery(String((e.target as HTMLInputElement).value))
            }
            placeholder="         Search forecasts..."
            className="flex-grow max-w-[520px]  text-foreground text-[11px] h-8 rounded-md border border-border bg-bg-card px-3 focus:outline-none focus:ring-0"
          />
          <button
            type="button"
            onClick={() => setCreatingFolder(true)}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-bg-card px-3 h-8 hover:bg-bg-card/80 text-[11px]"
            style={{ lineHeight: '1' }}
          >
            New Group
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleView}
            title={
              viewMode === 'compact'
                ? 'Switch to expanded view'
                : 'Switch to compact view'
            }
            className="inline-flex items-center gap-2 rounded-md border border-border bg-bg-card px-3 h-8 text-[11px] hover:bg-bg-card/80 text-foreground"
          >
            {viewMode === 'compact' ? (
              <LayoutGrid className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
            <span>{viewMode === 'compact' ? 'Compact' : 'Expanded'}</span>
          </button>
          <button
            type="button"
            title="Filter"
            aria-label="Filter"
            className="inline-flex items-center justify-center rounded-md border border-border bg-bg-card px-3 h-8 hover:bg-bg-card/80 text-[11px] text-foreground"
          >
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </button>
          <button
            type="button"
            title="Users"
            aria-label="Users"
            className="inline-flex items-center justify-center rounded-md border border-border bg-bg-card px-3 h-8 hover:bg-bg-card/80 text-[11px] text-foreground"
          >
            <User className="h-4 w-4" />
            <span className="sr-only">Users</span>
          </button>
          <button
            type="button"
            title="Recent"
            aria-label="Recent"
            className="inline-flex items-center justify-center rounded-md border border-border bg-bg-card px-3 h-8 hover:bg-bg-card/80 text-[11px] text-foreground"
          >
            <Clock className="h-4 w-4" />
            <span className="sr-only">Recent</span>
          </button>
        </div>
      </header>

      <div className="mt-4 grid grid-cols-12 gap-6 min-h-0 flex-1">
        <div className="col-span-12 md:col-span-4 xl:col-span-3 min-h-0">
          <ControlPanel
            folders={folders}
            selectedForecastIds={selectedForecastIds}
            onSelectionChange={setSelectedForecastIds}
            query={query}
            onEditFolder={(folder) => setEditingFolder(folder)}
            onDeleteFolder={(folder) => setDeletingFolder(folder)}
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
                      f.id === id
                        ? { ...f, isFavorite: !f.isFavorite }
                        : f
                    ),
                  }))
                );
              }}
            />
          </div>
        </div>
      </div>
      <CreateFolderModal
        open={creatingFolder}
        allForecasts={allUniqueForecasts}
        onClose={() => setCreatingFolder(false)}
        onSave={(newFolder) => setFolders((prev) => [...prev, newFolder])}
      />
      <EditFolderModal
        open={editingFolder !== null}
        folder={editingFolder}
        allForecasts={allUniqueForecasts}
        onClose={() => setEditingFolder(null)}
        onSave={(folderId, updatedForecasts) => {
          setFolders((prev) =>
            prev.map((folder) =>
              folder.id === folderId
                ? { ...folder, forecasts: updatedForecasts }
                : folder
            )
          );
          setEditingFolder(null);
        }}
      />
      <ConfirmDeleteDialog
        open={deletingFolder !== null}
        groupName={deletingFolder?.name || ''}
        onClose={() => setDeletingFolder(null)}
        onConfirm={() => {
          if (deletingFolder) {
            setFolders((prev) => prev.filter((f) => f.id !== deletingFolder.id));
            // Remove deleted folder's forecasts from selection if they're not in other folders
            const remainingForecastIds = folders
              .filter((f) => f.id !== deletingFolder.id)
              .flatMap((f) => f.forecasts.map((fc) => fc.id));
            setSelectedForecastIds((prev) =>
              prev.filter((id) => remainingForecastIds.includes(id))
            );
            setDeletingFolder(null);
          }
        }}
      />
    </div>
  );
};

export default ForecastingPortal;
