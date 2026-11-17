'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: string | null;
  type: 'image' | 'video' | 'audio' | 'pdf' | 'other';
}

export function FilePreviewModal({ isOpen, onClose, file, type }: FilePreviewModalProps) {
  const renderContent = () => {
    if (!file) return null;

    switch (type) {
      case 'image':
        return (
          <div className="flex justify-center">
            <img
              src={file}
              alt="Preview"
              className="max-w-full max-h-[500px] object-contain"
            />
          </div>
        );
      
      case 'video':
        return (
          <div className="flex justify-center">
            <video
              src={file}
              controls
              className="max-w-full max-h-[500px]"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );
      
      case 'audio':
        return (
          <div className="flex justify-center">
            <audio
              src={file}
              controls
              className="w-full max-w-md"
            >
              Your browser does not support the audio tag.
            </audio>
          </div>
        );
      
      case 'pdf':
        return (
          <div className="w-full h-[500px]">
            <iframe
              src={file}
              className="w-full h-full"
              title="PDF Preview"
            />
          </div>
        );
      
      case 'other':
        return (
          <div className="text-center space-y-4">
            <p className="text-gray-600">This file type cannot be previewed.</p>
            <Button asChild>
              <a href={file} target="_blank" rel="noopener noreferrer">
                Open in New Tab
              </a>
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>File Preview</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {renderContent()}
        </div>
        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
