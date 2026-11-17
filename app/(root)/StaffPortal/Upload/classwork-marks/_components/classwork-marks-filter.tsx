'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type {
    IClassWorkMarksInitialData,
    IClass,
    ISection,
    ISubject,
} from '@/types/staff-portal/classwork.d'; // Reusing base types

interface ClassWorkMarksFilterProps {
    initialData?: IClassWorkMarksInitialData;
    getClasses: (data: { HRME_Id: number; ASMAY_Id: number }) => Promise<{ classlist: IClass[] }>;
    getSections: (data: { HRME_Id: number; ASMCL_Id: number; ASMAY_Id: number }) => Promise<{ sectionlist: ISection[] }>;
    getSubjects: (data: { HRME_Id: number; ASMCL_Id: number; ASMAY_Id: number; hm_section_list: { ASMS_Id: number }[] }) => Promise<{ subjectlist: ISubject[] }>;
    onGetTopics: (data: { ASMCL_Id: number; ASMS_Id: number; ASMAY_Id: number; ISMS_Id: number; fromdate: string; todate: string }) => void;
    onReset: () => void;
    hrmE_Id?: number;
}

export default function ClassWorkMarksFilter({
    initialData,
    getClasses,
    getSections,
    getSubjects,
    onGetTopics,
    onReset,
    hrmE_Id = 0
}: ClassWorkMarksFilterProps) {
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedSection, setSelectedSection] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState<string>('');

    const [classes, setClasses] = useState<IClass[]>([]);
    const [sections, setSections] = useState<ISection[]>([]);
    const [subjects, setSubjects] = useState<ISubject[]>([]);

    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();

    useEffect(() => {
        if (initialData?.academicyear && initialData.academicyear.length > 0) {
            const defaultYear = initialData.academicyear[0].asmaY_Id;
            setSelectedYear(String(defaultYear));
            fetchClasses(defaultYear);
        }
    }, [initialData]);

    const fetchClasses = async (yearId: number) => {
        try {
            const res = await getClasses({ HRME_Id: hrmE_Id, ASMAY_Id: yearId });
            setClasses(res.classlist || []);
        } catch (e) {
            console.error(e);
        }
    };

    const handleClassChange = async (value: string) => {
        setSelectedClass(value);
        setSelectedSection('');
        setSections([]);
        setSelectedSubject('');
        setSubjects([]);
        try {
            const res = await getSections({ HRME_Id: hrmE_Id, ASMCL_Id: Number(value), ASMAY_Id: Number(selectedYear) });
            setSections(res.sectionlist || []);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSectionChange = async (value: string) => {
        setSelectedSection(value);
        setSelectedSubject('');
        setSubjects([]);
        try {
            // hm_section_list is expected by API, though legacy code passes it, for single section select it handles it.
            // Our re-exported 'getSubjects' expects array.
            const res = await getSubjects({
                HRME_Id: hrmE_Id,
                ASMCL_Id: Number(selectedClass),
                ASMAY_Id: Number(selectedYear),
                hm_section_list: [{ ASMS_Id: Number(value) }]
            });
            setSubjects(res.subjectlist || []);
        } catch (e) {
            console.error(e);
        }
    };

    const handleGetList = () => {
        if (!selectedYear || !selectedClass || !selectedSection || !selectedSubject) {
            toast.error('Please select all required fields');
            return;
        }

        onGetTopics({
            ASMCL_Id: Number(selectedClass),
            ASMS_Id: Number(selectedSection),
            ASMAY_Id: Number(selectedYear),
            ISMS_Id: Number(selectedSubject),
            fromdate: startDate ? format(startDate, 'yyyy-MM-dd') : '',
            todate: endDate ? format(endDate, 'yyyy-MM-dd') : ''
        });
    };

    return (
        <Card className="mb-6">
            <CardHeader><CardTitle>Selection Criteria</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <Label>Academic Year <span className="text-red-500">*</span></Label>
                        <Select value={selectedYear} onValueChange={(v) => { setSelectedYear(v); fetchClasses(Number(v)); }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {initialData?.academicyear.map((y: { asmaY_Id: React.Key | null | undefined; asmaY_Year: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }) => (
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
                        <Select value={selectedSection} onValueChange={handleSectionChange}>
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
                        <Label>Subject <span className="text-red-500">*</span></Label>
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Subject" />
                            </SelectTrigger>
                            <SelectContent>
                                {subjects.map(s => (
                                    <SelectItem key={s.ismS_Id} value={String(s.ismS_Id)}>{s.ismS_SubjectName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>From Date</Label>
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
                        <Label>To Date</Label>
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
                </div>

                <div className="flex justify-center gap-4 pt-4">
                    <Button onClick={handleGetList}>Get List</Button>
                    <Button variant="outline" onClick={onReset} className="text-red-500">Cancel</Button>
                </div>
            </CardContent>
        </Card>
    );
}
