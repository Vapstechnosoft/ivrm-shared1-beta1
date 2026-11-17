'use client';

import { Button } from '@/components/ui/button';
import type { DataTableRef } from '@/components/ui/data-table/data-table';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { FormError, Label } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown } from '@/hooks/admission/preadmission/useMasters';
import {
    useActivePreadmissionDetails,
    usePreadmissionClassDropdown,
    useadmissionSectionDropdown
} from '@/hooks/admission/preadmission/useTransactions';
import { cn } from '@/lib/utils';

import { useStudentTcReport } from '@/hooks/admission/preadmission/useReports';
import { StudentTcDetailsSchema } from '@/schemas/admission/preadmission/reports';
import { getExcelStudentTcReport } from '@/server/admission/preadmission/reports/month_end_report';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare, FileText, RotateCcw, Search, Square } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { getMasterAdmissionReportColumns } from './_components/columns';
// import { getMasterAdmissionReportColumns } from "./_components/columns";
import { ColumnValue } from './_components/columnvalue';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
type FormFields = z.infer<typeof StudentTcDetailsSchema>;

export default function StudentTcReportPage(props: {
    searchParams: SearchParams;
}) {
    const searchParams = (React as any).use(props.searchParams);
    const router = useRouter();
    const pathname = usePathname();

    const tableRef = useRef<DataTableRef>(null);

    const handleResetSelection = () => {
        tableRef.current?.resetSelection();
    };
    const {
        setValue,
        watch,
        formState: { errors }
    } = useForm<FormFields>({
        resolver: zodResolver(StudentTcDetailsSchema),
        defaultValues: {
            ASMAY_Id: 0,
            AllOrInd: 1,
            ASMCL_Id: 0,
            ASMC_Id: 0,
            TempararyArrayheadList: []
        }
    });
    const selectedFields = watch('TempararyArrayheadList') || [];

    const handleFilterChange = (filterType: 'class' | 'status' | 'academic_year', value: number) => {
        if (filterType === 'class') {
            setClassId(value);
        } else if (filterType === 'status') {
            setStatusId(value);
        } else if (filterType === 'academic_year') {
            setAcademicYearId(value);
        }

        // Reset to page 1 when filter changes
        const params = new URLSearchParams(searchParams as any);
        params.set('page', '1');
        router.replace(`${pathname}?${params.toString()}`);
    };

    const { data: _activePreadmission, isLoading: activePreadmissionDeLoading } = useActivePreadmissionDetails();

    const { data: academicYearOptions, isLoading: academicYearLoading, isError: academicYearError } = useAcademicYearDropdown();

    const {
        data: preadmissionClass,
        isLoading: preadmissionClassLoading,
        isError: preadmissionClassError
    } = usePreadmissionClassDropdown();

    const [academicYearId, setAcademicYearId] = useState<number>(0);
    const [classId, setClassId] = useState<number>(0);
    const [statusId, setStatusId] = useState<number>(0);
    const [showTable, setShowTable] = useState(false);
    const [fieldSearch, setFieldSearch] = useState('');

    const [viewMode, setViewMode] = useState<1 | 2>(1); // 1 = All, 2 = Individual
    const [tcType, setTcType] = useState<1 | 2>(1); // 1 = Temporary TC, 2 = Permanent TC
    const {
        data: preadmissionSection,
        isLoading: preadmissionSectionLoading,
        isError: preadmissionSectionError
    } = useadmissionSectionDropdown(classId);

    const filteredFields = useMemo(() => {
        return ColumnValue.filter((field) => field.columnName.toLowerCase().includes(fieldSearch.toLowerCase()));
    }, [fieldSearch]);
    const handleFieldToggle = (fieldId: string) => {
        const current = selectedFields || [];
        const isSelected = current.some((f: any) => f.columnID === fieldId);

        const updated = isSelected
            ? current.filter((f: any) => f.columnID !== fieldId)
            : [...current, {
                columnID: fieldId,
                columnName: ColumnValue.find(c => c.columnID === fieldId)?.columnName || ''
            }];

        setValue('TempararyArrayheadList', updated, { shouldValidate: true });
    };

    // Build API payload based on current state
    const buildApiPayload = () => {
        const payload = {
            ASMAY_Id: academicYearId || 0,
            AllOrInd: viewMode === 1 ? 'All' : 'Ind',
            ASMCL_Id: viewMode === 2 ? classId : 0,
            ASMC_Id: viewMode === 2 ? statusId : 0,
            TempararyArrayheadList: selectedFields.map((item: any) => ({
                columnID: item.columnID,
                columnName: item.columnName || ''
            })),
            PermOrTemp: tcType === 1 ? 'Temporary' : 'Permanent',
            AMC_Id: 0

        };
        return payload;
    };

    const tablePayload = buildApiPayload();

    const { data, isLoading, error, refetch } = useStudentTcReport(tablePayload, searchParams, false);

    const columns = useMemo(() => {
        const ids = selectedFields.map((f: any) => f.columnID);
        return getMasterAdmissionReportColumns(ids);
    }, [selectedFields]);

    const tableProps = useDataTableProps({
        data: data?.data || [],
        searchParams,
        totalRecords: data?.totalRecords || 0
    });

    const handleSelectAllFields = () => {
        if (selectedFields.length === filteredFields.length) {
            setValue('TempararyArrayheadList', [], { shouldValidate: true });
        } else {
            setValue(
                'TempararyArrayheadList',
                filteredFields.map((f) => ({
                    columnID: f.columnID,
                    columnName: f.columnName
                })),
                { shouldValidate: true }
            );
        }
    };

    // requestData is used for Excel
    const requestData = buildApiPayload();

    const handleReport = async () => {
        try {
            if (!academicYearId || academicYearId === 0) {
                toast.error('Please select an academic year');
                return;
            }

            if (selectedFields.length === 0) {
                toast.error('Please select at least one column');
                return;
            }

            toast.loading('Loading report...', { id: 'tc-report' });

            // Call API only now
            const response = await refetch();

            if (response) {
                setShowTable(true);
                toast.success('TC Report fetched successfully', { id: 'tc-report' });
            } else {
                setShowTable(false);
                toast.error('No data found', { id: 'tc-report' });
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load report', { id: 'tc-report' });
        }
    };

    const handleReset = () => {
        setAcademicYearId(0);
        setClassId(0);
        setStatusId(0);
        setViewMode(1);
        setTcType(1);
        handleResetSelection();

        // Reset URL params
        router.replace(pathname);

        toast.success('Filters reset successfully');
    };

    const downloadExcel = async () => {
        try {
            const response = await getExcelStudentTcReport(requestData);

            const blob = new Blob([new Uint8Array(response)], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'StudentTcReport.xlsx';
            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
                link.remove();
                window.URL.revokeObjectURL(url);
            }, 100);

            toast.success('Excel downloaded successfully');
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to download Excel');
        }
    };

    return (
        <div className='min-h-screen'>
            {/* Header */}
            <div className='mb-3 flex w-full flex-col gap-4 rounded-xl border p-4 shadow-xl'>
                {/* Filter Options */}
                <div className='flex flex-wrap justify-start gap-6'>
                    {/* View Mode Radio Buttons */}
                    <div className='flex w-full flex-col gap-2 sm:w-56'>
                        <Label className='mb-1 font-semibold'>View</Label>
                        <div className='flex items-center gap-4'>
                            <label className='flex items-center gap-2'>
                                <input type='radio' name='viewMode' checked={viewMode === 1} onChange={() => setViewMode(1)} />
                                <span>All</span>
                            </label>
                            <label className='flex items-center gap-2'>
                                <input type='radio' name='viewMode' checked={viewMode === 2} onChange={() => setViewMode(2)} />
                                <span>Individual</span>
                            </label>
                        </div>
                    </div>

                    {/* Academic Year Filter (always shown) */}
                    <div className='flex w-full flex-col gap-2 sm:w-56'>
                        <Label htmlFor='academic-year' className='mb-1 font-semibold'>
                            Academic Year
                        </Label>
                        <Select
                            onValueChange={(value) => handleFilterChange('academic_year', Number(value))}
                            value={academicYearId !== 0 ? academicYearId?.toString() : undefined}>
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

                    {/* Class & Section only when Individual selected */}
                    {viewMode === 2 && (
                        <>
                            <div className='flex w-full flex-col gap-2 sm:w-56'>
                                <Label htmlFor='class' className='mb-1 font-semibold'>
                                    Class
                                </Label>
                                <Select
                                    onValueChange={(value) => handleFilterChange('class', Number(value))}
                                    value={classId !== 0 ? classId?.toString() : undefined}>
                                    <SelectTrigger id='class'>
                                        <SelectValue placeholder='Select Class' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem key={0} value={'0'}>
                                            All
                                        </SelectItem>
                                        {preadmissionClassLoading ? (
                                            <SelectItem value='loading' disabled>
                                                Loading...
                                            </SelectItem>
                                        ) : preadmissionClassError ? (
                                            <SelectItem value='error' disabled>
                                                Error loading
                                            </SelectItem>
                                        ) : (
                                            preadmissionClass?.data?.map((item) => (
                                                <SelectItem key={item.asmcL_Id} value={item.asmcL_Id.toString()}>
                                                    {item.asmcL_ClassName}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className='flex w-full flex-col gap-2 sm:w-56'>
                                <Label htmlFor='admission-status' className='mb-1 font-semibold'>
                                    Section
                                </Label>
                                <Select
                                    onValueChange={(value) => handleFilterChange('status', Number(value))}
                                    value={statusId !== 0 ? statusId?.toString() : undefined}>
                                    <SelectTrigger id='admission-status'>
                                        <SelectValue placeholder='Select Section' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem key={0} value={'0'}>
                                            All
                                        </SelectItem>
                                        {preadmissionSectionLoading ? (
                                            <SelectItem value='loading' disabled>
                                                Loading...
                                            </SelectItem>
                                        ) : preadmissionSectionError ? (
                                            <SelectItem value='error' disabled>
                                                Error loading
                                            </SelectItem>
                                        ) : (
                                            preadmissionSection?.data?.map((item: any) => (
                                                <SelectItem key={item.asmS_Id} value={item.asmS_Id.toString()}>
                                                    {item.asmC_SectionName}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}

                    {/* TC Type Radio Buttons */}
                    <div className='flex w-full flex-col gap-2 sm:w-56'>
                        <Label className='mb-1 font-semibold'>TC Type</Label>
                        <div className='flex items-center gap-4'>
                            <label className='flex items-center gap-2'>
                                <input
                                    type='radio'
                                    name='tcType'
                                    value='1'
                                    checked={tcType === 1}
                                    onChange={() => setTcType(1)}
                                    className='h-4 w-4'
                                />
                                <span>Temporary TC</span>
                            </label>

                            <label className='flex items-center gap-2'>
                                <input
                                    type='radio'
                                    name='tcType'
                                    value='2'
                                    checked={tcType === 2}
                                    onChange={() => setTcType(2)}
                                    className='h-4 w-4'
                                />
                                <span>Permanent TC</span>
                            </label>
                        </div>
                    </div>

                    {/* Columns Checklist using Popover */}
                </div>
                <div className='w-1/3 space-y-3'>
                    <div className='relative'>
                        <Search className='absolute top-2.5 left-3 h-4 w-4 text-gray-400' />
                        <input
                            type='text'
                            placeholder='Search fields...'
                            value={fieldSearch}
                            onChange={(e) => setFieldSearch(e.target.value)}
                            className='w-full rounded-md border border-gray-300 py-2 pr-3 pl-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                        />
                    </div>

                    <div
                        onClick={handleSelectAllFields}
                        className={cn(
                            'flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 font-medium text-sm transition-all',
                            selectedFields.length === filteredFields.length && filteredFields.length > 0
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-gray-300 hover:border-primary/40'
                        )}>
                        {selectedFields.length === filteredFields.length && filteredFields.length > 0 ? (
                            <CheckSquare className='h-4 w-4 text-primary' />
                        ) : (
                            <Square className='h-4 w-4 text-gray-400' />
                        )}
                        <span>Select All</span>
                    </div>

                    <div className='max-h-60 space-y-1 overflow-y-auto rounded-md border border-gray-300 p-2'>
                        {filteredFields.map((field) => {
                            const selected = selectedFields.some((f: any) => f.columnID === field.columnID);
                            return (
                                <div
                                    key={field.columnID}
                                    onClick={() => handleFieldToggle(field.columnID)}
                                    className={cn(
                                        'flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-all',
                                        selected
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-gray-200 hover:border-primary/40 hover:bg-gray-50'
                                    )}>
                                    {selected ? (
                                        <CheckSquare className='h-4 w-4 text-primary' />
                                    ) : (
                                        <Square className='h-4 w-4 text-gray-400' />
                                    )}
                                    <span>{field.columnName}</span>
                                </div>
                            );
                        })}
                    </div>
                    {errors.TempararyArrayheadList && <FormError>{errors.TempararyArrayheadList.message}</FormError>}
                </div>
                <div className='flex flex-col gap-3 sm:flex-row sm:justify-center'>
                    <Button type='button' onClick={handleReport} className='w-full transition-all duration-200 hover:scale-105 sm:w-fit'>
                        <FileText className='mr-2 h-4 w-4' />
                        Report
                    </Button>

                    <Button variant='outline' className='w-full transition-all duration-200 hover:scale-105 sm:w-fit' onClick={handleReset}>
                        <RotateCcw className='mr-2 h-4 w-4' />
                        Cancel
                    </Button>
                    <Button onClick={downloadExcel} className='w-fit'>
                        Export to Excel
                    </Button>
                </div>
            </div>

            <div className='container space-y-4 p-1'>
                {/* Data Table Section */}
                {showTable && (
                    <CollapsibleSection
                        defaultOpen={true}
                        variant='default'
                        size='lg'
                        className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                        <GenericDataTable
                            {...tableProps}
                            ref={tableRef}
                            columns={columns}
                            isLoading={activePreadmissionDeLoading || isLoading}
                            error={error}
                            showViewOptions={false}
                            loadingMessage='Loading preadmission admissions...'
                            noDataTitle='No Data Found'
                            noDataDescription='No preadmission admissions found.'
                            errorTitle='Error Loading Preadmission Admissions'
                        />
                    </CollapsibleSection>
                )}
            </div>
        </div>
    );
}
