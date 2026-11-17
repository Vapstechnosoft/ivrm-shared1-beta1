'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Search, X, Loader2 } from 'lucide-react';
import type {
    ICumulativeReportInitialData,
    IClass,
    ISection,
    IExam,
    IStudent,
    ISearchRequest
} from '@/types/staff-portal/cumulative-report';
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from 'sonner';

interface CumulativeReportFilterProps {
    initialData?: ICumulativeReportInitialData | null;
    onSearch: (params: ISearchRequest) => void;
    onReset: () => void;
    isLoading: boolean;
    getClasses: (asmaY_Id: number) => Promise<IClass[]>;
    getSections: (asmaY_Id: number, asmcL_Id: number) => Promise<ISection[]>;
    getExams: (data: { ASMAY_Id: number, ASMCL_Id: number, ASMS_Id: number, Left_Flag: boolean, Deactive_Flag: boolean }) => Promise<{ exmstdlist: IExam[], studentlist: IStudent[] }>;
}

export default function CumulativeReportFilter({
    initialData,
    onSearch,
    onReset,
    isLoading,
    getClasses,
    getSections,
    getExams
}: CumulativeReportFilterProps) {
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedSection, setSelectedSection] = useState<string>('');
    const [selectedExam, setSelectedExam] = useState<string>('');

    // Checkbox states
    const [includeLeft, setIncludeLeft] = useState(false);
    const [includeDeactive, setIncludeDeactive] = useState(false);
    const [displayApplicable, setDisplayApplicable] = useState(true);
    const [displayNonApplicable, setDisplayNonApplicable] = useState(false);
    const [displayPercentage, setDisplayPercentage] = useState(false);
    const [displayOverallGrade, setDisplayOverallGrade] = useState(false);
    const [displayClassRank, setDisplayClassRank] = useState(false);
    const [displaySectionRank, setDisplaySectionRank] = useState(true);
    const [notDisplayAttendance, setNotDisplayAttendance] = useState(false);
    const [displayGrade, setDisplayGrade] = useState(true);
    const [displayMarks, setDisplayMarks] = useState(true);

    const [classes, setClasses] = useState<IClass[]>([]);
    const [sections, setSections] = useState<ISection[]>([]);
    const [exams, setExams] = useState<IExam[]>([]);
    const [students, setStudents] = useState<IStudent[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const [studentSearch, setStudentSearch] = useState('');
    const [isAllStudentsSelected, setIsAllStudentsSelected] = useState(true);
    const [examsLoading, setExamsLoading] = useState(false);

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
        setClasses([]);
        setSections([]);
        setExams([]);
        setStudents([]);

        const res = await getClasses(Number(value));
        setClasses(res);
    };

    const handleClassChange = async (value: string) => {
        setSelectedClass(value);
        setSelectedSection('');
        setSelectedExam('');
        setSections([]);
        setExams([]);
        setStudents([]);

        const res = await getSections(Number(selectedYear), Number(value));
        setSections(res);
    };

    const handleSectionChange = async (value: string) => {
        setSelectedSection(value);
        setSelectedExam('');
        setExams([]);
        setStudents([]);

        await fetchExamsAndStudents(Number(selectedYear), Number(selectedClass), Number(value), includeLeft, includeDeactive);
    };

    const fetchExamsAndStudents = async (year: number, cls: number, section: number, left: boolean, deactive: boolean) => {
        setExamsLoading(true);
        try {
            const res = await getExams({
                ASMAY_Id: year,
                ASMCL_Id: cls,
                ASMS_Id: section,
                Left_Flag: left,
                Deactive_Flag: deactive
            });
            setExams(res.exmstdlist || []);
            setStudents(res.studentlist || []);
            // Select all students by default
            const allStudentIds = (res.studentlist || []).map(s => s.amsT_Id);
            setSelectedStudents(allStudentIds);
            setIsAllStudentsSelected(true);
        } catch (error) {
            toast.error("Failed to fetch exams and students");
        } finally {
            setExamsLoading(false);
        }
    };

    const handleFlagChange = async (type: 'left' | 'deactive', checked: boolean) => {
        if (type === 'left') setIncludeLeft(checked);
        if (type === 'deactive') setIncludeDeactive(checked);

        if (selectedSection) {
            await fetchExamsAndStudents(
                Number(selectedYear),
                Number(selectedClass),
                Number(selectedSection),
                type === 'left' ? checked : includeLeft,
                type === 'deactive' ? checked : includeDeactive
            );
        }
    };

    const filteredStudents = students.filter(s =>
        s.amsT_FirstName.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.amsT_AdmNo.toLowerCase().includes(studentSearch.toLowerCase())
    );

    const toggleSelectAllStudents = (checked: boolean) => {
        setIsAllStudentsSelected(checked);
        if (checked) {
            setSelectedStudents(students.map(s => s.amsT_Id));
        } else {
            setSelectedStudents([]);
        }
    };

    const toggleStudent = (id: number) => {
        let newSelected = [...selectedStudents];
        if (newSelected.includes(id)) {
            newSelected = newSelected.filter(s => s !== id);
            setIsAllStudentsSelected(false);
        } else {
            newSelected.push(id);
            if (newSelected.length === students.length) {
                setIsAllStudentsSelected(true);
            }
        }
        setSelectedStudents(newSelected);
    };

    const handleSearch = () => {
        if (!selectedYear || !selectedClass || !selectedSection || !selectedExam) {
            toast.warning("Please select Year, Class, Section and Exam");
            return;
        }

        if (selectedStudents.length === 0) {
            toast.warning("Please select at least one student");
            return;
        }

        onSearch({
            ASMAY_Id: Number(selectedYear),
            ASMCL_Id: Number(selectedClass),
            ASMS_Id: Number(selectedSection),
            EME_ID: Number(selectedExam),
            AMST_Ids: selectedStudents,
            applicableflag: displayApplicable,
            nonapplicableflag: displayNonApplicable,
            // Pass these to parent for local grid handling if needed, 
            // though search request only needs flags for backend logic if any.
            // The display flags are mainly for the grid view.
        });
    };

    const handleResetFilter = () => {
        onReset();
        // Reset local states
        setSelectedClass('');
        setSelectedSection('');
        setSelectedExam('');
        setClasses([]);
        setSections([]);
        setExams([]);
        setStudents([]);
        setSelectedStudents([]);
    };

    return (
        <Card className="shadow-md border-primary/10">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-primary">
                    <Search className="h-5 w-5" />
                    Cumulative Report Filter
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Dropdowns */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="year">Academic Year <span className="text-destructive">*</span></Label>
                                <Select value={selectedYear} onValueChange={handleYearChange}>
                                    <SelectTrigger id="year">
                                        <SelectValue placeholder="Select Academic Year" />
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
                                <Label htmlFor="class">Class <span className="text-destructive">*</span></Label>
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
                                <Label htmlFor="section">Section <span className="text-destructive">*</span></Label>
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
                                <Label htmlFor="exam">Exam Name <span className="text-destructive">*</span></Label>
                                <Select value={selectedExam} onValueChange={setSelectedExam} disabled={!selectedSection || examsLoading}>
                                    <SelectTrigger id="exam">
                                        <SelectValue placeholder="Select Exam Name" />
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
                        </div>
                    </div>

                    {/* Right Column: Student List */}
                    <div className="border rounded-md p-4 flex flex-col h-[300px]">
                        <div className="flex items-center justify-between mb-2">
                            <Label className="text-base font-semibold">Student List <span className="text-destructive">*</span></Label>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="selectAll"
                                    checked={isAllStudentsSelected}
                                    onCheckedChange={(checked) => toggleSelectAllStudents(checked as boolean)}
                                    disabled={students.length === 0}
                                />
                                <Label htmlFor="selectAll">Select All</Label>
                            </div>
                        </div>
                        <Input
                            placeholder="Search Student..."
                            value={studentSearch}
                            onChange={(e) => setStudentSearch(e.target.value)}
                            className="mb-3"
                        />
                        <ScrollArea className="flex-1 pr-4">
                            {students.length === 0 && (
                                <div className="text-center text-muted-foreground py-4">No students found</div>
                            )}
                            <div className="space-y-2">
                                {filteredStudents.map((student) => (
                                    <div key={student.amsT_Id} className="flex items-center space-x-2 border-b last:border-0 pb-2">
                                        <Checkbox
                                            id={`student-${student.amsT_Id}`}
                                            checked={selectedStudents.includes(student.amsT_Id)}
                                            onCheckedChange={() => toggleStudent(student.amsT_Id)}
                                        />
                                        <Label htmlFor={`student-${student.amsT_Id}`} className="cursor-pointer text-sm font-normal">
                                            {student.amsT_FirstName} ({student.amsT_AdmNo})
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>

                {/* Bottom Section: Report Options */}
                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                    <Label className="font-semibold block mb-2">Report Configuration</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="includeLeft" checked={includeLeft} onCheckedChange={(c) => handleFlagChange('left', c as boolean)} />
                            <Label htmlFor="includeLeft">Include Left Students</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="includeDeactive" checked={includeDeactive} onCheckedChange={(c) => handleFlagChange('deactive', c as boolean)} />
                            <Label htmlFor="includeDeactive">Include De-active</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="applicable" checked={displayApplicable} onCheckedChange={(c) => setDisplayApplicable(c as boolean)} />
                            <Label htmlFor="applicable">Only Applicable</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="nonApplicable" checked={displayNonApplicable} onCheckedChange={(c) => setDisplayNonApplicable(c as boolean)} />
                            <Label htmlFor="nonApplicable">Only Non-Applicable</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="percentage" checked={displayPercentage} onCheckedChange={(c) => setDisplayPercentage(c as boolean)} />
                            <Label htmlFor="percentage">Display Percentage</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="overallGrade" checked={displayOverallGrade} onCheckedChange={(c) => setDisplayOverallGrade(c as boolean)} />
                            <Label htmlFor="overallGrade">Over All Grade</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="classRank" checked={displayClassRank} onCheckedChange={(c) => setDisplayClassRank(c as boolean)} />
                            <Label htmlFor="classRank">Class Rank</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="sectionRank" checked={displaySectionRank} onCheckedChange={(c) => setDisplaySectionRank(c as boolean)} />
                            <Label htmlFor="sectionRank">Section Rank</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="attendance" checked={notDisplayAttendance} onCheckedChange={(c) => setNotDisplayAttendance(c as boolean)} />
                            <Label htmlFor="attendance">Not Display Attendance</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="grade" checked={displayGrade} onCheckedChange={(c) => setDisplayGrade(c as boolean)} />
                            <Label htmlFor="grade">Display Grade</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="marks" checked={displayMarks} onCheckedChange={(c) => setDisplayMarks(c as boolean)} />
                            <Label htmlFor="marks">Display Marks</Label>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-4 pt-4">
                    <Button
                        variant="destructive"
                        onClick={handleResetFilter}
                        className="min-w-[120px]"
                    >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSearch}
                        disabled={isLoading || examsLoading}
                        className="min-w-[120px]"
                    >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                        Report
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
