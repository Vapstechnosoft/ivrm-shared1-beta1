'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FileUploadModal({ isOpen, onClose }: FileUploadModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p>File upload modal content would go here.</p>
        </div>
        <div className="flex justify-end mt-6 space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button>
            Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
