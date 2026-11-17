'use client';

import { Button } from '@/components/ui/button';
import type { DataTableRef } from '@/components/ui/data-table/data-table';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { FormError } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown } from '@/hooks/admission/preadmission/useMasters';
import { useAdmissionRegister } from '@/hooks/admission/preadmission/useReports';
import { usePreadmissionClassDropdown1 } from '@/hooks/admission/preadmission/useTransactions';
import { cn } from '@/lib/utils';
import { admissionReportSchema } from '@/schemas/admission/preadmission/reports';
import { getExcelAdmissionRegistrationReport } from '@/server/admission/preadmission/reports/month_end_report';
import { getAdmissionRegister } from '@/server/admission/preadmission/reports/student_yearly_attendance';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare, FileSpreadsheet, FileText, Printer, RotateCcw, Search, Square, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { getMasterAdmissionReportColumns } from './_components/columns';

type FormFields = z.infer<typeof admissionReportSchema>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const FIELD_OPTIONS = [
    { id: 'AMST_AdmNo', label: 'Adm No', accessor: 'AMST_AdmNo' },
    { id: 'AMST_FirstName', label: 'First Name', accessor: 'AMST_FirstName' },
    { id: 'AMST_MiddleName', label: 'Middle Name', accessor: 'AMST_MiddleName' },
    { id: 'AMST_LastName', label: 'Last Name', accessor: 'AMST_LastName' },
    { id: 'AMST_Date', label: 'Adm Date', accessor: 'AMST_Date' },
    {
        id: 'AMST_RegistrationNo',
        label: 'Registration No',
        accessor: 'AMST_RegistrationNo'
    },
    { id: 'AMST_Sex', label: 'Gender', accessor: 'AMST_Sex' },
    { id: 'AMST_DOB', label: 'Date of Birth', accessor: 'AMST_DOB' },
    {
        id: 'AMST_DOB_Words',
        label: 'Date of birth(in words)',
        accessor: 'AMST_DOB_Words'
    },
    {
        id: 'AMST_FatherName',
        label: "Father's Name",
        accessor: 'AMST_FatherName'
    },
    {
        id: 'AMST_MotherName',
        label: "Mother's Name",
        accessor: 'AMST_MotherName'
    },
    {
        id: 'AMST_FatherOccupation',
        label: "Father's Occupation",
        accessor: 'AMST_FatherOccupation'
    },
    {
        id: 'AMST_MotherOccupation',
        label: "Mother's Occupation",
        accessor: 'AMST_MotherOccupation'
    },
    {
        id: 'AMST_MotherMonIncome',
        label: "Mother's Income",
        accessor: 'AMST_MotherMonIncome'
    },
    {
        id: 'AMST_FatherMonIncome',
        label: "Father's Income",
        accessor: 'AMST_FatherMonIncome'
    },
    {
        id: 'AMST_Nationality',
        label: 'Nationality',
        accessor: 'AMST_Nationality'
    },
    { id: 'AMST_BloodGroup', label: 'Blood Group', accessor: 'AMST_BloodGroup' },
    { id: 'AMST_MotherTongue', label: 'Language', accessor: 'AMST_MotherTongue' },
    { id: 'AMST_MobileNo', label: 'Phone number', accessor: 'AMST_MobileNo' },
    { id: 'AMST_emailId', label: 'Email id', accessor: 'AMST_emailId' },
    // {
    //     id: 'AMST_PlaceOfBirth',
    //     label: 'Place of Birth',
    //     accessor: 'AMST_PlaceOfBirth'
    // },
    {
        id: 'AMST_AadharNo',
        label: 'Aadhar Card Number',
        accessor: 'AMST_AadharNo'
    },
    { id: 'IVRMMR_Name', label: 'Religion', accessor: 'IVRMMR_Name' }
];

