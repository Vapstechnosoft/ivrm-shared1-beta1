'use client';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown } from '@/hooks/admission/preadmission/useMasters';
import { useStudentsByAcademicYear, useTCCancelDetails } from '@/hooks/admission/preadmission/useStudentTc';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Printer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { type TCCancelDetail, tcCancelDetailsColumns } from './_components/columns';

export default function StudentTCCancelPage() {
    const [isMounted, setIsMounted] = useState(false);
    const [selectedYear, setSelectedYear] = useState<string>('');

    useEffect(() => {
        setIsMounted(true);
    }, []);
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
    const [openStudentCombo, setOpenStudentCombo] = useState(false);
    const [tableData, setTableData] = useState<TCCancelDetail[]>([]);
    const [showTable, setShowTable] = useState(false);

    // Fetch Academic Years
    const { data: academicYears } = useAcademicYearDropdown();

    // Fetch Students by Academic Year
    const { data: studentsList } = useStudentsByAcademicYear(Number(selectedYear));

    // API Mutation
    const searchMutation = useTCCancelDetails();

    if (!isMounted) {
        return null;
    }

    // Safely extract list regardless of response structure (Direct array vs Wrapped in .data)
    const rawStudents = Array.isArray(studentsList) ? studentsList : Array.isArray(studentsList?.data) ? studentsList.data : [];

    // Deduplicate students based on amsT_Id
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const uniqueStudents = rawStudents
        .filter((s: any) => s?.amsT_Id)
        .filter((student: any, index: number, self: any[]) => index === self.findIndex((t: any) => t.amsT_Id === student.amsT_Id));

    // Helper to get selected student name
    const selectedStudentName = uniqueStudents.find((s: any) => s.amsT_Id === selectedStudentId)?.studentName;

    const fetchTCDetails = (yearId: number, studentId: number) => {
        // According to curl: TC_CancelReason=tmp
        const payload = {
            asmayId: yearId,
            amstId: studentId,
            reason: 'tmp'
        };

        setShowTable(true);
        setTableData([]); // clear previous

        searchMutation.mutate(payload, {
            onSuccess: (response: any) => {
                try {
                    // Safe extraction
                    const apiData = response?.data || response;

                    // Prioritize 'studentTCDetails' or 'deletedTCDetails' or 'studentList'
                    let list: any[] = [];

                    if (Array.isArray(apiData?.studentTCDetails) && apiData.studentTCDetails.length > 0) {
                        list = apiData.studentTCDetails;
                    } else if (Array.isArray(apiData?.deletedTCDetails) && apiData.deletedTCDetails.length > 0) {
                        list = apiData.deletedTCDetails;
                    } else if (Array.isArray(apiData)) {
                        list = apiData;
                    } else {
                        // fallback search
                        const possibleKeys = ['studentList', 'studentdetails', 'getdetails', 'data', 'd'];
                        for (const key of possibleKeys) {
                            if (Array.isArray(apiData[key]) && apiData[key].length > 0) {
                                list = apiData[key];
                                break;
                            }
                        }
                        // If still empty, look for ANY array property
                        if (list.length === 0) {
                            const found = Object.values(apiData).find((val) => Array.isArray(val) && val.length > 0);
                            if (found) list = found as any[];
                        }
                    }

                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    const mappedData = list
                        .map((item: any, index: number) => {
                            if (!item) return null;

                            // Safely handle potentially null/undefined values
                            const rawName = item?.studentName || item?.amsT_FirstName || item?.amsT_Name;
                            let name = rawName ? String(rawName) : 'Unknown';

                            const rawTcNo = item?.tcNo || item?.tC_No || item?.astC_TCNO;
                            let tcNo = rawTcNo ? String(rawTcNo) : '-';

                            // Specific hack for the weird generic Name format
                            if (name.includes(':') && (tcNo === '-' || !tcNo)) {
                                const parts = name.split(':');
                                if (parts.length > 1) {
                                    name = parts[0];
                                    tcNo = parts[1];
                                }
                            }

                            const rawAdmNo = item?.amsT_AdmNo || item?.admNo;
                            const admNo = rawAdmNo ? String(rawAdmNo) : '';
                            const displayStudent = admNo ? `${name} : ${admNo}` : name;

                            let colTcDate = '-';
                            const dateVal = item?.tcDate || item?.tC_Date || item?.astC_TCDate;
                            if (dateVal) {
                                try {
                                    colTcDate = new Date(dateVal).toLocaleDateString('en-GB');
                                } catch (e) {
                                    colTcDate = String(dateVal);
                                }
                            }

                            const colReason =
                                item?.reason ||
                                item?.tC_CancelReason ||
                                item?.astC_TCReason ||
                                item?.astC_Remarks ||
                                item?.astC_LeavingReason ||
                                '-';

                            let colDelDate = '-';
                            const delDateVal = item?.deletedDate || item?.tC_CancellationDate || item?.updatedDate;
                            if (delDateVal) {
                                try {
                                    colDelDate = new Date(delDateVal).toLocaleString('en-GB');
                                } catch (e) {
                                    colDelDate = String(delDateVal);
                                }
                            }

                            return {
                                slNo: index + 1,
                                studentDetails: displayStudent,
                                tcNo: tcNo,
                                tcDate: colTcDate,
                                reason: String(colReason),
                                deletedDate: colDelDate
                            };
                        })
                        .filter((item): item is TCCancelDetail => item !== null);

                    if (mappedData.length === 0) {
                        toast.info('No TC Cancel details found for this student.');
                    }

                    if (Array.isArray(mappedData)) {
                        setTableData(mappedData);
                    } else {
                        setTableData([]);
                    }
                } catch (error) {
                    console.error('Error processing TC details:', error);
                    toast.error('An error occurred while processing data.');
                    setTableData([]);
                }
            },
            onError: (error) => {
                console.error('Search error:', error);
                toast.error('Failed to fetch TC Cancel details.');
                setTableData([]);
            }
        });
    };

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <CollapsibleSection title='STUDENT TC CANCEL' defaultOpen={true} variant='default' size='lg' className='shadow-lg'>
                    <div className='grid grid-cols-1 items-center gap-6 md:grid-cols-2'>
                        {/* Academic Year */}
                        <div className='grid grid-cols-[auto_1fr] items-center gap-4'>
                            <Label htmlFor='academic-year-select' className='whitespace-nowrap text-right font-medium text-base'>
                                Academic Year:<span className='text-red-500'>*</span>
                            </Label>
                            <div>
                                <Select
                                    value={selectedYear}
                                    onValueChange={(val) => {
                                        setSelectedYear(val);
                                        setSelectedStudentId(null); // Reset student on year change
                                    }}>
                                    <SelectTrigger id='academic-year-select'>
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
                        </div>

                        {/* Student Name */}
                        <div className='grid grid-cols-[auto_1fr] items-center gap-4'>
                            <Label htmlFor='student-search' className='whitespace-nowrap text-right font-medium text-base'>
                                Student Name :<span className='text-red-500'>*</span>
                            </Label>
                            <div className='relative w-full'>
                                <Popover open={openStudentCombo} onOpenChange={setOpenStudentCombo}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant='outline'
                                            // biome-ignore lint/a11y/useSemanticElements: <explanation>
                                            role='combobox'
                                            aria-expanded={openStudentCombo}
                                            className='w-full justify-between'
                                            disabled={!selectedYear}>
                                            {selectedStudentId ? selectedStudentName || 'Select Student' : 'Select Or Search Student'}
                                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
                                        <Command>
                                            <CommandInput placeholder='Search student...' />
                                            <CommandList>
                                                <CommandEmpty>No student found.</CommandEmpty>
                                                <CommandGroup>
                                                    {uniqueStudents.map((student: any) => (
                                                        <CommandItem
                                                            key={student.amsT_Id}
                                                            value={`${student.studentName} ${student.amsT_AdmNo}`}
                                                            onSelect={() => {
                                                                setSelectedStudentId(student.amsT_Id);
                                                                setOpenStudentCombo(false);
                                                                fetchTCDetails(Number(selectedYear), student.amsT_Id);
                                                            }}>
                                                            <Check
                                                                className={cn(
                                                                    'mr-2 h-4 w-4',
                                                                    selectedStudentId === student.amsT_Id ? 'opacity-100' : 'opacity-0'
                                                                )}
                                                            />
                                                            {student.studentName} ({student.amsT_AdmNo})
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                </CollapsibleSection>

                {showTable && (
                    <CollapsibleSection
                        title='STUDENT TC CANCEL DETAILS'
                        defaultOpen={true}
                        variant='default'
                        size='lg'
                        className='shadow-lg'>
                        <GenericDataTable<TCCancelDetail>
                            data={tableData}
                            totalItems={tableData.length}
                            columns={tcCancelDetailsColumns}
                            isLoading={searchMutation.isPending}
                            showViewOptions={false}
                            noDataTitle='No details found'
                            isSearchRequired={true} // To match "search here..." input in image
                        />

                        {tableData.length > 0 && (
                            <div className='mt-4 flex justify-center'>
                                <Button className='bg-blue-700 text-white hover:bg-blue-800'>
                                    <Printer className='mr-2 h-4 w-4' /> PRINT
                                </Button>
                            </div>
                        )}
                    </CollapsibleSection>
                )}
            </div>
        </div>
    );
}
