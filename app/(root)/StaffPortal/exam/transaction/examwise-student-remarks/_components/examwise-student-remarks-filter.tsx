'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type {
    IExamwiseRemarksInitialData,
    IClass,
    ISection,
    IExam
} from '@/types/staff-portal/examwise-student-remarks';

interface ExamwiseRemarksFilterProps {
    initialData?: IExamwiseRemarksInitialData;
    getClasses: (data: { ASMAY_Id: number }) => Promise<{ classlist: IClass[] }>;
    getSections: (data: { ASMAY_Id: number; ASMCL_Id: number }) => Promise<{ sectionlist: ISection[] }>;
    getExams: (data: { ASMAY_Id: number; ASMCL_Id: number; ASMS_Id: number }) => Promise<{ examlist: IExam[] }>;
    onSearch: (data: { ASMAY_Id: number; ASMCL_Id: number; ASMS_Id: number; EME_Id: number }) => void;
    onReset: () => void;
    isLoading?: boolean;
    disabled?: boolean;
    // For edit mode pre-filling
    editData?: { ASMAY_Id: number; ASMCL_Id: number; ASMS_Id: number; EME_Id: number };
}

export default function ExamwiseRemarksFilter({
    initialData,
    getClasses,
    getSections,
    getExams,
    onSearch,
    onReset,
    isLoading,
    disabled = false,
    editData
}: ExamwiseRemarksFilterProps) {
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedSection, setSelectedSection] = useState<string>('');
    const [selectedExam, setSelectedExam] = useState<string>('');

    const [classes, setClasses] = useState<IClass[]>([]);
    const [sections, setSections] = useState<ISection[]>([]);
    const [exams, setExams] = useState<IExam[]>([]);

    useEffect(() => {
        if (editData) {
            // For edit mode, we assume parent component handles fetching lists if needed or we refetch here
            // Since edit mode just sets state, we might need to fetch lists to show correct labels
            // For simplicity, let's just set IDs and trigger fetches
            setSelectedYear(String(editData.ASMAY_Id));
            fetchClasses(editData.ASMAY_Id).then(() => {
                setSelectedClass(String(editData.ASMCL_Id));
                fetchSections(editData.ASMAY_Id, editData.ASMCL_Id).then(() => {
                    setSelectedSection(String(editData.ASMS_Id));
                    fetchExams(editData.ASMAY_Id, editData.ASMCL_Id, editData.ASMS_Id).then(() => {
                        setSelectedExam(String(editData.EME_Id));
                    });
                });
            });
        }
    }, [editData]);

    const fetchClasses = async (yearId: number) => {
        try {
            const res = await getClasses({ ASMAY_Id: yearId });
            setClasses(res.classlist || []);
        } catch (e) { console.error(e); }
    };

    const fetchSections = async (yearId: number, classId: number) => {
        try {
            const res = await getSections({ ASMAY_Id: yearId, ASMCL_Id: classId });
            setSections(res.sectionlist || []);
        } catch (e) { console.error(e); }
    };

    const fetchExams = async (yearId: number, classId: number, sectionId: number) => {
        try {
            const res = await getExams({ ASMAY_Id: yearId, ASMCL_Id: classId, ASMS_Id: sectionId });
            setExams(res.examlist || []);
        } catch (e) { console.error(e); }
    };

    const handleYearChange = (val: string) => {
        setSelectedYear(val);
        setSelectedClass('');
        setClasses([]);
        setSelectedSection('');
        setSections([]);
        setSelectedExam('');
        setExams([]);
        fetchClasses(Number(val));
    };

    const handleClassChange = (val: string) => {
        setSelectedClass(val);
        setSelectedSection('');
        setSections([]);
        setSelectedExam('');
        setExams([]);
        fetchSections(Number(selectedYear), Number(val));
    };

    const handleSectionChange = (val: string) => {
        setSelectedSection(val);
        setSelectedExam('');
        setExams([]);
        fetchExams(Number(selectedYear), Number(selectedClass), Number(val));
    };

    const handleSearch = () => {
        if (!selectedYear || !selectedClass || !selectedSection || !selectedExam) {
            toast.error('Please select all required fields');
            return;
        }
        onSearch({
            ASMAY_Id: Number(selectedYear),
            ASMCL_Id: Number(selectedClass),
            ASMS_Id: Number(selectedSection),
            EME_Id: Number(selectedExam)
        });
    };

    return (
        <Card className="mb-6">
            <CardHeader><CardTitle>Selection</CardTitle></CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <Label>Year <span className="text-red-500">*</span></Label>
                        <Select value={selectedYear} onValueChange={handleYearChange} disabled={disabled}>
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
                        <Select value={selectedClass} onValueChange={handleClassChange} disabled={disabled}>
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
                        <Select value={selectedSection} onValueChange={handleSectionChange} disabled={disabled}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Section" />
                            </SelectTrigger>
                            <SelectContent>
                                {sections.map(s => (
                                    <SelectItem key={s.asmS_Id} value={String(s.asmS_Id)}>{s.asmC_SectionName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Exam <span className="text-red-500">*</span></Label>
                        <Select value={selectedExam} onValueChange={setSelectedExam} disabled={disabled}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Exam" />
                            </SelectTrigger>
                            <SelectContent>
                                {exams.map(e => (
                                    <SelectItem key={e.emE_Id} value={String(e.emE_Id)}>{e.emE_ExamName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex justify-center gap-4 pt-6">
                    <Button onClick={handleSearch} disabled={isLoading || disabled}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Search
                    </Button>
                    <Button variant="outline" onClick={onReset} className="text-red-500">Cancel</Button>
                </div>
            </CardContent>
        </Card>
    );
}