export default function AdmissionReportPage(props: {
    searchParams: SearchParams;
}) {
    const searchParams = (React as any).use(props.searchParams);
    const router = useRouter();
    const currentSearchParams = useSearchParams();
    const tableRef = useRef<DataTableRef>(null);

    const { data: academicYear, isLoading: ayLoading } = useAcademicYearDropdown();
    const [classSearch, setClassSearch] = useState('');
    const [fieldSearch, setFieldSearch] = useState('');
    const [showReport, setShowReport] = useState(false);
    const [requestPayload, setRequestPayload] = useState<any>(null);
    const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
    const [isPrinting, setIsPrinting] = useState(false);
    const [printData, setPrintData] = useState<any[]>([]);

    const {
        data: preadmissionClass,
        isLoading: preadmissionClassLoading,
        isError: preadmissionClassError
    } = usePreadmissionClassDropdown1();

    const {
        control,
        watch,
        setValue,
        reset,
        trigger,
        formState: { errors }
    } = useForm<FormFields>({
        resolver: zodResolver(admissionReportSchema),
        mode: 'onChange',
        defaultValues: {
            academicYear: 0,
            status: 0,
            selectedClasses: [],
            selectedFields: []
        }
    });

    const selectedClasses = watch('selectedClasses');
    const selectedFields = watch('selectedFields');
    const academicYearValue = watch('academicYear');
    const statusValue = watch('status');

    const classOptions = useMemo(() => {
        if (!preadmissionClass?.data) return [];
        return preadmissionClass.data;
    }, [preadmissionClass]);

    const {
        data: response,
        isLoading,
        error,
        refetch: refetchReport
    } = useAdmissionRegister(academicYearValue, statusValue, requestPayload, searchParams);

    useEffect(() => {
        if (showReport && requestPayload && refetchReport) {
            refetchReport();
        }
    }, [requestPayload, showReport, searchParams]);

    const filteredClasses = useMemo(() => {
        return classOptions.filter((cls: any) => cls.asmcL_ClassName.toLowerCase().includes(classSearch.toLowerCase()));
    }, [classOptions, classSearch]);

    const filteredFields = useMemo(() => {
        return FIELD_OPTIONS.filter((field) => field.label.toLowerCase().includes(fieldSearch.toLowerCase()));
    }, [fieldSearch]);

    const columns = useMemo(() => {
        return getMasterAdmissionReportColumns(selectedFields);
    }, [selectedFields]);

    const transformedResponse = useMemo(() => {
        if (!response) return response;

        return {
            ...response,
            data:
                typeof response.data === 'object' && response.data !== null && 'searchstudentDetails' in response.data
                    ? response.data.searchstudentDetails
                    : Array.isArray(response.data)
                        ? response.data
                        : [],
            total: response.total,
            page: response.page,
            page_size: response.page_size
        };
    }, [response]);

    const tableProps = useDataTableProps(transformedResponse);

    const downloadExcel = async () => {
        try {
            const response = await getExcelAdmissionRegistrationReport(academicYearValue, statusValue, requestPayload);

            // Ensure we have a Blob
            const blob =
                response instanceof Blob
                    ? response
                    : new Blob([new Uint8Array(response)], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    });

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Admission Register_Report.xlsx';
            document.body.appendChild(link);
            link.click();

            // Cleanup
            setTimeout(() => {
                link.remove();
                window.URL.revokeObjectURL(url);
            }, 100);

            setShowReport(false);

            toast.success('Excel downloaded successfully');
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to download Excel');
        }
    };

    const handleClassToggle = (classId: number) => {
        const current = selectedClasses || [];
        const updated = current.includes(classId) ? current.filter((c) => c !== classId) : [...current, classId];
        setValue('selectedClasses', updated, { shouldValidate: true });
    };

    const handleFieldToggle = (fieldId: string) => {
        const current = selectedFields || [];
        const updated = current.includes(fieldId) ? current.filter((f) => f !== fieldId) : [...current, fieldId];
        setValue('selectedFields', updated, { shouldValidate: true });
    };

    const handleSelectAllClasses = () => {
        if (selectedClasses.length === filteredClasses.length) {
            setValue('selectedClasses', [], { shouldValidate: true });
        } else {
            setValue(
                'selectedClasses',
                filteredClasses.map((cls: any) => cls.asmcL_Id),
                { shouldValidate: true }
            );
        }
    };

    const handleSelectAllFields = () => {
        if (selectedFields.length === filteredFields.length) {
            setValue('selectedFields', [], { shouldValidate: true });
        } else {
            setValue(
                'selectedFields',
                filteredFields.map((f) => f.id),
                { shouldValidate: true }
            );
        }
    };

    const handleSelectStudent = (selectedRows: any[]) => {
        setSelectedStudents(selectedRows);
    };

    const handleReport = async () => {
        const isValid = await trigger();
        if (isValid) {
            const formData = watch();

            const payload = {
                TempararyArrayListclass: formData.selectedClasses.map((classId) => ({
                    asmcL_Id: classId
                })),
                TempararyArrayListcoloumn: formData.selectedFields.map((fieldId) => ({
                    ivrM_CLM_PAR: fieldId,
                    selected: true
                }))
            };

            setRequestPayload(payload);
            setShowReport(true);

            const params = new URLSearchParams(currentSearchParams.toString());
            params.set('page', '1');
            router.push(`?${params.toString()}`, { scroll: false });

            toast.success('Generating report...');
        } else {
            toast.error('Please fill all required fields');
        }
    };

    const handleReset = () => {
        reset({
            academicYear: 0,
            status: 0,
            selectedClasses: [],
            selectedFields: []
        });
        setClassSearch('');
        setFieldSearch('');
        setShowReport(false);
        setRequestPayload(null);
        setSelectedStudents([]);
        tableRef.current?.resetSelection();

        // Clear URL parameters
        router.push(window.location.pathname, { scroll: false });

        toast.success('Filters reset successfully');
    };

    const handleCancel = () => {
        setShowReport(false);
        setSelectedStudents([]);
        tableRef.current?.resetSelection();
        toast.info('Report cancelled');
    };

    const handlePrint = async () => {
        try {
            setIsPrinting(true);
            toast.info('Preparing print view (fetching all records)...');

            // Fetch all data for printing
            const printSearchParams = {
                page_size: 100000,
                page: 1
            };

            const response: any = await getAdmissionRegister(academicYearValue, statusValue, requestPayload, printSearchParams);

            const allData =
                response?.data && 'searchstudentDetails' in response.data
                    ? response.data.searchstudentDetails
                    : Array.isArray(response?.data)
                        ? response.data
                        : [];

            if (!allData || allData.length === 0) {
                toast.error('No data available to print');
                setIsPrinting(false);
                return;
            }

            setPrintData(allData);

            // Wait for state update and render
            setTimeout(() => {
                window.print();
                // Optional: Reset after print dialog closes (approximate)
                // In many browsers, window.print() is blocking, so this runs after.
                // But for safety/UX, we might keep it or reset it.
                // Let's reset it to restore pagination.
                setIsPrinting(false);
                setPrintData([]); // Clear print data after printing
            }, 1000);
        } catch (error) {
            console.error('Print preparation error:', error);
            toast.error('Failed to prepare print view');
            setIsPrinting(false);
            setPrintData([]); // Clear print data on error
        }
    };

    return (
        <div className='min-h-screen'>
            <style>
                {`
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-report, #printable-report * {
              visibility: visible;
            }
            #printable-report {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .no-print {
              display: none !important;
            }
          }
        `}
            </style>

            <div className='container space-y-4 p-1'>
                <div className='space-y-4'>
                    <CollapsibleSection
                        defaultOpen={true}
                        variant='default'
                        size='lg'
                        title='Admission Register'
                        className='no-print shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                        <div className='space-y-6 p-4'>
                            <div className='space-y-4'>
                                <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
                                    <Label htmlFor='academicYear' className='whitespace-nowrap font-medium'>
                                        Academic Year <span className='ml-1 text-red-500'>*</span>
                                    </Label>
                                    <div className='flex w-full flex-col gap-1.5 sm:w-auto'>
                                        <Controller
                                            name='academicYear'
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    value={field.value > 0 ? field.value.toString() : ''}
                                                    onValueChange={(value) => {
                                                        field.onChange(Number(value));
                                                        trigger('academicYear');
                                                    }}>
                                                    <SelectTrigger className='w-full sm:w-52'>
                                                        <SelectValue placeholder='Select Academic Year' />
                                                    </SelectTrigger>
                                                    <SelectContent className='max-h-60'>
                                                        {ayLoading ? (
                                                            <SelectItem value='loading' disabled>
                                                                Loading...
                                                            </SelectItem>
                                                        ) : (
                                                            academicYear?.data?.map((y) => (
                                                                <SelectItem key={y.asmaY_Id} value={y.asmaY_Id.toString()}>
                                                                    {y.asmaY_Year}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.academicYear && <FormError>{errors.academicYear.message}</FormError>}
                                    </div>
                                </div>

                                <div className='flex flex-col items-center justify-center gap-3'>
                                    <Controller
                                        name='status'
                                        control={control}
                                        render={({ field }) => (
                                            <RadioGroup
                                                value={field.value.toString()}
                                                onValueChange={(value) => field.onChange(Number(value))}
                                                className='flex flex-col items-center space-y-2 sm:flex-row sm:space-x-6 sm:space-y-0'>
                                                <div className='flex items-center space-x-2'>
                                                    <RadioGroupItem value='0' id='all' />
                                                    <label htmlFor='all' className='cursor-pointer text-sm'>
                                                        All
                                                    </label>
                                                </div>
                                                <div className='flex items-center space-x-2'>
                                                    <RadioGroupItem value='1' id='present' />
                                                    <label htmlFor='present' className='cursor-pointer text-sm'>
                                                        Present
                                                    </label>
                                                </div>
                                                <div className='flex items-center space-x-2'>
                                                    <RadioGroupItem value='2' id='left' />
                                                    <label htmlFor='left' className='cursor-pointer text-sm'>
                                                        Left
                                                    </label>
                                                </div>
                                                <div className='flex items-center space-x-2'>
                                                    <RadioGroupItem value='3' id='deactive' />
                                                    <label htmlFor='deactive' className='cursor-pointer text-sm'>
                                                        Deactive
                                                    </label>
                                                </div>
                                            </RadioGroup>
                                        )}
                                    />
                                    {errors.status && <FormError>{errors.status.message}</FormError>}
                                </div>
                            </div>

                            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                                <div className='space-y-3'>
                                    <div className='relative'>
                                        <Search className='absolute top-2.5 left-3 h-4 w-4 text-gray-400' />
                                        <input
                                            type='text'
                                            placeholder='Search classes...'
                                            value={classSearch}
                                            onChange={(e) => setClassSearch(e.target.value)}
                                            className='w-full rounded-md border border-gray-300 py-2 pr-3 pl-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                                        />
                                    </div>

                                    <div
                                        onClick={handleSelectAllClasses}
                                        className={cn(
                                            'flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 font-medium text-sm transition-all',
                                            selectedClasses.length === filteredClasses.length && filteredClasses.length > 0
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-gray-300 hover:border-primary/40'
                                        )}>
                                        {selectedClasses.length === filteredClasses.length && filteredClasses.length > 0 ? (
                                            <CheckSquare className='h-4 w-4 text-primary' />
                                        ) : (
                                            <Square className='h-4 w-4 text-gray-400' />
                                        )}
                                        <span>Select All</span>
                                    </div>

                                    {preadmissionClassLoading ? (
                                        <div className='flex items-center justify-center py-8'>
                                            <p className='text-gray-500 text-sm'>Loading classes...</p>
                                        </div>
                                    ) : preadmissionClassError ? (
                                        <div className='flex items-center justify-center py-8'>
                                            <p className='text-red-500 text-sm'>Error loading classes</p>
                                        </div>
                                    ) : (
                                        <div className='max-h-60 space-y-1 overflow-y-auto rounded-md border border-gray-300 p-2'>
                                            {filteredClasses.map((cls: any) => {
                                                const selected = selectedClasses.includes(cls.asmcL_Id);
                                                return (
                                                    <div
                                                        key={cls.asmcL_Id}
                                                        onClick={() => handleClassToggle(cls.asmcL_Id)}
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
                                                        <span>{cls.asmcL_ClassName}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                    {errors.selectedClasses && <FormError>{errors.selectedClasses.message}</FormError>}
                                </div>

                                <div className='space-y-3'>
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
                                            const selected = selectedFields.includes(field.id);
                                            return (
                                                <div
                                                    key={field.id}
                                                    onClick={() => handleFieldToggle(field.id)}
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
                                                    <span>{field.label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {errors.selectedFields && <FormError>{errors.selectedFields.message}</FormError>}
                                </div>
                            </div>

                            <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                                <Button
                                    type='button'
                                    onClick={handleReport}
                                    className='order-1 w-full transition-all duration-200 hover:scale-105 sm:w-fit'>
                                    <FileText className='mr-2 h-4 w-4' />
                                    Report
                                </Button>

                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={handleReset}
                                    className='order-2 w-full transition-all duration-200 hover:scale-105 sm:w-fit'>
                                    <RotateCcw className='mr-2 h-4 w-4' />
                                    Reset
                                </Button>

                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={handleCancel}
                                    className='order-3 w-full transition-all duration-200 hover:scale-105 sm:w-fit'>
                                    <X className='mr-2 h-4 w-4' />
                                    Cancel
                                </Button>

                                {showReport &&
                                    (response?.data as any)?.searchstudentDetails &&
                                    Array.isArray((response?.data as any)?.searchstudentDetails) &&
                                    (response?.data as any)?.searchstudentDetails.length > 0 && (
                                        <>
                                            <Button
                                                variant='outline'
                                                className='w-full transition-all duration-200 hover:scale-105 sm:w-fit'
                                                onClick={downloadExcel}>
                                                <FileSpreadsheet className='mr-2 h-4 w-4' />
                                                Export to Excel
                                            </Button>
                                            <Button
                                                variant='outline'
                                                className='w-full transition-all duration-200 hover:scale-105 sm:w-fit'
                                                onClick={handlePrint}>
                                                <Printer className='mr-2 h-4 w-4' />
                                                Print
                                            </Button>
                                        </>
                                    )}
                            </div>
                        </div>
                    </CollapsibleSection>

                    {showReport && (
                        <div id='printable-report'>
                            {isPrinting ? (
                                <GenericDataTable
                                    {...tableProps}
                                    ref={tableRef}
                                    columns={columns}
                                    data={printData}
                                    isLoading={printData.length === 0}
                                    error={error}
                                    showViewOptions={false}
                                    isSearchRequired={false}
                                    isPaginationRequired={false}
                                    loadingMessage='Preparing for print...'
                                    noDataTitle='No Admission Reports Found'
                                    noDataDescription='No data available for the selected criteria'
                                    errorTitle='Error Loading Admission Reports'
                                    onRowSelectionChange={handleSelectStudent}
                                />
                            ) : (
                                <CollapsibleSection
                                    defaultOpen={true}
                                    variant='default'
                                    size='lg'
                                    title='Admission Register Report'
                                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                                    {selectedFields.length === 0 ? (
                                        <div className='flex flex-col items-center justify-center space-y-2 py-12'>
                                            <p className='font-medium text-gray-600 text-lg'>No Fields Selected</p>
                                            <p className='text-gray-500 text-sm'>Please select at least one field to display data</p>
                                        </div>
                                    ) : (
                                        <GenericDataTable
                                            {...tableProps}
                                            ref={tableRef}
                                            columns={columns}
                                            data={(transformedResponse?.data as any[]) || []}
                                            isLoading={isLoading}
                                            error={error}
                                            showViewOptions={false}
                                            isPaginationRequired={true}
                                            loadingMessage='Loading Admission Reports...'
                                            noDataTitle='No Admission Reports Found'
                                            noDataDescription='No data available for the selected criteria'
                                            errorTitle='Error Loading Admission Reports'
                                            onRowSelectionChange={handleSelectStudent}
                                        />
                                    )}
                                </CollapsibleSection>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
