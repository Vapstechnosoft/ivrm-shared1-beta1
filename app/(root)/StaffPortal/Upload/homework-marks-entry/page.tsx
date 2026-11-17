'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarIcon, Search, Eye, Edit, Download, Upload, FileText, Video, Image, Music, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { HomeworkMarksTable } from './_components/homework-marks-table';
import { MarksHistoryTable } from './_components/marks-history-table';
import { FilePreviewModal } from './_components/file-preview-modal';
import { StudentUploadModal } from './_components/student-upload-modal';

interface AcademicYear {
  asmaY_Id: number;
  asmaY_Year: string;
}

interface Class {
  asmcL_Id: number;
  asmcL_ClassName: string;
}

interface Section {
  asmS_Id: number;
  asmC_SectionName: string;
}

interface Subject {
  ISMS_Id: number;
  ISMS_SubjectName: string;
}

interface Topic {
  IHW_Id: number;
  IHW_Topic: string;
}

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

interface MarksHistory {
  AMST_Id: number;
  IHW_Id: number;
  studentname: string;
  ISMS_SubjectName: string;
  IHW_Topic: string;
  UpdatedDate: string;
  IHW_Assignment: string;
  IHWUPL_Marks: number;
}

interface HomeworkAttachment {
  ihwatT_FileName: string;
  ihwatT_Attachment: string;
  ihW_Attachment: string;
  ihW_Id: number;
}

interface StudentUploadFile {
  ihwupL_Id: number;
  ihwupL_FileName: string;
  ihwupL_Attachment: string;
  FilePath1?: string;
  Remarks?: string;
  file?: File;
}

