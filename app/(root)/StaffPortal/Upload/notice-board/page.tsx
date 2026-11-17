'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Search, Eye, Download, Upload, Plus, Minus, Edit, Trash2, Users, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { NoticeListTable } from './_components/notice-list-table';
import { FileAttachmentModal } from './_components/file-attachment-modal';
import { StudentSelectionModal } from './_components/student-selection-modal';
import { StaffSelectionModal } from './_components/staff-selection-modal';

interface AcademicYear {
  asmaY_Id: number;
  asmaY_Year: string;
}

interface Class {
  asmcL_Id: number;
  asmcL_ClassName: string;
  selected?: boolean;
}

interface Section {
  asmS_Id: number;
  asmcL_ClassName: string;
  ASMC_SectionName: string;
  selected?: boolean;
}

interface Student {
  amsT_Id: number;
  studentname: string;
  AMST_AdmNo: string;
  selected?: boolean;
}

interface Department {
  HRMDC_ID: number;
  HRMDC_Name: string;
  selected?: boolean;
}

interface Designation {
  HRMDES_Id: number;
  HRMDES_DesignationName: string;
  selected?: boolean;
}

interface Employee {
  HRME_Id: number;
  userEmpName: string;
  HRMD_DepartmentName: string;
  empck?: boolean;
}

interface Notice {
  intB_Id: number;
  intB_Title: string;
  intB_Description: string;
  intB_StartDate: string;
  intB_EndDate: string;
  intB_DisplayDate?: string;
  intB_ActiveFlag: boolean;
  intB_ToStudentFlg: boolean;
  intB_ToStaffFlg: boolean;
  ntB_TTSylabusFlg: string;
  intB_Attachment?: string;
}

interface DocumentFile {
  id: string;
  INTBFL_FilePath?: string;
  FileName?: string;
  file?: File;
}

