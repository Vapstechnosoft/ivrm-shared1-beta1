'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Eye } from 'lucide-react';

interface FileAttachment {
  ihwatT_FileName: string;
  ihwatT_Attachment: string;
  ihW_Attachment: string;
}

interface FileAttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachments: FileAttachment[];
}

export function FileAttachmentModal({ isOpen, onClose, attachments }: FileAttachmentModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(attachments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAttachments = attachments.slice(startIndex, endIndex);

  const handleDownload = (filePath: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (filePath: string) => {
    // Open file in new tab for preview
    window.open(filePath, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Homework Attachment Details</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {attachments.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">SL NO</TableHead>
                      <TableHead>File Name/URL</TableHead>
                      <TableHead className="w-24">View</TableHead>
                      <TableHead className="w-24">Download</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentAttachments.map((attachment, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-center">{startIndex + index + 1}</TableCell>
                        <TableCell className="text-left">{attachment.ihwatT_FileName}</TableCell>
                        <TableCell className="text-center">
                          {attachment.ihW_Attachment !== 'HyperLink' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePreview(attachment.ihwatT_Attachment)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          ) : (
                            <span className="text-gray-400">--</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {attachment.ihW_Attachment !== 'HyperLink' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(attachment.ihwatT_Attachment, attachment.ihwatT_FileName)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          ) : (
                            <span className="text-gray-400">
                              <Download className="h-4 w-4 opacity-50" />
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No attachments found</p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-600">
            <span className="text-red-500 font-semibold">Note:</span> Excel, ppt and Document files can't be viewed directly, only download is available
          </p>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
