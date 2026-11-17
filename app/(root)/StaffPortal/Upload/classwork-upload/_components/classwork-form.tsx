'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { CalendarIcon, Upload, X, File as FileIcon, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type {
    IClassWorkInitialData,
    IClass,
    ISection,
    ISubject,
    IClassWorkSave
} from '@/types/staff-portal/classwork.d';

interface ClassWorkFormProps {
    initialData?: IClassWorkInitialData;
    onSave: (data: IClassWorkSave) => void;
    onCancel: () => void;
    getClasses: (data: { HRME_Id: number; ASMAY_Id: number }) => Promise<{ classlist: IClass[] }>;
    getSections: (data: { HRME_Id: number; ASMCL_Id: number; ASMAY_Id: number }) => Promise<{ sectionlist: ISection[] }>;
    getSubjects: (data: { HRME_Id: number; ASMCL_Id: number; ASMAY_Id: number; hm_section_list: { ASMS_Id: number }[] }) => Promise<{ subjectlist: ISubject[] }>;
    editData?: any; // To populate form on edit
    hrmE_Id?: number; // pass logged in user id if available in initial data
}

export default function ClassWorkForm({
    initialData,
    onSave,
    onCancel,
    getClasses,
    getSections,
    getSubjects,
    editData,
    hrmE_Id = 0 // Default to 0 if not provided
}: ClassWorkFormProps) {
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [sections, setSections] = useState<ISection[]>([]);
    const [classes, setClasses] = useState<IClass[]>([]);
    const [subjects, setSubjects] = useState<ISubject[]>([]);
    const [selectedSections, setSelectedSections] = useState<number[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<string>('');

    const [topic, setTopic] = useState('');
    const [subTopic, setSubTopic] = useState('');
    const [content, setContent] = useState('');
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();

    const [files, setFiles] = useState<File[]>([]);
    const [filePreviews, setFilePreviews] = useState<{ name: string, url: string, type: string }[]>([]);
    const [isUrl, setIsUrl] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const [urls, setUrls] = useState<string[]>([]);

    // Load initial data logic...
    useEffect(() => {
        if (initialData?.academicyear && initialData.academicyear.length > 0) {
            setSelectedYear(String(initialData.academicyear[0].asmaY_Id));
            // Trigger class fetch
            fetchClasses(initialData.academicyear[0].asmaY_Id);
        }
    }, [initialData]);

    const fetchClasses = async (yearId: number) => {
        // Need HRME_Id from props or context. Assuming 0 for now if unknown or handled by server via session
        // Legacy sends HRME_Id.
        try {
            const res = await getClasses({ HRME_Id: hrmE_Id, ASMAY_Id: yearId });
            setClasses(res.classlist || []);
        } catch (e) {
            console.error(e);
        }
    };

    const handleClassChange = async (value: string) => {
        setSelectedClass(value);
        setSections([]);
        setSelectedSections([]);
        setSubjects([]);
        setSelectedSubject('');
        try {
            const res = await getSections({ HRME_Id: hrmE_Id, ASMCL_Id: Number(value), ASMAY_Id: Number(selectedYear) });
            setSections(res.sectionlist || []);
        } catch (e) {
            console.error(e);
        }
    };

    const toggleSection = (sectionId: number) => {
        let newSelection = [...selectedSections];
        if (newSelection.includes(sectionId)) {
            newSelection = newSelection.filter(id => id !== sectionId);
        } else {
            newSelection.push(sectionId);
        }
        setSelectedSections(newSelection);
        fetchSubjects(newSelection);
    };

    const fetchSubjects = async (sectionIds: number[]) => {
        if (sectionIds.length === 0) {
            setSubjects([]);
            return;
        }
        const hm_section_list = sectionIds.map(id => ({ ASMS_Id: id }));
        try {
            const res = await getSubjects({
                HRME_Id: hrmE_Id,
                ASMCL_Id: Number(selectedClass),
                ASMAY_Id: Number(selectedYear),
                hm_section_list
            });
            setSubjects(res.subjectlist || []);
        } catch (e) {
            console.error(e);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);

            // Create previews
            newFiles.forEach(file => {
                const url = URL.createObjectURL(file);
                setFilePreviews(prev => [...prev, {
                    name: file.name,
                    url: url,
                    type: file.type
                }]);
            });
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setFilePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddUrl = () => {
        if (urlInput) {
            setUrls(prev => [...prev, urlInput]);
            setUrlInput('');
        }
    };

    const handleSubmit = async () => {
        if (!selectedYear || !selectedClass || selectedSections.length === 0 || !selectedSubject) {
            toast.error('Please fill all required fields');
            return;
        }
        if (!topic || !content || !startDate || !endDate) {
            toast.error('Please fill Classwork details');
            return;
        }

        const hm_section_list = selectedSections.map(id => ({ ASMS_Id: id }));

        // Handle file uploads - in a real scenario, we might upload first or send as FormData.
        // For this demo, assuming standard JSON payload but need to handle file content. 
        // Legacy does distinct upload endpoint then save. 
        // We will mock the file path structure for the save object for now, or use a separate upload action if verified.
        // Since we defined `saveClassWork` to take `ICW_FilePath_Array`, we assume files are already uploaded or we handle it here.
        // Let's assume we need to upload files first.
        // TODO: Implement file upload logic if API requires. For now sending empty array or mock.

        const saveData: IClassWorkSave = {
            ICW_Id: editData?.icW_Id || 0,
            ASMAY_Id: Number(selectedYear),
            ASMCL_Id: Number(selectedClass),
            ISMS_Id: Number(selectedSubject),
            hm_section_list,
            ICW_Topic: topic,
            ICW_SubTopic: subTopic,
            ICW_Content: content,
            ICW_FromDate: startDate,
            ICW_ToDate: endDate,
            ICW_FilePath_Array: [], // Need actual upload paths here
            ICW_Attachment: isUrl ? 'HyperLink' : undefined
        };

        // Add URLs to file path array if any
        urls.forEach(url => {
            saveData.ICW_FilePath_Array.push({ ICW_FilePath: url, FileName: url });
        });

        // Add uploaded file mock paths (since we don't have the upload endpoint connected in this turn)
        // In reality, we'd call an upload action for each file.

        onSave(saveData);
    };

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>ClassWork Upload</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Academic Year <span className="text-red-500">*</span></Label>
                            <Select value={selectedYear} onValueChange={(v) => { setSelectedYear(v); fetchClasses(Number(v)); }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {initialData?.yearlist.map(y => (
                                        <SelectItem key={y.asmaY_Id} value={String(y.asmaY_Id)}>{y.asmaY_Year}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Class <span className="text-red-500">*</span></Label>
                            <Select value={selectedClass} onValueChange={handleClassChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map(c => (
                                        <SelectItem key={c.asmcL_Id} value={String(c.asmcL_Id)}>{c.asmcL_ClassName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Section <span className="text-red-500">*</span></Label>
                            <div className="border rounded-md p-2 h-32 overflow-y-auto space-y-2">
                                {sections.map(s => (
                                    <div key={s.asmS_Id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`sec-${s.asmS_Id}`}
                                            checked={selectedSections.includes(s.asmS_Id)}
                                            onCheckedChange={() => toggleSection(s.asmS_Id)}
                                        />
                                        <Label htmlFor={`sec-${s.asmS_Id}`}>{s.asmC_SectionName}</Label>
                                    </div>
                                ))}
                                {sections.length === 0 && <span className="text-muted-foreground text-sm">No sections available</span>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Subject <span className="text-red-500">*</span></Label>
                            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map(s => (
                                        <SelectItem key={s.ismS_Id} value={String(s.ismS_Id)}>
                                            {s.ismS_SubjectName} {s.asmC_SectionName ? `(${s.asmC_SectionName})` : ''}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Topic <span className="text-red-500">*</span></Label>
                            <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Enter Topic" />
                        </div>

                        <div className="space-y-2">
                            <Label>Sub Topic</Label>
                            <Input value={subTopic} onChange={e => setSubTopic(e.target.value)} placeholder="Enter Sub Topic" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Start Date <span className="text-red-500">*</span></Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label>End Date <span className="text-red-500">*</span></Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus disabled={(date) => startDate ? date < startDate : false} />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label>Content <span className="text-red-500">*</span></Label>
                            <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Enter Content" rows={3} />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 pb-2">
                                <Checkbox id="isUrl" checked={isUrl} onCheckedChange={(c) => setIsUrl(c as boolean)} />
                                <Label htmlFor="isUrl">If URL</Label>
                            </div>

                            {isUrl ? (
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <Input value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="Enter URL" />
                                        <Button type="button" onClick={handleAddUrl} size="sm">Add</Button>
                                    </div>
                                    <ul className="list-disc pl-4 space-y-1">
                                        {urls.map((u, i) => (
                                            <li key={i} className="text-sm">{u} <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => setUrls(p => p.filter((_, idx) => idx !== i))}><X className="h-3 w-3" /></Button></li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center w-full">
                                        <Label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                                                <p className="text-xs text-gray-500">Video, Audio, Images, Docs, PDF</p>
                                            </div>
                                            <Input id="dropzone-file" type="file" multiple className="hidden" onChange={handleFileChange} />
                                        </Label>
                                    </div>

                                    <div className="space-y-2">
                                        {filePreviews.map((f, i) => (
                                            <div key={i} className="flex items-center justify-between p-2 border rounded-md">
                                                <div className="flex items-center gap-2">
                                                    <FileIcon className="h-4 w-4 text-blue-500" />
                                                    <span className="text-sm truncate max-w-[200px]">{f.name}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <a href={f.url} target="_blank" rel="noreferrer">View</a>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => removeFile(i)}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-6">
                    <Button onClick={handleSubmit}>Save</Button>
                    <Button variant="outline" onClick={onCancel} className="text-red-500">Cancel</Button>
                </div>
            </CardContent>
        </Card>
    );
}