export default function HomeworkMarksEntryPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [homeworkStudents, setHomeworkStudents] = useState<HomeworkStudent[]>([]);
  const [marksHistory, setMarksHistory] = useState<MarksHistory[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<number>(0);
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTerm1, setSearchTerm1] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'image' | 'video' | 'audio' | 'pdf' | 'other'>('other');
  
  // Modal states
  const [showHomeworkModal, setShowHomeworkModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedHomeworkAttachments, setSelectedHomeworkAttachments] = useState<HomeworkAttachment[]>([]);
  const [selectedStudentUploads, setSelectedStudentUploads] = useState<StudentUploadFile[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<HomeworkStudent | null>(null);

  // Edit mode states
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [studentSection, setStudentSection] = useState('');

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();

  const selectedYear = watch('asmaY_Id');
  const selectedClass = watch('asmcL_Id');
  const selectedSection = watch('ASMS_Id');
  const selectedSubject = watch('ISMS_Id');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      loadClasses();
    }
  }, [selectedYear]);

  useEffect(() => {
    if (selectedYear && selectedClass) {
      loadSections();
    }
  }, [selectedYear, selectedClass]);

  useEffect(() => {
    if (selectedYear && selectedClass && selectedSection) {
      loadSubjects();
    }
  }, [selectedYear, selectedClass, selectedSection]);

  const loadInitialData = async () => {
    try {
      // Mock data - replace with actual API calls
      setAcademicYears([
        { asmaY_Id: 1, asmaY_Year: '2024-2025' },
        { asmaY_Id: 2, asmaY_Year: '2025-2026' }
      ]);
      setMarksHistory([]);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading initial data:', error);
      setIsLoading(false);
    }
  };

  const loadClasses = async () => {
    try {
      // Mock data - replace with actual API call
      setClasses([
        { asmcL_Id: 1, asmcL_ClassName: 'Class 1' },
        { asmcL_Id: 2, asmcL_ClassName: 'Class 2' },
        { asmcL_Id: 3, asmcL_ClassName: 'Class 3' }
      ]);
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  };

  const loadSections = async () => {
    try {
      // Mock data - replace with actual API call
      setSections([
        { asmS_Id: 1, asmC_SectionName: 'Section A' },
        { asmS_Id: 2, asmC_SectionName: 'Section B' }
      ]);
    } catch (error) {
      console.error('Error loading sections:', error);
    }
  };

  const loadSubjects = async () => {
    try {
      // Mock data - replace with actual API call
      setSubjects([
        { ISMS_Id: 1, ISMS_SubjectName: 'Mathematics' },
        { ISMS_Id: 2, ISMS_SubjectName: 'Science' }
      ]);
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const getHomeworkList = async () => {
    if (!selectedYear || !selectedClass || !selectedSection) {
      alert('Please select Academic Year, Class, and Section');
      return;
    }

    try {
      setIsLoading(true);
      // Mock API call - replace with actual implementation
      const mockHomeworkStudents: HomeworkStudent[] = [
        {
          AMST_Id: 1,
          IHW_Id: 1,
          studentname: 'John Doe',
          ISMS_SubjectName: 'Mathematics',
          IHW_Topic: 'Algebra Basics',
          IHW_Assignment: 'Complete exercises 1-10',
          IHW_Date: '2025-01-15',
          CreatedDate: '2025-01-15',
          CreatedTime: '10:30',
          FilesCount: 2,
          checkedvalue: false
        },
        {
          AMST_Id: 2,
          IHW_Id: 1,
          studentname: 'Jane Smith',
          ISMS_SubjectName: 'Mathematics',
          IHW_Topic: 'Algebra Basics',
          IHW_Assignment: 'Complete exercises 1-10',
          IHW_Date: '2025-01-15',
          CreatedDate: '2025-01-15',
          CreatedTime: '11:45',
          FilesCount: 1,
          IHWUPL_Marks: 85,
          checkedvalue: true
        }
      ];

      const mockTopics: Topic[] = [
        { IHW_Id: 1, IHW_Topic: 'Algebra Basics' },
        { IHW_Id: 2, IHW_Topic: 'Geometry Fundamentals' }
      ];

      setHomeworkStudents(mockHomeworkStudents);
      setTopics(mockTopics);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading homework list:', error);
      setIsLoading(false);
    }
  };

  const handleTopicChange = (topicId: number) => {
    setSelectedTopic(topicId);
    // Filter homework list based on selected topic
    if (topicId === 0) {
      // Show all
    } else {
      // Filter by topic
    }
  };

  const toggleAllStudents = (checked: boolean) => {
    setHomeworkStudents(prev => prev.map(student => ({ ...student, checkedvalue: checked })));
  };

  const toggleStudent = (studentId: number, checked: boolean) => {
    setHomeworkStudents(prev => 
      prev.map(student => 
        student.AMST_Id === studentId 
          ? { ...student, checkedvalue: checked }
          : student
      )
    );
  };

  const updateStudentMarks = (studentId: number, marks: string) => {
    setHomeworkStudents(prev => 
      prev.map(student => 
        student.AMST_Id === studentId 
          ? { ...student, IHWUPL_Marks: parseFloat(marks) || 0 }
          : student
      )
    );
  };

  const updateStudentRemarks = (studentId: number, remarks: string) => {
    setHomeworkStudents(prev => 
      prev.map(student => 
        student.AMST_Id === studentId 
          ? { ...student, IHWUPL_StaffRemarks: remarks }
          : student
      )
    );
  };

  const handleFileUpload = async (file: File, studentId: number) => {
    setIsUploading(true);
    try {
      // Mock upload - replace with actual upload logic
      const mockFilePath = `/uploads/homework/${file.name}`;
      setHomeworkStudents(prev => prev.map(student => 
        student.AMST_Id === studentId 
          ? { ...student, IHWUPL_StaffUpload: mockFilePath, IHWUPL_FileName: file.name }
          : student
      ));
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const viewHomeworkAttachments = async (student: HomeworkStudent) => {
    try {
      // Mock API call - replace with actual implementation
      const mockAttachments: HomeworkAttachment[] = [
        {
          ihwatT_FileName: 'assignment.pdf',
          ihwatT_Attachment: '/uploads/homework/assignment.pdf',
          ihW_Attachment: 'File',
          ihW_Id: student.IHW_Id
        }
      ];
      setSelectedHomeworkAttachments(mockAttachments);
      setShowHomeworkModal(true);
    } catch (error) {
      console.error('Error loading homework attachments:', error);
    }
  };

  const viewStudentUploads = async (student: HomeworkStudent) => {
    try {
      // Mock API call - replace with actual implementation
      const mockStudentUploads: StudentUploadFile[] = [
        {
          ihwupL_Id: 1,
          ihwupL_FileName: 'student_work.pdf',
          ihwupL_Attachment: '/uploads/student/student_work.pdf'
        }
      ];
      setSelectedStudentUploads(mockStudentUploads);
      setSelectedStudent(student);
      setShowStudentModal(true);
    } catch (error) {
      console.error('Error loading student uploads:', error);
    }
  };

  const handlePreview = (filePath: string) => {
    setPreviewFile(filePath);
    const ext = filePath.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) {
      setPreviewType('image');
    } else if (['mp4', 'avi', 'mov'].includes(ext || '')) {
      setPreviewType('video');
    } else if (['mp3', 'wav', 'ogg'].includes(ext || '')) {
      setPreviewType('audio');
    } else if (['pdf'].includes(ext || '')) {
      setPreviewType('pdf');
    } else {
      setPreviewType('other');
    }
  };

  const saveMarks = async () => {
    const selectedStudents = homeworkStudents.filter(s => s.checkedvalue);
    if (selectedStudents.length === 0) {
      alert('Please select at least one student');
      return;
    }

    const invalidStudents = selectedStudents.filter(s => !s.IHWUPL_Marks || s.IHWUPL_Marks <= 0);
    if (invalidStudents.length > 0) {
      alert('Please enter marks for all selected students');
      return;
    }

    try {
      // Mock save - replace with actual API call
      console.log('Saving marks:', selectedStudents);
      alert('Marks saved successfully!');
      // Reload data or redirect as needed
    } catch (error) {
      console.error('Error saving marks:', error);
      alert('Error saving marks');
    }
  };

  const editHomeworkMarks = async (history: MarksHistory) => {
    try {
      // Mock API call - replace with actual implementation
      setIsEditMode(true);
      setStudentName(history.studentname);
      // Set other edit mode data
      // Load specific student homework for editing
    } catch (error) {
      console.error('Error loading homework for edit:', error);
    }
  };

  const clearData = () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Homework Marks Entry</h1>
      </div>

      {/* Search Form */}
      {!isEditMode && (
        <Card>
          <CardHeader>
            <CardTitle>Search Homework</CardTitle>
            <CardDescription>Select criteria to find homework for marks entry</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="asmaY_Id">Academic Year *</Label>
                <Select onValueChange={(value) => setValue('asmaY_Id', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Academic Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((year) => (
                      <SelectItem key={year.asmaY_Id} value={year.asmaY_Id.toString()}>
                        {year.asmaY_Year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="asmcL_Id">Class *</Label>
                <Select onValueChange={(value) => setValue('asmcL_Id', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.asmcL_Id} value={cls.asmcL_Id.toString()}>
                        {cls.asmcL_ClassName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ASMS_Id">Section *</Label>
                <Select onValueChange={(value) => setValue('ASMS_Id', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.asmS_Id} value={section.asmS_Id.toString()}>
                        {section.asmC_SectionName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ISMS_Id">Subject</Label>
                <Select onValueChange={(value) => setValue('ISMS_Id', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.ISMS_Id} value={subject.ISMS_Id.toString()}>
                        {subject.ISMS_SubjectName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={setFromDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={setToDate}
                      disabled={(date) => fromDate ? date < fromDate : false}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button onClick={getHomeworkList} disabled={isLoading}>
                Get List
              </Button>
              <Button variant="outline" onClick={clearData}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Mode Display */}
      {isEditMode && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Mode</CardTitle>
            <CardDescription>Editing marks for specific student</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Student Name</Label>
                <Input value={studentName} disabled />
              </div>
              <div className="space-y-2">
                <Label>Class</Label>
                <Input value={studentClass} disabled />
              </div>
              <div className="space-y-2">
                <Label>Section</Label>
                <Input value={studentSection} disabled />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Homework Marks Table */}
      {homeworkStudents.length > 0 && (
        <HomeworkMarksTable
          homeworkStudents={homeworkStudents}
          topics={topics}
          selectedTopic={selectedTopic}
          searchTerm={searchTerm}
          onTopicChange={handleTopicChange}
          onSearchChange={setSearchTerm}
          onToggleAll={toggleAllStudents}
          onToggleStudent={toggleStudent}
          onMarksChange={updateStudentMarks}
          onRemarksChange={updateStudentRemarks}
          onFileUpload={handleFileUpload}
          onViewHomework={viewHomeworkAttachments}
          onViewStudent={viewStudentUploads}
          onPreview={handlePreview}
          onSave={saveMarks}
          isUploading={isUploading}
        />
      )}

      {/* Marks History Table */}
      {marksHistory.length > 0 && (
        <MarksHistoryTable
          marksHistory={marksHistory}
          searchTerm={searchTerm1}
          onSearchChange={setSearchTerm1}
          onEdit={editHomeworkMarks}
        />
      )}

      {/* Modals */}
      <Dialog open={showHomeworkModal} onOpenChange={setShowHomeworkModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Homework Attachment Details</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SL NO</TableHead>
                  <TableHead>File Name/URL</TableHead>
                  <TableHead>View/Click</TableHead>
                  <TableHead>Download</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedHomeworkAttachments.map((attachment, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{attachment.ihwatT_FileName}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreview(attachment.ihwatT_Attachment)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(attachment.ihwatT_Attachment, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end mt-6">
            <Button variant="outline" onClick={() => setShowHomeworkModal(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <StudentUploadModal
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        studentUploads={selectedStudentUploads}
        selectedStudent={selectedStudent}
        onPreview={handlePreview}
      />

      <FilePreviewModal
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
        type={previewType}
      />
    </div>
  );
}
