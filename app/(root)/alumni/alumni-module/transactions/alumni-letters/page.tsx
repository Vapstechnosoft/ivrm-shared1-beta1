'use client';

import FilterForm from '@/app/(root)/alumni/alumni-module/transactions/alumni-letters/_components/filter-form';
import { LetterTemplates } from '@/app/(root)/alumni/alumni-module/transactions/alumni-letters/_components/letter-templates';
import type { AlumniLettersSchema } from '@/app/(root)/alumni/alumni-module/transactions/alumni-letters/_components/schema';
import StudentList from '@/app/(root)/alumni/alumni-module/transactions/alumni-letters/_components/student-list';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import {
    getAlumniLettersClassData,
    getAlumniLettersReport,
    getAlumniLettersShowReport,
    getAlumniLettersYearData
} from '@/server/alumni/alumni-letters';
import type { IAcademicYear, IAlumniLetterStudent, IClassDetails } from '@/types/alumni/alumni-letters';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function AlumniLettersPage() {
    const [years, setYears] = useState<IAcademicYear[]>([]);
    const [classes, setClasses] = useState<IClassDetails[]>([]);
    const [students, setStudents] = useState<IAlumniLetterStudent[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [reportStudents, setReportStudents] = useState<IAlumniLetterStudent[]>([]);
    const [filterValues, setFilterValues] = useState<AlumniLettersSchema | null>(null);

    const printRef = useRef<HTMLDivElement>(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [yearRes, classRes] = await Promise.all([getAlumniLettersYearData(), getAlumniLettersClassData()]);

            // Handle both wrapped ApiResponse and raw array responses
            const yearData = (yearRes as any).success
                ? yearRes.data || []
                : Array.isArray(yearRes)
                  ? yearRes
                  : (yearRes as any).newuser1 || [];
            const classData = (classRes as any).success
                ? classRes.data || []
                : Array.isArray(classRes)
                  ? classRes
                  : (classRes as any).newuser2 || [];

            if (yearData && Array.isArray(yearData)) {
                setYears(yearData);
            }

            if (classData && Array.isArray(classData)) {
                setClasses(classData);
            }

            if (!yearData?.length && !classData?.length) {
                toast.error('Failed to load initial data or no data found');
            }
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
        } catch (error) {
            toast.error('Failed to load initial data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleShowReport = useCallback(async (values: AlumniLettersSchema) => {
        setIsSearching(true);
        setFilterValues(values);
        try {
            const res = await getAlumniLettersShowReport({
                ASMAY_Id: Number(values.asmaY_Id),
                ASMCL_Id: Number(values.asmcL_Id),
                logoname: values.reporttype
            });
            if (res.success && res.data) {
                const studentList = res.data;
                setStudents(studentList);
                setSelectedIds([]);
                if (studentList.length === 0) {
                    toast.info('No records found for the selected criteria.');
                }
            }
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
        } catch (error) {
            toast.error('Error fetching students');
        } finally {
            setIsSearching(false);
        }
    }, []);

    const handleClear = useCallback(() => {
        setStudents([]);
        setSelectedIds([]);
        setReportStudents([]);
        setFilterValues(null);
    }, []);

    const toggleAll = useCallback(
        (checked: boolean) => {
            if (checked) {
                setSelectedIds(students.map((s) => s.amsT_Id));
            } else {
                setSelectedIds([]);
            }
        },
        [students]
    );

    const toggleStudent = useCallback((id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds((prev) => [...prev, id]);
        } else {
            setSelectedIds((prev) => prev.filter((i) => i !== id));
        }
    }, []);

    const handlePrint = () => {
        window.print();
        setReportStudents([]);
    };

    const generateReportAndPrint = async (values: AlumniLettersSchema) => {
        if (!values || selectedIds.length === 0) {
            toast.error('Please select students to print letters.');
            return;
        }

        // Update local state so LetterTemplates gets correct letterType
        setFilterValues(values);

        setIsSearching(true);
        try {
            const res = await getAlumniLettersReport({
                ASMAY_Id: Number(values.asmaY_Id),
                ASMCL_Id: Number(values.asmcL_Id),
                letter_list: values.letter_list,
                logoname: values.reporttype,
                studlistdata: selectedIds.map((id) => ({ AMST_ID: id }))
            });

            const reportList = res.data || [];

            if (res.success && reportList.length > 0) {
                setReportStudents(reportList);
                // We need to wait for the reportStudents to be rendered before printing
                setTimeout(() => {
                    handlePrint();
                }, 500);
            } else {
                toast.error('Failed to generate report for selected students.');
            }
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
        } catch (error) {
            toast.error('Error generating report');
        } finally {
            setIsSearching(false);
        }
    };

    if (isLoading) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
        );
    }

    return (
        // biome-ignore lint/nursery/useSortedClasses: <explanation>
        <div className='container space-y-6 p-4 min-h-screen'>
            {/* Filter and Student List - Hidden during printing */}
            <div className='no-print space-y-6'>
                <div className='flex items-center justify-between'>
                    {/* biome-ignore lint/nursery/useSortedClasses: <explanation> */}
                    <h2 className='text-2xl font-bold tracking-tight'>Alumni Letters</h2>
                </div>

                <CollapsibleSection title='Filter Criteria' defaultOpen={true} variant='default'>
                    <FilterForm
                        years={years}
                        classes={classes}
                        onShowReport={handleShowReport}
                        onClear={handleClear}
                        onPrint={generateReportAndPrint}
                        canPrint={selectedIds.length > 0}
                    />
                </CollapsibleSection>

                {students.length > 0 && (
                    <CollapsibleSection title='Filtered Students' defaultOpen={true} variant='outline'>
                        {isSearching ? (
                            <div className='flex justify-center p-8'>
                                <Loader2 className='h-8 w-8 animate-spin text-primary' />
                            </div>
                        ) : (
                            <StudentList
                                students={students}
                                selectedIds={selectedIds}
                                onToggleAll={toggleAll}
                                onToggleStudent={toggleStudent}
                            />
                        )}
                    </CollapsibleSection>
                )}
            </div>

            {/* Letter Templates - Only visible during printing or as requested */}
            <div className='print-only'>
                <LetterTemplates
                    ref={printRef}
                    students={reportStudents}
                    letterType={filterValues?.letter_list || ''}
                    displayDateTime={filterValues?.display_DateandTime}
                />
            </div>
        </div>
    );
}
