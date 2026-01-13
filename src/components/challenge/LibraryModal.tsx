import { LibraryPanel, type LibraryTab } from '@/components/library/LibraryPanel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface LibraryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: LibraryTab;
}

export const LibraryModal = ({ open, onOpenChange, defaultTab }: LibraryModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Biblioteca de Recursos</DialogTitle>
        </DialogHeader>
        <LibraryPanel defaultTab={defaultTab} />
      </DialogContent>
    </Dialog>
  );
};
