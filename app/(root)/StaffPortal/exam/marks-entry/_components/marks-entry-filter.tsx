
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, X, HelpCircle } from 'lucide-react';
import type {
    IMarksEntryInitialData,
    IClass,
    ISection,
    IExam,
    ISubject,
    IMarksEntrySearchRequest
} from '@/types/staff-portal/marks-entry';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MarksEntryFilterProps {
    initialData?: IMarksEntryInitialData | null;
    onSearch: (params: IMarksEntrySearchRequest, markCalculation: boolean) => void;
    onReset: () => void;
    isLoading: boolean;
    getClasses: (asmaY_Id: number) => Promise<IClass[]>;
    getSections: (asmaY_Id: number, asmcL_Id: number) => Promise<ISection[]>;
    getExams: (asmaY_Id: number, asmcL_Id: number, asmS_Id: number) => Promise<IExam[]>;
    getSubjects: (asmaY_Id: number, asmcL_Id: number, asmS_Id: number, emE_Id: number) => Promise<ISubject[]>;
}

export default function MarksEntryFilter({
    initialData,
    onSearch,
    onReset,
    isLoading,
    getClasses,
    getSections,
    getExams,
    getSubjects
}: MarksEntryFilterProps) {
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedSection, setSelectedSection] = useState<string>('');
    const [selectedExam, setSelectedExam] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [markCalculation, setMarkCalculation] = useState<boolean>(true);

    const [classes, setClasses] = useState<IClass[]>([]);
    const [sections, setSections] = useState<ISection[]>([]);
    const [exams, setExams] = useState<IExam[]>([]);
    const [subjects, setSubjects] = useState<ISubject[]>([]);

    useEffect(() => {
        if (initialData) {
            setSelectedYear(initialData.asmaY_Id.toString());
            setClasses(initialData.classlist || []);
        }
    }, [initialData]);

    const handleYearChange = async (value: string) => {
        setSelectedYear(value);
        setSelectedClass('');
        setSelectedSection('');
        setSelectedExam('');
        setSelectedSubject('');
        setClasses([]);
        setSections([]);
        setExams([]);
        setSubjects([]);

        const res = await getClasses(Number(value));
        setClasses(res);
    };

    const handleClassChange = async (value: string) => {
        setSelectedClass(value);
        setSelectedSection('');
        setSelectedExam('');
        setSelectedSubject('');
        setSections([]);
        setExams([]);
        setSubjects([]);

        const res = await getSections(Number(selectedYear), Number(value));
        setSections(res);
    };

    const handleSectionChange = async (value: string) => {
        setSelectedSection(value);
        setSelectedExam('');
        setSelectedSubject('');
        setExams([]);
        setSubjects([]);

        const res = await getExams(Number(selectedYear), Number(selectedClass), Number(value));
        setExams(res);
    };

    const handleExamChange = async (value: string) => {
        setSelectedExam(value);
        setSelectedSubject('');
        setSubjects([]);

        const res = await getSubjects(Number(selectedYear), Number(selectedClass), Number(selectedSection), Number(value));
        setSubjects(res);
    };

    const handleSubjectChange = (value: string) => {
        setSelectedSubject(value);
    };

    const handleSearch = () => {
        if (selectedYear && selectedClass && selectedSection && selectedExam && selectedSubject) {
            onSearch({
                ASMAY_Id: Number(selectedYear),
                ASMCL_Id: Number(selectedClass),
                ASMS_Id: Number(selectedSection),
                EME_Id: Number(selectedExam),
                ISMS_Id: Number(selectedSubject)
            }, markCalculation);
        }
    };

    const handleReset = () => {
        // Only reset if you want to clear everything. 
        // In many cases we keep the year and class.
        onReset();
    };

    return (
        <Card className="shadow-md border-primary/10">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-primary">
                    <Search className="h-5 w-5" />
                    Marks Entry Filter
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="year">Academic Year</Label>
                        <Select value={selectedYear} onValueChange={handleYearChange}>
                            <SelectTrigger id="year">
                                <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {initialData?.yearlist?.map((yr) => (
                                    <SelectItem key={yr.asmaY_Id} value={yr.asmaY_Id.toString()}>
                                        {yr.asmaY_Year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="class">Class</Label>
                        <Select value={selectedClass} onValueChange={handleClassChange} disabled={!selectedYear}>
                            <SelectTrigger id="class">
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
                        <Label htmlFor="section">Section</Label>
                        <Select value={selectedSection} onValueChange={handleSectionChange} disabled={!selectedClass}>
                            <SelectTrigger id="section">
                                <SelectValue placeholder="Select Section" />
                            </SelectTrigger>
                            <SelectContent>
                                {sections.map((sec) => (
                                    <SelectItem key={sec.asmS_Id} value={sec.asmS_Id.toString()}>
                                        {sec.asmC_SectionName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="exam">Exam</Label>
                        <Select value={selectedExam} onValueChange={handleExamChange} disabled={!selectedSection}>
                            <SelectTrigger id="exam">
                                <SelectValue placeholder="Select Exam" />
                            </SelectTrigger>
                            <SelectContent>
                                {exams.map((ex) => (
                                    <SelectItem key={ex.emE_Id} value={ex.emE_Id.toString()}>
                                        {ex.emE_ExamName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select value={selectedSubject} onValueChange={handleSubjectChange} disabled={!selectedExam}>
                            <SelectTrigger id="subject">
                                <SelectValue placeholder="Select Subject" />
                            </SelectTrigger>
                            <SelectContent>
                                {subjects.map((sub) => (
                                    <SelectItem key={sub.ismS_Id} value={sub.ismS_Id.toString()}>
                                        {sub.ismS_SubjectName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-2 bg-muted/30 p-2 rounded-md transition-colors hover:bg-muted/50">
                        <Checkbox
                            id="calculate"
                            checked={markCalculation}
                            onCheckedChange={(checked) => setMarkCalculation(checked === true)}
                            disabled
                        />
                        <Label htmlFor="calculate" className="flex items-center gap-1 cursor-not-allowed text-sm font-medium">
                            Do You Want Calculate Marks
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <HelpCircle className="h-4 w-4 text-primary cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Automatic mark calculation based on sub-marks.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Label>
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                        <Button
                            variant="outline"
                            onClick={handleReset}
                            className="flex items-center gap-2"
                        >
                            <X className="h-4 w-4" />
                            Clear
                        </Button>
                        <Button
                            onClick={handleSearch}
                            disabled={isLoading || !selectedSubject}
                            className="bg-primary hover:bg-primary/90 flex items-center gap-2 min-w-[120px]"
                        >
                            <Search className="h-4 w-4" />
                            {isLoading ? 'Searching...' : 'Search'}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
