'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, Eye, Download } from 'lucide-react';

interface StudentUploadFile {
  ihwupL_Id: number;
  ihwupL_FileName: string;
  ihwupL_Attachment: string;
  FilePath1?: string;
  Remarks?: string;
  file?: File;
}

interface HomeworkStudent {
  AMST_Id: number;
  IHW_Id: number;
  studentname: string;
  ISMS_SubjectName: string;
  IHW_Topic: string;
  IHW_Assignment: string;
}

interface StudentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentUploads: StudentUploadFile[];
  selectedStudent: HomeworkStudent | null;
  onPreview: (filePath: string) => void;
}

export function StudentUploadModal({ isOpen, onClose, studentUploads, selectedStudent, onPreview }: StudentUploadModalProps) {
  const [uploads, setUploads] = useState<StudentUploadFile[]>(studentUploads);

  const handleFileUpload = (index: number, file: File) => {
    const newUploads = [...uploads];
    newUploads[index] = {
      ...newUploads[index],
      file,
      FilePath1: URL.createObjectURL(file)
    };
    setUploads(newUploads);
  };

  const handleRemarksChange = (index: number, remarks: string) => {
    const newUploads = [...uploads];
    newUploads[index] = {
      ...newUploads[index],
      Remarks: remarks
    };
    setUploads(newUploads);
  };

  const handleAddAndClose = () => {
    // Mock save - replace with actual API call
    console.log('Saving student uploads:', uploads);
    onClose();
  };

  const handleDownload = (filePath: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Student Upload Homework Details</DialogTitle>
        </DialogHeader>
        
        {selectedStudent && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-semibold">Student:</span> {selectedStudent.studentname}
              </div>
              <div>
                <span className="font-semibold">Subject:</span> {selectedStudent.ISMS_SubjectName}
              </div>
              <div>
                <span className="font-semibold">Topic:</span> {selectedStudent.IHW_Topic}
              </div>
            </div>
          </div>
        )}

        <div className="mt-4">
          <div className="overflow-x-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">SL NO</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>Attachment View</TableHead>
                  <TableHead>Download</TableHead>
                  <TableHead>Upload</TableHead>
                  <TableHead>View</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploads.map((upload, index) => (
                  <TableRow key={upload.ihwupL_Id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="text-left">{upload.ihwupL_FileName}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPreview(upload.ihwupL_Attachment)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(upload.ihwupL_Attachment, upload.ihwupL_FileName)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center space-x-2">
                        <Input
                          type="file"
                          accept="video/mp4,audio/*,video/x-ms-wmv,image/*,application/pdf,application/msword,application/vnd.ms-excel,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(index, file);
                          }}
                          className="hidden"
                          id={`upload-file-${index}`}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById(`upload-file-${index}`)?.click()}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {upload.FilePath1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onPreview(upload.FilePath1!)}
                          className="text-red-600"
                        >
                          view
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Textarea
                        placeholder="Enter remarks"
                        value={upload.Remarks || ''}
                        onChange={(e) => handleRemarksChange(index, e.target.value)}
                        className="min-h-[60px] resize-none"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-600">
            <span className="text-red-500 font-semibold">Note:</span> Excel, ppt and Document Can't View. only Download
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleAddAndClose}>
              Add & Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
