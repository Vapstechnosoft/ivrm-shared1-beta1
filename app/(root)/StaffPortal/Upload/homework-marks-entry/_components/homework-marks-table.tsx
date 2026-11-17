'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Edit, Upload, Search } from 'lucide-react';

interface HomeworkStudent {
  AMST_Id: number;
  IHW_Id: number;
  studentname: string;
  ISMS_SubjectName: string;
  IHW_Topic: string;
  IHW_Assignment: string;
  IHW_Date: string;
  CreatedDate: string;
  CreatedTime: string;
  FilesCount: number;
  IHWUPL_Marks?: number;
  IHWUPL_StaffRemarks?: string;
  IHWUPL_StaffUpload?: string;
  IHWUPL_FileName?: string;
  IHWUPL_Id?: number;
  checkedvalue: boolean;
  uploadfilestemp?: any[];
}

interface Topic {
  IHW_Id: number;
  IHW_Topic: string;
}

interface HomeworkMarksTableProps {
  homeworkStudents: HomeworkStudent[];
  topics: Topic[];
  selectedTopic: number;
  searchTerm: string;
  onTopicChange: (topicId: number) => void;
  onSearchChange: (term: string) => void;
  onToggleAll: (checked: boolean) => void;
  onToggleStudent: (studentId: number, checked: boolean) => void;
  onMarksChange: (studentId: number, marks: string) => void;
  onRemarksChange: (studentId: number, remarks: string) => void;
  onFileUpload: (file: File, studentId: number) => void;
  onViewHomework: (student: HomeworkStudent) => void;
  onViewStudent: (student: HomeworkStudent) => void;
  onPreview: (filePath: string) => void;
  onSave: () => void;
  isUploading: boolean;
}

export function HomeworkMarksTable({
  homeworkStudents,
  topics,
  selectedTopic,
  searchTerm,
  onTopicChange,
  onSearchChange,
  onToggleAll,
  onToggleStudent,
  onMarksChange,
  onRemarksChange,
  onFileUpload,
  onViewHomework,
  onViewStudent,
  onPreview,
  onSave,
  isUploading
}: HomeworkMarksTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const allSelected = homeworkStudents.length > 0 && homeworkStudents.every(s => s.checkedvalue);
  const someSelected = homeworkStudents.some(s => s.checkedvalue) && !allSelected;

  // Filter students based on search and topic
  const filteredStudents = homeworkStudents.filter(student => {
    const matchesSearch = !searchTerm || 
      student.studentname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.ISMS_SubjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.IHW_Topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.IHW_Assignment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTopic = selectedTopic === 0 || student.IHW_Id === selectedTopic;

    return matchesSearch && matchesTopic;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, studentId: number) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file, studentId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Student Homework Update List</CardTitle>
            <CardDescription>Enter marks and upload feedback for student homework</CardDescription>
          </div>
          <Badge variant="secondary">
            Total Records: {filteredStudents.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Topic Filter */}
        {topics.length > 0 && (
          <div className="flex items-center space-x-4">
            <div className="w-48">
              <Select value={selectedTopic.toString()} onValueChange={(value) => onTopicChange(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">All</SelectItem>
                  {topics.map((topic) => (
                    <SelectItem key={topic.IHW_Id} value={topic.IHW_Id.toString()}>
                      {topic.IHW_Topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search here..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* Search Headers */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-50">
                <TableHead className="p-2">
                  <Input
                    placeholder="Search Student Name"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="h-8"
                  />
                </TableHead>
                <TableHead className="p-2">
                  <Input
                    placeholder="Search Subject Name"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="h-8"
                  />
                </TableHead>
                <TableHead className="p-2">
                  <Input
                    placeholder="Search Topic"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="h-8"
                  />
                </TableHead>
                <TableHead className="p-2">
                  <Input
                    placeholder="Search Assignment"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="h-8"
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        {/* Main Table */}
        <div className="overflow-x-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={onToggleAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="w-16">SL NO</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Subject Name</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>H.W Date</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>H.W Upload</TableHead>
                <TableHead>ST Upload</TableHead>
                <TableHead className="w-24">Enter Marks</TableHead>
                <TableHead>Issue Upload</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentStudents.map((student, index) => (
                <TableRow key={student.AMST_Id}>
                  <TableCell>
                    <Checkbox
                      checked={student.checkedvalue}
                      onCheckedChange={(checked) => onToggleStudent(student.AMST_Id, checked as boolean)}
                      aria-label={`Select ${student.studentname}`}
                    />
                  </TableCell>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell className="text-left">{student.studentname}</TableCell>
                  <TableCell className="text-left">{student.ISMS_SubjectName}</TableCell>
                  <TableCell className="text-left">{student.IHW_Topic}</TableCell>
                  <TableCell className="text-left max-w-xs truncate">{student.IHW_Assignment}</TableCell>
                  <TableCell>{student.IHW_Date}</TableCell>
                  <TableCell>{student.CreatedDate}</TableCell>
                  <TableCell>{student.CreatedTime}</TableCell>
                  <TableCell>
                    {student.FilesCount === 0 ? (
                      <span className="text-gray-400">---</span>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewHomework(student)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewStudent(student)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      placeholder="Enter Marks"
                      value={student.IHWUPL_Marks || ''}
                      onChange={(e) => onMarksChange(student.AMST_Id, e.target.value)}
                      disabled={!student.checkedvalue}
                      className="w-20"
                      min="0"
                      max="100"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {student.checkedvalue && (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="file"
                            accept="video/mp4,audio/*,video/x-ms-wmv,image/*,application/pdf,application/msword,application/vnd.ms-excel,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={(e) => handleFileSelect(e, student.AMST_Id)}
                            className="hidden"
                            id={`file-${student.AMST_Id}`}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById(`file-${student.AMST_Id}`)?.click()}
                            disabled={isUploading}
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {student.IHWUPL_StaffUpload && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onPreview(student.IHWUPL_StaffUpload!)}
                          className="text-red-600"
                        >
                          view
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Textarea
                      placeholder="Enter Remarks"
                      value={student.IHWUPL_StaffRemarks || ''}
                      onChange={(e) => onRemarksChange(student.AMST_Id, e.target.value)}
                      disabled={!student.checkedvalue}
                      className="min-h-[60px] resize-none"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredStudents.length)} of {filteredStudents.length} entries
            </div>
            <div className="flex items-center space-x-2">
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
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-center mt-6">
          <Button onClick={onSave} disabled={isUploading || !homeworkStudents.some(s => s.checkedvalue)}>
            {isUploading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
