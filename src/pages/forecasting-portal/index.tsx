import React, { useState } from 'react';
import { mockFolders, type Folder } from './data';
import ControlPanel from './components/ControlPanel';
import DisplayArea from './components/DisplayArea';

const ForecastingPortal: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>(mockFolders);
  const [selectedForecastIds, setSelectedForecastIds] = useState<string[]>([]);

  return (
    <div className="p-6 h-full flex flex-col min-h-0">
      <header>
        <h1 className="text-2xl font-semibold">Forecasting Portal</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome to the forecasting portal. Build and monitor forecasts here.
        </p>
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
          <DisplayArea
            folders={folders}
            selectedForecastIds={selectedForecastIds}
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
  );
};

export default ForecastingPortal;
