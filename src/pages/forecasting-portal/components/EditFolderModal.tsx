import React, { useMemo, useState, useEffect } from 'react';
import type { Folder, Forecast } from '../data';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export type EditFolderModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (folderId: string, updatedForecasts: Forecast[]) => void;
  allForecasts: Forecast[]; // flattened list
  folder: Folder | null; // the folder being edited
};

const EditFolderModal: React.FC<EditFolderModalProps> = ({ 
  open, 
  onClose, 
  onSave, 
  allForecasts,
  folder,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Initialize selectedIds when folder changes
  useEffect(() => {
    if (folder) {
      setSelectedIds(folder.forecasts.map((f) => f.id));
    }
  }, [folder]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectedItems = useMemo(() => {
    return allForecasts.filter((f) => selectedIds.includes(f.id));
  }, [allForecasts, selectedIds]);

  const handleSave = () => {
    if (!folder || selectedIds.length === 0) return;
    const updatedForecasts = allForecasts.filter((f) => selectedIds.includes(f.id));
    onSave(folder.id, updatedForecasts);
    onClose();
  };

  if (!open || !folder) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] text-xs">
        <DialogHeader>
          <DialogTitle className="text-base">Edit group: {folder.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div className="min-h-[240px] border border-border rounded p-2 bg-card">
            <div className="text-[11px] text-muted-foreground mb-2">Available Graphs</div>
            <div className="space-y-1 max-h-[400px] overflow-auto">
              {allForecasts.map((f) => (
                <label key={f.id} className="flex items-center gap-1 text-[11px] cursor-pointer hover:bg-bg-card/30 p-1 rounded">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(f.id)} 
                    onChange={() => toggleSelect(f.id)}
                    className="accent-blue-600"
                  />
                  <span className="truncate" title={f.name}>{f.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="min-h-[240px] border border-border rounded p-2 bg-card">
            <div className="text-[11px] text-muted-foreground mb-2">Selected ({selectedItems.length})</div>
            <div className="space-y-1 max-h-[400px] overflow-auto">
              {selectedItems.length ? (
                selectedItems.map((f) => (
                  <div key={f.id} className="text-[11px] p-1 rounded hover:bg-bg-card/30 truncate" title={f.name}>
                    {f.name}
                  </div>
                ))
              ) : (
                <div className="text-[11px] text-muted-foreground">No items selected</div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSave}
            disabled={selectedIds.length === 0}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditFolderModal;
