'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, Plus, Minus, Eye, Download, Edit, Trash2, FileText, Video, Image, Music, Link2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { FileUploadModal } from './_components/file-upload-modal';
import { HomeworkTable } from './_components/homework-table';
import { FilePreviewModal } from './_components/file-preview-modal';

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
  selected?: boolean;
}

interface Subject {
  ismS_Id: number;
  ismS_SubjectName: string;
  asmC_SectionName: string;
}

interface HomeworkFile {
  id: string;
  IHW_FilePath?: string;
  FileName?: string;
  file?: File;
}

interface HomeworkUrl {
  id: string;
  IHW_FilePath: string;
}

interface Homework {
  ihW_Id: number;
  ismS_SubjectName: string;
  asmcL_ClassName: string;
  asmC_SectionName: string;
  ihW_Topic: string;
  createdDate: string;
  createdTime: string;
  ihW_Assignment: string;
  ihW_Date: string;
  FilesCount: number;
  ihW_ActiveFlag: boolean;
}

export default function HomeworkUploadPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [homeworkList, setHomeworkList] = useState<Homework[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<HomeworkFile[]>([{ id: '1' }]);
  const [uploadedUrls, setUploadedUrls] = useState<HomeworkUrl[]>([{ id: '1', IHW_FilePath: '' }]);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'image' | 'video' | 'audio' | 'pdf' | 'other'>('other');

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();

  const selectedYear = watch('asmaY_Id');
  const selectedClass = watch('asmcL_Id');
  const selectedSubject = watch('ismS_Id');

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
    const selectedSections = sections.filter(s => s.selected);
    if (selectedSections.length > 0 && selectedYear && selectedClass) {
      loadSubjects();
    }
  }, [sections, selectedYear, selectedClass]);

  const loadInitialData = async () => {
    try {
      // Mock data - replace with actual API calls
      setAcademicYears([
        { asmaY_Id: 1, asmaY_Year: '2024-2025' },
        { asmaY_Id: 2, asmaY_Year: '2025-2026' }
      ]);
      setHomeworkList([]);
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
        { asmS_Id: 1, asmC_SectionName: 'Section A', selected: false },
        { asmS_Id: 2, asmC_SectionName: 'Section B', selected: false }
      ]);
    } catch (error) {
      console.error('Error loading sections:', error);
    }
  };

  const loadSubjects = async () => {
    try {
      // Mock data - replace with actual API call
      setSubjects([
        { ismS_Id: 1, ismS_SubjectName: 'Mathematics', asmC_SectionName: 'Section A' },
        { ismS_Id: 2, ismS_SubjectName: 'Science', asmC_SectionName: 'Section B' }
      ]);
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const handleSectionToggle = (sectionId: number) => {
    setSections(prev => prev.map(section => 
      section.asmS_Id === sectionId 
        ? { ...section, selected: !section.selected }
        : section
    ));
  };

  const addFileRow = () => {
    const newId = (uploadedFiles.length + 1).toString();
    setUploadedFiles([...uploadedFiles, { id: newId }]);
  };

  const removeFileRow = (index: number) => {
    if (uploadedFiles.length > 1) {
      setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
    }
  };

  const addUrlRow = () => {
    const newId = (uploadedUrls.length + 1).toString();
    setUploadedUrls([...uploadedUrls, { id: newId, IHW_FilePath: '' }]);
  };

  const removeUrlRow = (index: number) => {
    if (uploadedUrls.length > 1) {
      setUploadedUrls(uploadedUrls.filter((_, i) => i !== index));
    }
  };

  const handleFileUpload = async (file: File, index: number) => {
    setIsUploading(true);
    try {
      // Mock upload - replace with actual upload logic
      const mockFilePath = `/uploads/homework/${file.name}`;
      setUploadedFiles(prev => prev.map((item, i) => 
        i === index 
          ? { ...item, file, IHW_FilePath: mockFilePath, FileName: file.name }
          : item
      ));
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (url: string, index: number) => {
    setUploadedUrls(prev => prev.map((item, i) => 
      i === index 
        ? { ...item, IHW_FilePath: url }
        : item
    ));
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return <Image className="h-4 w-4" />;
    if (['mp4', 'avi', 'mov'].includes(ext || '')) return <Video className="h-4 w-4" />;
    if (['mp3', 'wav', 'ogg'].includes(ext || '')) return <Music className="h-4 w-4" />;
    if (['pdf'].includes(ext || '')) return <FileText className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
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

  const onSubmit = async (data: any) => {
    const selectedSections = sections.filter(s => s.selected);
    if (selectedSections.length === 0) {
      alert('Please select at least one section');
      return;
    }

    try {
      // Mock save - replace with actual API call
      console.log('Saving homework:', {
        ...data,
        sections: selectedSections,
        files: uploadedFiles.filter(f => f.IHW_FilePath),
        urls: uploadedUrls.filter(u => u.IHW_FilePath),
        date: selectedDate
      });
      alert('Homework saved successfully!');
      // Reset form or redirect as needed
    } catch (error) {
      console.error('Error saving homework:', error);
      alert('Error saving homework');
    }
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
        <h1 className="text-3xl font-bold">Homework Upload</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Homework Details</CardTitle>
            <CardDescription>Fill in the homework information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label>Section *</Label>
                <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
                  {sections.map((section) => (
                    <div key={section.asmS_Id} className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id={`section-${section.asmS_Id}`}
                        checked={section.selected || false}
                        onCheckedChange={() => handleSectionToggle(section.asmS_Id)}
                      />
                      <Label htmlFor={`section-${section.asmS_Id}`} className="text-sm">
                        {section.asmC_SectionName}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ismS_Id">Subject *</Label>
                <Select onValueChange={(value) => setValue('ismS_Id', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.ismS_Id} value={subject.ismS_Id.toString()}>
                        {subject.ismS_SubjectName}: {subject.asmC_SectionName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ihW_Topic">Topic *</Label>
                <Input
                  id="ihW_Topic"
                  placeholder="Enter Topic"
                  {...register('ihW_Topic', { required: true })}
                />
              </div>

              <div className="space-y-2">
                <Label>Homework Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ihW_Assignment">Assignment</Label>
                <Textarea
                  id="ihW_Assignment"
                  placeholder="Enter Assignment"
                  rows={4}
                  {...register('ihW_Assignment')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ihW_AssignmentNo">Assignment No</Label>
                <Input
                  id="ihW_AssignmentNo"
                  type="number"
                  placeholder="Enter Assignment Number"
                  {...register('ihW_AssignmentNo')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>File Upload</CardTitle>
            <CardDescription>Upload homework files or add URLs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showUrlInput"
                checked={showUrlInput}
                onCheckedChange={(checked) => setShowUrlInput(checked as boolean)}
              />
              <Label htmlFor="showUrlInput">Add URL instead of file</Label>
            </div>

            {!showUrlInput ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <strong>Accept File:</strong> jpg, jpeg, png, doc, ppt, excel, mp3, mp4, wmv, pdf
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">SL NO</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Upload File</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">File Name</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">View</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadedFiles.map((file, index) => (
                        <tr key={file.id}>
                          <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <div className="flex items-center space-x-2">
                              <Input
                                type="file"
                                accept="video/mp4,audio/*,video/x-ms-wmv,image/*,application/pdf,application/msword,application/vnd.ms-excel,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                onChange={(e) => {
                                  const selectedFile = e.target.files?.[0];
                                  if (selectedFile) handleFileUpload(selectedFile, index);
                                }}
                                className="hidden"
                                id={`file-${file.id}`}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById(`file-${file.id}`)?.click()}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Upload File
                              </Button>
                            </div>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <Input
                              value={file.FileName || ''}
                              readOnly
                              placeholder="No file selected"
                            />
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {file.IHW_FilePath && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handlePreview(file.IHW_FilePath!)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <div className="flex items-center space-x-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addFileRow}
                                disabled={uploadedFiles.length >= 30}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeFileRow(index)}
                                disabled={uploadedFiles.length === 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">SL NO</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">URL</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">View</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadedUrls.map((url, index) => (
                        <tr key={url.id}>
                          <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <Input
                              value={url.IHW_FilePath}
                              onChange={(e) => handleUrlChange(e.target.value, index)}
                              placeholder="Enter URL"
                            />
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {url.IHW_FilePath && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(url.IHW_FilePath, '_blank')}
                              >
                                <Link2 className="h-4 w-4" />
                              </Button>
                            )}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <div className="flex items-center space-x-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addUrlRow}
                                disabled={uploadedUrls.length >= 30}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeUrlRow(index)}
                                disabled={uploadedUrls.length === 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4">
          <Button type="submit" disabled={isUploading}>
            {isUploading ? 'Saving...' : 'Save Homework'}
          </Button>
          <Button type="button" variant="outline" onClick={() => window.location.reload()}>
            Cancel
          </Button>
        </div>
      </form>

      <HomeworkTable homeworkList={homeworkList} />

      <FilePreviewModal
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
        type={previewType}
      />
    </div>
  );
}
