import React, { useMemo, useState } from 'react';
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

export type CreateFolderModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (folder: Folder) => void;
  allForecasts: Forecast[]; // flattened list
};

const CreateFolderModal: React.FC<CreateFolderModalProps> = ({ open, onClose, onSave, allForecasts }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const leftItems = useMemo(() => {
    return allForecasts.filter((f) => selectedIds.includes(f.id));
  }, [allForecasts, selectedIds]);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Create new group</DialogTitle>
        </DialogHeader>

        <div className="mb-3">
          <Input value={groupName} onChange={(e) => setGroupName(String((e.target as HTMLInputElement).value))} placeholder="Group name" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="min-h-[240px] border border-border rounded p-2 bg-card">
            <div className="text-sm text-muted-foreground mb-2">Selected</div>
            <div className="space-y-1">
              {leftItems.length ? (
                leftItems.map((f) => (
                  <div key={f.id} className="text-sm p-1 rounded hover:bg-bg-card/30">{f.name}</div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No items selected</div>
              )}
            </div>
          </div>

          <div className="min-h-[240px] border border-border rounded p-2 bg-card">
            <div className="text-sm text-muted-foreground mb-2">Available</div>
            <div className="space-y-1 max-h-[400px] overflow-auto">
              {allForecasts.map((f) => (
                <label key={f.id} className="flex items-center gap-2">
                  <input type="checkbox" checked={selectedIds.includes(f.id)} onChange={() => toggleSelect(f.id)} />
                  <span className="truncate" title={f.name}>{f.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => { onClose(); setSelectedIds([]); setGroupName(''); }}>Cancel</Button>
          <Button
            onClick={() => {
              if (!groupName.trim() || selectedIds.length === 0) return;
              const newFolder: Folder = {
                id: `fld-${Date.now()}`,
                name: groupName.trim(),
                forecasts: allForecasts.filter((f) => selectedIds.includes(f.id)),
              };
              onSave(newFolder);
              onClose();
              setSelectedIds([]);
              setGroupName('');
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderModal;

