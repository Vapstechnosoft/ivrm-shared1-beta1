'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useDeleteAttendance,
    useSaveStudentAttendance,
    useStudentAttendanceSearch,
    useViewAttendanceDetails
} from '@/hooks/admission/preadmission/attendance-entry/useStudentAttendance';
import { useAcademicYearDropdown, useMasterClassDropdown, useMasterSectionDropdown } from '@/hooks/admission/preadmission/useMasters';
import type {
    StudentAttendanceDetail,
    StudentAttendanceStudent
} from '@/server/admission/preadmission/attendance-entry/student_attendance';
import { Eye, Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { AttendanceDetailsModal } from './_components/AttendanceDetailsModal';
import { studentAttendanceColumns } from './_components/columns';

export default function StudentAttendancePage() {
    // Phase control logic
    // Phase 1: Academic Year + Class selected
    // Phase 2: Section + Date selected (Daily Once default)
    // Phase 3: Search clicked -> Table shown

    // State for selections
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedSection, setSelectedSection] = useState<string>('');
    const [attendanceType, setAttendanceType] = useState<string>('DailyOnce');
    const [doe, setDoe] = useState<string>(new Date().toISOString().slice(0, 10)); // Default to today

    const [searched, setSearched] = useState(false);
    const [students, setStudents] = useState<StudentAttendanceStudent[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<StudentAttendanceStudent[]>([]);
    const [noDataMessage, setNoDataMessage] = useState<string>('');

    // View Period Wise Modal State
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewData, setViewData] = useState<StudentAttendanceDetail[]>([]);

    // Selection state
    const [selectedRows, setSelectedRows] = useState<StudentAttendanceStudent[]>([]);

    // Fetch Masters
    const { data: academicYears } = useAcademicYearDropdown();
    const { data: classes } = useMasterClassDropdown();
    const { data: sections } = useMasterSectionDropdown();

    // API Hooks
    const searchMutation = useStudentAttendanceSearch();
    const viewMutation = useViewAttendanceDetails();
    const deleteMutation = useDeleteAttendance();
    const saveMutation = useSaveStudentAttendance();

    const handleSearch = () => {
        if (!selectedYear || !selectedClass || !selectedSection || !doe) {
            // Basic client side validation could be added here
            return;
        }

        const payload = {
            ASMAY_Id: Number(selectedYear),
            ASMCL_Id: Number(selectedClass),
            ASMS_Id: Number(selectedSection),
            ClassSecFlag: 0,
            ASA_FromDate: doe,
            MonthFlag1:
                attendanceType === 'DailyOnce' ? 'D' : attendanceType === 'DailyTwice' ? 'T' : attendanceType === 'Monthly' ? 'M' : 'P'
        };

        setSearched(true);
        setStudents([]);
        setFilteredStudents([]);
        setNoDataMessage('');

        searchMutation.mutate(payload, {
            onSuccess: (response) => {
                if (response.success && response.data) {
                    const list = response.data.studentList || [];
                    if (list.length === 0) {
                        setNoDataMessage('No Student Found');
                    }
                    setStudents(list);
                    setFilteredStudents(list);
                } else {
                    setNoDataMessage(response.message || 'No Data Available');
                }
            },
            onError: (error) => {
                console.error('Search error:', error);
                setNoDataMessage('An error occurred while fetching data.');
            }
        });
    };

    const handleTextSearch = (query: string) => {
        if (!query) {
            setFilteredStudents(students);
            return;
        }
        const lowerQuery = query.toLowerCase();
        const filtered = students.filter(
            (student) =>
                student.studentName.toLowerCase().includes(lowerQuery) ||
                student.amsT_AdmNo.toLowerCase().includes(lowerQuery) ||
                student.amaY_RollNo.toString().includes(lowerQuery)
        );
        setFilteredStudents(filtered);
    };

    const handleViewPeriodWise = () => {
        // Requirement: "pass this from all the field" -> ASMAY_Id, ASMCL_Id, ASMS_Id, att_entry_type
        if (!selectedYear || !selectedClass) {
            toast.error('Please select Academic Year and Class');
            return;
        }

        // Section is optional in some logic, but usually required. The user curl has ASMS_Id.
        if (!selectedSection) {
            toast.error('Please select Section');
            return;
        }

        const payload = {
            ASMAY_Id: Number(selectedYear),
            ASMCL_Id: Number(selectedClass),
            ASMS_Id: Number(selectedSection),
            att_entry_type: 'Daily' // The user curl shows 'Daily' or 'Dailyonce'.
        };

        // Use `attendanceType`.
        const finalPayload = {
            ...payload,
            att_entry_type: attendanceType
        };

        setViewModalOpen(true);

        viewMutation.mutate(finalPayload, {
            onSuccess: (response) => {
                if (response?.success && response?.data) {
                    setViewData(response.data.attendanceDetails || []);
                    if ((response.data.attendanceDetails || []).length === 0) {
                        toast.info('No attendance records found');
                    }
                } else {
                    setViewData([]);
                    // User requirements: "and if respond something like this then on popup show no data found"
                    toast.info(response?.message || 'No Data Found');
                }
            },
            onError: (error) => {
                console.error('View error:', error);
                setViewData([]);
                toast.error('Failed to fetch attendance details');
            }
        });
    };

    const handleDeleteRecord = (id: number) => {
        deleteMutation.mutate(id, {
            onSuccess: (response) => {
                if (response?.success) {
                    toast.success('Record deleted successfully');
                    // Remove from local state
                    setViewData((prev) => prev.filter((item) => item.asA_Id !== id));
                } else {
                    toast.error(response?.message || 'Failed to delete record');
                }
            },
            onError: (error) => {
                console.error('Delete error:', error);
                toast.error('Error deleting record');
            }
        });
    };

    const handleSave = () => {
        if (!selectedYear || !selectedClass || !selectedSection || !doe) {
            toast.error('Please ensure all fields (Year, Class, Section, Date) are selected.');
            return;
        }

        if (students.length === 0) {
            toast.error('No students to save.');
            return;
        }

        // Identify Present (selected) vs Absent (not selected)
        // Note: selectedRows contains the students that are CHECKED in the table.
        // We assume Checked = Present (pdays: 1), Unchecked = Absent (pdays: 0).

        const selectedIds = new Set(selectedRows.map((s) => s.amsT_Id));

        const stdList = selectedRows.map((s) => ({
            ...s,
            asaS_Id: s.asaS_Id || 0,
            asA_Id: s.asA_Id || 0,
            selected: true,
            firstHalfflag: true,
            secondHalfflag: true,
            pdays: 1
        }));

        // Find students present in the main 'students' list but not in 'selectedRows'
        const apsentStdList = students
            .filter((s) => !selectedIds.has(s.amsT_Id))
            .map((s) => ({
                ...s,
                asaS_Id: s.asaS_Id || 0,
                asA_Id: s.asA_Id || 0,
                selected: true,
                firstHalfflag: false,
                secondHalfflag: false,
                pdays: 0
            }));

        const payload = {
            username: '',
            asmaY_Id: Number(selectedYear),
            asmcL_Id: Number(selectedClass),
            asmS_Id: Number(selectedSection),
            asA_Att_Type: attendanceType === 'DailyOnce' ? 'Dailyonce' : attendanceType,
            asA_Entry_DateTime: new Date().toISOString(),
            asA_FromDate: new Date(doe).toISOString(),
            asA_ToDate: new Date(doe).toISOString(),
            asA_ClassHeld: 1, // Default value as per curl
            asA_Network_IP: '::1', // Default IP
            asA_Regular_Extra: 'Regular',
            ttmP_Id: 0,
            ismS_Id: 0,
            asasB_Id: 0,
            asA_Id: 0,
            ismP_Id: 0,
            pamS_Id: 0,
            stdList: stdList,
            apsentStdList: apsentStdList
        };

        saveMutation.mutate(payload, {
            onSuccess: (response) => {
                // Adjust success check based on API response structure
                if (response?.success || response?.returnval === true) {
                    toast.success('Attendance saved successfully');
                } else {
                    toast.error(response?.message || 'Failed to save attendance');
                }
            },
            onError: (error) => {
                console.error('Save error:', error);
                toast.error('An error occurred while saving attendance.');
            }
        });
    };

    const tableProps = {
        data: filteredStudents,
        totalItems: filteredStudents.length,
        isLoading: searchMutation.isPending,
        error: null,
        success: true
    };

    // Phase 1 is always active.
    // Phase 2 triggers when Class is selected.
    const showPhase2 = !!selectedClass;

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <CollapsibleSection title='ATTENDANCE ENTRY' defaultOpen={true} variant='default' size='lg' className='shadow-lg'>
                    <div className='grid grid-cols-1 gap-6 p-4'>
                        {/* -------------------- PHASE 1 & 2 Inputs -------------------- */}
                        <div className='space-y-6'>
                            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                                {/* Academic Year */}
                                <div className='grid grid-cols-1 items-center gap-2 md:grid-cols-[150px_1fr] md:gap-4'>
                                    <Label htmlFor='academic-year' className='text-left font-medium text-sm md:text-right'>
                                        Academic Year: <span className='text-red-500'>*</span>
                                    </Label>
                                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                                        <SelectTrigger id='academic-year' className='border-blue-400'>
                                            <SelectValue placeholder='Select Academic Year' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {academicYears?.data?.map((year) => (
                                                <SelectItem key={year.asmaY_Id} value={year.asmaY_Id.toString()}>
                                                    {year.asmaY_Year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Class */}
                                <div className='grid grid-cols-1 items-center gap-2 md:grid-cols-[150px_1fr] md:gap-4'>
                                    <Label htmlFor='class-select' className='text-left font-medium text-sm md:text-right'>
                                        Class: <span className='text-red-500'>*</span>
                                    </Label>
                                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                                        <SelectTrigger id='class-select' className='border-purple-600'>
                                            <SelectValue placeholder='Select Class' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes?.data?.map((cls) => (
                                                <SelectItem key={cls.asmcL_Id} value={cls.asmcL_Id.toString()}>
                                                    {cls.asmcL_ClassName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Phase 2: Show only if Class is selected */}
                            {showPhase2 && (
                                <div className='rounded-md border border-gray-200 bg-white p-4 shadow-sm'>
                                    <div className='mb-4 flex items-center justify-between border-b pb-2'>
                                        <h3 className='font-bold text-blue-900 text-lg uppercase'>DAILY ONCE</h3>
                                        <div className='flex gap-2'>
                                            <Button
                                                variant='default'
                                                size='sm'
                                                className='bg-primary/90 hover:bg-primary'
                                                onClick={handleViewPeriodWise}>
                                                <Eye className='mr-2 h-4 w-4' /> View Period Wise Attendance
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Attendance Type Radios */}
                                    <div className='flex justify-center pb-6'>
                                        <RadioGroup value={attendanceType} onValueChange={setAttendanceType} className='flex gap-6'>
                                            <div className='flex items-center space-x-2'>
                                                <RadioGroupItem value='DailyOnce' id='r1' />
                                                <Label htmlFor='r1'>Daily Once</Label>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                <RadioGroupItem value='DailyTwice' id='r2' />
                                                <Label htmlFor='r2'>Daily Twice</Label>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                <RadioGroupItem value='Monthly' id='r3' />
                                                <Label htmlFor='r3'>Monthly</Label>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                <RadioGroupItem value='PeriodWise' id='r4' />
                                                <Label htmlFor='r4'>Period Wise</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                                        {/* Section */}
                                        <div className='grid grid-cols-1 items-center gap-2 md:grid-cols-[150px_1fr] md:gap-4'>
                                            <Label htmlFor='section-select' className='text-left font-medium text-sm md:text-right'>
                                                Section: <span className='text-red-500'>*</span>
                                            </Label>
                                            <Select value={selectedSection} onValueChange={setSelectedSection}>
                                                <SelectTrigger id='section-select' className='border-blue-400'>
                                                    <SelectValue placeholder='Select Section' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {sections?.data?.map((sec) => (
                                                        <SelectItem key={sec.asmS_Id} value={sec.asmS_Id.toString()}>
                                                            {sec.asmC_SectionName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Date of Entry */}
                                        <div className='grid grid-cols-1 items-center gap-2 md:grid-cols-[150px_1fr] md:gap-4'>
                                            <Label htmlFor='doe' className='text-left font-medium text-sm md:text-right'>
                                                DOE: <span className='text-red-500'>*</span>
                                            </Label>
                                            <input
                                                type='date'
                                                id='doe'
                                                value={doe}
                                                onChange={(e) => setDoe(e.target.value)}
                                                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className='flex justify-end pt-2'>
                                <Button onClick={handleSearch} className='bg-orange-600 text-white hover:bg-orange-700'>
                                    <Search className='mr-2 h-4 w-4' /> Search
                                </Button>
                            </div>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* -------------------- PHASE 3: Student List -------------------- */}
                {searched && (
                    <CollapsibleSection title='STUDENT DETAILS' defaultOpen={true} variant='default' size='lg' className='shadow-lg'>
                        {/* Status Message or Search Filter */}
                        <div className='mb-4 flex flex-col gap-4 p-4 md:flex-row md:justify-between'>
                            <h3 className='font-bold text-blue-600 text-lg'>
                                {noDataMessage ? noDataMessage : 'Attendance Entry Type Is Absent'}
                            </h3>
                            {!noDataMessage && students.length > 0 && (
                                <div className='w-full md:w-1/3'>
                                    <div className='relative'>
                                        <Search className='absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground' />
                                        <Input
                                            placeholder='Search Student Name, Adm No, Roll No...'
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTextSearch(e.target.value)}
                                            className='pl-8'
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {!noDataMessage && students.length > 0 && (
                            <>
                                <GenericDataTable<StudentAttendanceStudent>
                                    {...tableProps}
                                    columns={studentAttendanceColumns}
                                    isLoading={searchMutation.isPending}
                                    showViewOptions={false}
                                    loadingMessage='Loading students...'
                                    noDataTitle='No Students Found'
                                    onRowSelectionChange={setSelectedRows}
                                />
                                <div className='flex justify-end gap-4 p-4'>
                                    <Button
                                        className='bg-blue-800 text-white hover:bg-blue-900'
                                        onClick={handleSave}
                                        disabled={saveMutation.isPending}>
                                        {saveMutation.isPending ? 'Saving...' : 'Save'}
                                    </Button>
                                    <Button
                                        variant='destructive'
                                        onClick={() => {
                                            setSearched(false);
                                            setStudents([]);
                                            setSelectedYear('');
                                            setSelectedClass('');
                                            setSelectedSection('');
                                            setDoe(new Date().toISOString().slice(0, 10));
                                        }}>
                                        Cancel
                                    </Button>
                                </div>
                            </>
                        )}
                        {noDataMessage && students.length === 0 && (
                            <div className='p-8 text-center text-muted-foreground'>{noDataMessage}</div>
                        )}
                    </CollapsibleSection>
                )}

                {/* View Period Wise Modal */}
                <AttendanceDetailsModal
                    isOpen={viewModalOpen}
                    onClose={() => setViewModalOpen(false)}
                    data={viewData}
                    isLoading={viewMutation.isPending}
                    onDelete={handleDeleteRecord}
                    isDeleting={deleteMutation.isPending}
                />
            </div>
        </div>
    );
}
