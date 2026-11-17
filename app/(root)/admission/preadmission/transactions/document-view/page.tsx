'use client';

import { Button } from '@/components/ui/button';
import type { DataTableRef } from '@/components/ui/data-table/data-table';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { Label } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown } from '@/hooks/admission/preadmission/useMasters';
import {
    useActivePreadmissionDetails,
    useDocumentView,
    usePreadmissionClassDropdown
} from '@/hooks/admission/preadmission/useTransactions';
import type { IPreadmissionDocumentView } from '@/types/admission/preadmission/transactions';
import { CheckSquare } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { use, useEffect, useRef, useState } from 'react';
import { DocumentViewColoumn } from './_components/columns';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function DocumentView(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const router = useRouter();
    const pathname = usePathname();

    const tableRef = useRef<DataTableRef>(null);

    const { data: activePreadmission } = useActivePreadmissionDetails();
    const { data: classOptions, isLoading: classLoading, isError: classError } = usePreadmissionClassDropdown();
    const { data: academicYearOptions, isLoading: academicYearLoading, isError: academicYearError } = useAcademicYearDropdown();

    // Filters
    const [classId, setClassId] = useState(0);
    const [academicYearId, setAcademicYearId] = useState(0);

    // (moved) effects that depend on refetchStudents are placed after hook below

    // Table selection
    const [selectedStudents, setSelectedStudents] = useState<IPreadmissionDocumentView[]>([]);

    const {
        data: response,
        isLoading: studentsLoading,
        error,
        refetch: refetchStudents
    } = useDocumentView(academicYearId ?? 0, classId, searchParams);

    // Auto-select first academic year when options load so details populate
    useEffect(() => {
        if ((academicYearId ?? 0) === 0 && academicYearOptions?.data && academicYearOptions.data.length > 0) {
            setAcademicYearId(Number(academicYearOptions.data[0].asmaY_Id));
        }
    }, [academicYearOptions]);

    // When academic year changes, ensure students data is fetched immediately
    useEffect(() => {
        if (academicYearId && typeof refetchStudents === 'function') {
            refetchStudents();
        }
    }, [academicYearId, refetchStudents]);

    const tableProps = useDataTableProps(response);

    const handleSelectStudent = (selectedRows: IPreadmissionDocumentView[]) => {
        setSelectedStudents(selectedRows);
    };

    useEffect(() => {
        if (activePreadmission?.data) {
            setAcademicYearId(activePreadmission.data.asmaY_Id ?? 0);
        }
    }, [activePreadmission]);

    const handleFilterChange = (filterType: 'class' | 'academic_year', value: number) => {
        if (filterType === 'class') {
            setClassId(value);
        } else {
            setAcademicYearId(value);
        }

        // Reset to page 1 when filter changes
        const params = new URLSearchParams(searchParams as any);
        params.set('page', '1');
        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className='min-h-screen'>
            {/* Filters Header */}
            <div className='mb-3 flex w-fit flex-col gap-4 rounded-xl border p-4 shadow-xl'>
                <div className='flex flex-wrap justify-start gap-6'>
                    {/* Academic Year Filter */}
                    <div className='flex w-full flex-col gap-2 sm:w-56'>
                        <Label htmlFor='academic-year' className='mb-1 font-semibold'>
                            Academic Year
                        </Label>
                        {/* <Select
                            value={academicYearId !== 0 ? String(academicYearId) : undefined}
                            onValueChange={(value) => setAcademicYearId(Number(value))}> */}
                        <Select
                            onValueChange={(value) => handleFilterChange('academic_year', Number(value))}
                            value={academicYearId !== 0 ? academicYearId?.toString() || undefined : undefined}>
                            <SelectTrigger id='academic-year'>
                                <SelectValue placeholder='Select Academic Year' />
                            </SelectTrigger>
                            <SelectContent>
                                {academicYearLoading ? (
                                    <SelectItem value='loading' disabled>
                                        Loading...
                                    </SelectItem>
                                ) : academicYearError ? (
                                    <SelectItem value='error' disabled>
                                        Error loading
                                    </SelectItem>
                                ) : (
                                    academicYearOptions?.data?.map((item) => (
                                        <SelectItem key={item.asmaY_Id} value={String(item.asmaY_Id)}>
                                            {item.asmaY_Year}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Class Filter */}
                    <div className='flex w-full flex-col gap-2 sm:w-56'>
                        <Label htmlFor='class' className='mb-1 font-semibold'>
                            Class
                        </Label>
                        <Select
                            onValueChange={(value) => {
                                handleFilterChange('class', Number(value));
                            }}
                            value={classId?.toString() || undefined}>
                            <SelectTrigger id='class'>
                                <SelectValue placeholder='Select Class' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='0'>All</SelectItem>
                                {classLoading ? (
                                    <SelectItem value='loading' disabled>
                                        Loading...
                                    </SelectItem>
                                ) : classError ? (
                                    <SelectItem value='error' disabled>
                                        Error loading
                                    </SelectItem>
                                ) : (
                                    classOptions?.data?.map((item) => (
                                        <SelectItem key={item.asmcL_Id} value={String(item.asmcL_Id)}>
                                            {item.asmcL_ClassName}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className='container space-y-4 p-1'>
                <CollapsibleSection
                    defaultOpen
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    {selectedStudents.length > 0 && (
                        <div className='flex w-full justify-end'>
                            <Button variant='default' className='h-8 w-fit gap-2'>
                                <CheckSquare className='h-4 w-4' />
                                Update Status ({selectedStudents.length})
                            </Button>
                        </div>
                    )}

                    <GenericDataTable<IPreadmissionDocumentView>
                        {...tableProps}
                        ref={tableRef}
                        columns={DocumentViewColoumn}
                        isLoading={studentsLoading}
                        error={error}
                        showViewOptions={false}
                        loadingMessage='Loading preadmission applications...'
                        noDataTitle='No Data Found'
                        noDataDescription='No preadmission applications found.'
                        errorTitle='Error Loading Preadmission Applications'
                        onRowSelectionChange={handleSelectStudent}
                    />
                </CollapsibleSection>
            </div>
        </div>
    );
}