export default function NoticeBoardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  
  // Form states
  const [checkStudent, setCheckStudent] = useState(true);
  const [checkStaff, setCheckStaff] = useState(false);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<number>(0);
  const [noticeType, setNoticeType] = useState<string>('');
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeDescription, setNoticeDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [displayDate, setDisplayDate] = useState<Date | undefined>();
  const [useDisplayDate, setUseDisplayDate] = useState(false);
  const [selectStudent, setSelectStudent] = useState(false);
  const [selectFeeDefaulters, setSelectFeeDefaulters] = useState(false);
  const [selectRoute, setSelectRoute] = useState(false);
  
  // File upload states
  const [documentFiles, setDocumentFiles] = useState<DocumentFile[]>([{ id: 'document' }]);
  const [urlDocuments, setUrlDocuments] = useState<DocumentFile[]>([{ id: 'url' }]);
  const [useUrl, setUseUrl] = useState(false);
  const [mainAttachment, setMainAttachment] = useState<string>('');
  const [mainAttachmentFile, setMainAttachmentFile] = useState<File | null>(null);
  
  // Modal states
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedAttachments, setSelectedAttachments] = useState<DocumentFile[]>([]);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>();
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>();

  // Selection states
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
  const [selectedSections, setSelectedSections] = useState<number[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
  const [selectedDesignations, setSelectedDesignations] = useState<number[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);

  // Search states for modals
  const [classSearchTerm, setClassSearchTerm] = useState('');
  const [sectionSearchTerm, setSectionSearchTerm] = useState('');
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState('');
  const [designationSearchTerm, setDesignationSearchTerm] = useState('');
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Mock data - replace with actual API calls
      setAcademicYears([
        { asmaY_Id: 1, asmaY_Year: '2024-2025' },
        { asmaY_Id: 2, asmaY_Year: '2025-2026' }
      ]);

      setClasses([
        { asmcL_Id: 1, asmcL_ClassName: 'Class 1', selected: false },
        { asmcL_Id: 2, asmcL_ClassName: 'Class 2', selected: false },
        { asmcL_Id: 3, asmcL_ClassName: 'Class 3', selected: false }
      ]);

      setDepartments([
        { HRMDC_ID: 1, HRMDC_Name: 'Teaching', selected: false },
        { HRMDC_ID: 2, HRMDC_Name: 'Administration', selected: false }
      ]);

      setDesignations([
        { HRMDES_Id: 1, HRMDES_DesignationName: 'Teacher', selected: false },
        { HRMDES_Id: 2, HRMDES_DesignationName: 'Principal', selected: false }
      ]);

      setNotices([
        {
          intB_Id: 1,
          intB_Title: 'Annual Day Notice',
          intB_Description: 'Annual day celebration will be held on...',
          intB_StartDate: '2025-01-15',
          intB_EndDate: '2025-01-30',
          intB_ActiveFlag: true,
          intB_ToStudentFlg: true,
          intB_ToStaffFlg: false,
          ntB_TTSylabusFlg: 'O'
        }
      ]);

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading initial data:', error);
      setIsLoading(false);
    }
  };

  const handleAudienceChange = (type: 'student' | 'staff', checked: boolean) => {
    if (type === 'student') {
      setCheckStudent(checked);
      if (checked) {
        setCheckStaff(false);
        setSelectStudent(true);
      }
    } else {
      setCheckStaff(checked);
      if (checked) {
        setCheckStudent(false);
      }
    }
  };

  const addDocumentFile = () => {
    if (documentFiles.length < 30) {
      setDocumentFiles([...documentFiles, { id: `document${documentFiles.length + 1}` }]);
    }
  };

  const removeDocumentFile = (index: number) => {
    if (documentFiles.length > 1) {
      setDocumentFiles(documentFiles.filter((_, i) => i !== index));
    }
  };

  const addUrlDocument = () => {
    if (urlDocuments.length < 30) {
      setUrlDocuments([...urlDocuments, { id: `url${urlDocuments.length + 1}` }]);
    }
  };

  const removeUrlDocument = (index: number) => {
    if (urlDocuments.length > 1) {
      setUrlDocuments(urlDocuments.filter((_, i) => i !== index));
    }
  };

  const handleFileUpload = (index: number, file: File) => {
    const newFiles = [...documentFiles];
    newFiles[index] = {
      ...newFiles[index],
      file,
      FileName: file.name,
      INTBFL_FilePath: URL.createObjectURL(file)
    };
    setDocumentFiles(newFiles);
  };

  const handleMainFileUpload = (file: File) => {
    setMainAttachmentFile(file);
    setMainAttachment(file.name);
  };

  const handleUrlChange = (index: number, url: string) => {
    const newUrls = [...urlDocuments];
    newUrls[index] = {
      ...newUrls[index],
      INTBFL_FilePath: url,
      FileName: url
    };
    setUrlDocuments(newUrls);
  };

  const toggleAllClasses = (checked: boolean) => {
    setClasses(prev => prev.map(cls => ({ ...cls, selected: checked })));
    if (checked) {
      setSelectedClasses(classes.map(cls => cls.asmcL_Id));
    } else {
      setSelectedClasses([]);
    }
  };

  const toggleClass = (classId: number, checked: boolean) => {
    setClasses(prev => 
      prev.map(cls => 
        cls.asmcL_Id === classId 
          ? { ...cls, selected: checked }
          : cls
      )
    );

    setSelectedClasses(prev => {
      if (checked) {
        return [...prev, classId];
      } else {
        return prev.filter(id => id !== classId);
      }
    });
  };

  const saveNotice = async () => {
    if (!selectedAcademicYear || !noticeType || !noticeTitle || !startDate || !endDate) {
      alert('Please fill all required fields');
      return;
    }

    if (checkStudent && selectedClasses.length === 0) {
      alert('Please select at least one class for student notice');
      return;
    }

    if (checkStaff && selectedDepartments.length === 0 && selectedDesignations.length === 0) {
      alert('Please select at least one department or designation for staff notice');
      return;
    }

    try {
      setIsSaving(true);
      
      // Mock API call - replace with actual implementation
      const noticeData = {
        INTB_Id: 0,
        INTB_Title: noticeTitle,
        INTB_Description: noticeDescription,
        INTB_StartDate: format(startDate!, 'yyyy-MM-dd'),
        INTB_EndDate: format(endDate!, 'yyyy-MM-dd'),
        INTB_DisplayDate: useDisplayDate ? format(displayDate!, 'yyyy-MM-dd') : null,
        INTB_Attachment: mainAttachment,
        NTB_TTSylabusFlg: noticeType,
        INTB_DispalyDisableFlg: useDisplayDate,
        INTB_ToStudentFlg: checkStudent,
        INTB_ToStaffFlg: checkStaff,
        ASMAY_Id: selectedAcademicYear,
        classlsttwo: selectedClasses.map(id => ({ ASMCL_Id: id })),
        sectionlistarray: selectedSections.map(id => ({ ASMS_Id: id })),
        studentarray: selectedStudents.map(id => ({ AMST_Id: id })),
        departmentlist: selectedDepartments.map(id => ({ HRMDC_ID: id })),
        designationlist: selectedDesignations.map(id => ({ HRMDES_Id: id })),
        employeearraylist: selectedEmployees.map(id => ({ HRME_Id: id })),
        FilePath_Array: [...documentFiles, ...urlDocuments].filter(doc => doc.INTBFL_FilePath)
      };

      console.log('Saving notice:', noticeData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Notice saved successfully!');
      clearForm();
      setIsSaving(false);
    } catch (error) {
      console.error('Error saving notice:', error);
      alert('Error saving notice');
      setIsSaving(false);
    }
  };

  const clearForm = () => {
    setNoticeTitle('');
    setNoticeDescription('');
    setStartDate(undefined);
    setEndDate(undefined);
    setDisplayDate(undefined);
    setUseDisplayDate(false);
    setSelectStudent(false);
    setSelectFeeDefaulters(false);
    setSelectRoute(false);
    setDocumentFiles([{ id: 'document' }]);
    setUrlDocuments([{ id: 'url' }]);
    setUseUrl(false);
    setMainAttachment('');
    setMainAttachmentFile(null);
    setSelectedClasses([]);
    setSelectedSections([]);
    setSelectedStudents([]);
    setSelectedDepartments([]);
    setSelectedDesignations([]);
    setSelectedEmployees([]);
    setClasses(prev => prev.map(cls => ({ ...cls, selected: false })));
    setSections(prev => prev.map(sec => ({ ...sec, selected: false })));
    setStudents(prev => prev.map(stu => ({ ...stu, selected: false })));
    setDepartments(prev => prev.map(dept => ({ ...dept, selected: false })));
    setDesignations(prev => prev.map(desg => ({ ...desg, selected: false })));
    setEmployees(prev => prev.map(emp => ({ ...emp, empck: false })));
  };

  const viewAttachments = (notice: Notice) => {
    // Mock attachments - replace with actual API call
    const mockAttachments: DocumentFile[] = [
      {
        id: '1',
        INTBFL_FilePath: notice.intB_Attachment || '',
        FileName: 'notice_attachment.pdf'
      }
    ];
    setSelectedAttachments(mockAttachments);
    setShowAttachmentModal(true);
  };

  const filteredClasses = classes.filter(cls =>
    cls.asmcL_ClassName.toLowerCase().includes(classSearchTerm.toLowerCase())
  );

  const filteredNotices = notices.filter(notice =>
    notice.intB_Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.intB_Description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold">Notice Board</h1>
      </div>

      {/* Notice Creation Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create Notice</CardTitle>
          <CardDescription>Create and publish notices for students and staff</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Audience Selection */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="student"
                  checked={checkStudent}
                  onCheckedChange={(checked) => handleAudienceChange('student', checked as boolean)}
                />
                <Label htmlFor="student" className="font-medium">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="staff"
                  checked={checkStaff}
                  onCheckedChange={(checked) => handleAudienceChange('staff', checked as boolean)}
                />
                <Label htmlFor="staff" className="font-medium">Staff</Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="academicYear">Academic Year *</Label>
              <Select value={selectedAcademicYear.toString()} onValueChange={(value) => setSelectedAcademicYear(parseInt(value))}>
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
              <Label htmlFor="noticeType">Notice Type *</Label>
              <Select value={noticeType} onValueChange={setNoticeType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Notice Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TT">TimeTable</SelectItem>
                  <SelectItem value="S">Syllabus</SelectItem>
                  <SelectItem value="P">Portion</SelectItem>
                  <SelectItem value="O">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="noticeTitle">Notice Title *</Label>
              <Input
                id="noticeTitle"
                placeholder="Enter Notice Title"
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter Description"
                value={noticeDescription}
                onChange={(e) => setNoticeDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                    disabled={!startDate}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => startDate ? date < startDate : false}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useDisplayDate"
                  checked={useDisplayDate}
                  onCheckedChange={(checked) => setUseDisplayDate(checked as boolean)}
                />
                <Label htmlFor="useDisplayDate">Display Date</Label>
                {useDisplayDate && <span className="text-red-500">*</span>}
              </div>
              {useDisplayDate && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !displayDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {displayDate ? format(displayDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={displayDate}
                      onSelect={setDisplayDate}
                      disabled={(date) => startDate ? date < startDate : false}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>

          {/* Student Selection Options */}
          {checkStudent && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="selectStudent"
                    checked={selectStudent}
                    onCheckedChange={(checked) => setSelectStudent(checked as boolean)}
                  />
                  <Label htmlFor="selectStudent">Select Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="feeDefaulters"
                    checked={selectFeeDefaulters}
                    onCheckedChange={(checked) => setSelectFeeDefaulters(checked as boolean)}
                  />
                  <Label htmlFor="feeDefaulters">Fee Defaulters</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="selectRoute"
                    checked={selectRoute}
                    onCheckedChange={(checked) => setSelectRoute(checked as boolean)}
                  />
                  <Label htmlFor="selectRoute">Select Route</Label>
                </div>
              </div>

              {/* Class Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Class Name *</Label>
                  <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                    <div className="space-y-2">
                      <Input
                        placeholder="Search here..."
                        value={classSearchTerm}
                        onChange={(e) => setClassSearchTerm(e.target.value)}
                        className="mb-2"
                      />
                      <div className="flex items-center space-x-2 p-2">
                        <Checkbox
                          id="selectAllClasses"
                          checked={classes.every(cls => cls.selected)}
                          onCheckedChange={toggleAllClasses}
                        />
                        <Label htmlFor="selectAllClasses" className="font-medium">All</Label>
                      </div>
                      {filteredClasses.map((cls) => (
                        <div key={cls.asmcL_Id} className="flex items-center space-x-2 p-2">
                          <Checkbox
                            id={`class-${cls.asmcL_Id}`}
                            checked={cls.selected || false}
                            onCheckedChange={(checked) => toggleClass(cls.asmcL_Id, checked as boolean)}
                          />
                          <Label htmlFor={`class-${cls.asmcL_Id}`} className="flex-1">
                            {cls.asmcL_ClassName}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowStudentModal(true)}
                  className="flex items-center space-x-2"
                >
                  <Users className="h-4 w-4" />
                  <span>Select Students</span>
                </Button>
              </div>
            </div>
          )}

          {/* Staff Selection */}
          {checkStaff && (
            <div className="space-y-4 p-4 bg-green-50 rounded-lg">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowStaffModal(true)}
                className="flex items-center space-x-2"
              >
                <UserCheck className="h-4 w-4" />
                <span>Select Staff</span>
              </Button>
            </div>
          )}

          {/* File Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Document Files */}
            <div className="space-y-4">
              <Label>Upload Documents</Label>
              <div className="border rounded-md p-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">SL NO</TableHead>
                        <TableHead>Upload File</TableHead>
                        <TableHead>File Name</TableHead>
                        <TableHead>View</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documentFiles.map((doc, index) => (
                        <TableRow key={doc.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Input
                                type="file"
                                accept="video/mp4,audio/*,video/x-ms-wmv,image/*,application/pdf,application/msword,application/vnd.ms-excel,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload(index, file);
                                }}
                                className="hidden"
                                id={`file-${doc.id}`}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById(`file-${doc.id}`)?.click()}
                              >
                                <Upload className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={doc.FileName || ''}
                              disabled
                              placeholder="No file selected"
                            />
                          </TableCell>
                          <TableCell>
                            {doc.INTBFL_FilePath && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(doc.INTBFL_FilePath, '_blank')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              {documentFiles.length < 30 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={addDocumentFile}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              )}
                              {documentFiles.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeDocumentFile(index)}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-semibold text-red-500">Accept File:</span> jpg, jpeg, png, doc, ppt, excel, mp3, mp4, wmv, pdf
                </p>
              </div>
            </div>

            {/* URL Documents */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useUrl"
                  checked={useUrl}
                  onCheckedChange={(checked) => setUseUrl(checked as boolean)}
                />
                <Label htmlFor="useUrl">If URL</Label>
              </div>
              
              {useUrl && (
                <div className="border rounded-md p-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">SL NO</TableHead>
                          <TableHead>URL</TableHead>
                          <TableHead>View</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {urlDocuments.map((doc, index) => (
                          <TableRow key={doc.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <Input
                                value={doc.INTBFL_FilePath || ''}
                                onChange={(e) => handleUrlChange(index, e.target.value)}
                                placeholder="Enter URL"
                                disabled={!useUrl}
                              />
                            </TableCell>
                            <TableCell>
                              {doc.INTBFL_FilePath && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(doc.INTBFL_FilePath, '_blank')}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                {urlDocuments.length < 30 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={addUrlDocument}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                )}
                                {urlDocuments.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeUrlDocument(index)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Attachment */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Main Attachment</Label>
              {mainAttachment && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{mainAttachment}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setMainAttachment('');
                      setMainAttachmentFile(null);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Input
                type="file"
                accept="image/*,application/pdf,application/msword,application/vnd.ms-excel,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleMainFileUpload(file);
                }}
                className="hidden"
                id="mainAttachment"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('mainAttachment')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={saveNotice} 
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="outline" onClick={clearForm}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notice List */}
      <NoticeListTable
        notices={filteredNotices}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStartDate={filterStartDate}
        filterEndDate={filterEndDate}
        onFilterStartDateChange={setFilterStartDate}
        onFilterEndDateChange={setFilterEndDate}
        onViewAttachments={viewAttachments}
      />

      {/* Modals */}
      <FileAttachmentModal
        isOpen={showAttachmentModal}
        onClose={() => setShowAttachmentModal(false)}
        attachments={selectedAttachments}
      />

      <StudentSelectionModal
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        classes={classes}
        sections={sections}
        students={students}
        selectedClasses={selectedClasses}
        selectedSections={selectedSections}
        selectedStudents={selectedStudents}
        onClassesChange={setSelectedClasses}
        onSectionsChange={setSelectedSections}
        onStudentsChange={setSelectedStudents}
      />

      <StaffSelectionModal
        isOpen={showStaffModal}
        onClose={() => setShowStaffModal(false)}
        departments={departments}
        designations={designations}
        employees={employees}
        selectedDepartments={selectedDepartments}
        selectedDesignations={selectedDesignations}
        selectedEmployees={selectedEmployees}
        onDepartmentsChange={setSelectedDepartments}
        onDesignationsChange={setSelectedDesignations}
        onEmployeesChange={setSelectedEmployees}
      />
    </div>
  );
}
