'use client';

import { Button } from '@/components/ui/button';
import { CalendarYear } from '@/components/ui/calendar_year';
import { FormError } from '@/components/ui/extension/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PREADMISSION_QUERY_KEYS } from '@/constants/query-keys';
import { useAcademicYearDropdown, useMasterClassDropdown } from '@/hooks/admission/preadmission/useMasters';
import { cn } from '@/lib/utils';
import { masterStudentCountReportSchema } from '@/schemas/admission/preadmission/reports';
import { addOrUpdateStudentCountReport } from '@/server/admission/preadmission/reports/student_count_report';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Save } from 'lucide-react';
import { useState } from 'react';
import { Label } from 'react-aria-components';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterStudentCountReportSchema.addOrUpdate>;

interface AddStudentCountReportFormProps {
    onSuccess?: () => void;
    className?: string;
    searchParams?: any;
    onFilterChange?: (payload: any) => void;
}

export default function AddStudentCountReportForm({
    onSuccess,
    className = '',
    searchParams,
    onFilterChange
}: AddStudentCountReportFormProps) {
    const [reportType, setReportType] = useState<string>('2');
    const [rangeType, setRangeType] = useState<string>('between');
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');
    const [results, setResults] = useState<Array<any>>([]);
    const queryClient = useQueryClient();

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterStudentCountReportSchema.addOrUpdate),
        mode: 'onChange'
    });

    const {
        data: academicYear,
        isLoading: academicYearLoading,
        error: academicYearError,
        refetchAll: refetchAcademicYear
    } = useAcademicYearDropdown();
    const {
        data: masterClass,
        isLoading: masterClassLoading,
        error: masterClassError,
        refetchAll: refetchMasterClass
    } = useMasterClassDropdown();
    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const payload = {
                type: rangeType,
                report_type: Number(reportType),
                from_date: rangeType === 'between' && fromDate ? new Date(fromDate).toISOString() : new Date().toISOString(),
                to_date: rangeType === 'between' && toDate ? new Date(toDate).toISOString() : new Date().toISOString(),
                asmay_id: data.asmaY_Id || 0,
                asmcl_id: data.asmcL_Id || 0
            };

            const response = await addOrUpdateStudentCountReport(payload, searchParams);

            // Update parent state with the current filter payload
            if (onFilterChange) {
                onFilterChange(payload);
            }

            if (response.success) {
                toast.success(response.message);
                setResults(response.data || []);
                try {
                    // If API already returned pagination meta (total), use it directly
                    if (response?.total != null) {
                        queryClient.setQueryData([PREADMISSION_QUERY_KEYS.STUDENT_COUNT_REPORT, searchParams ?? {}], response);
                    } else if (Array.isArray(response?.data)) {
                        // derive page and page_size from searchParams (they may be strings or arrays)
                        const parseParam = (k: string) => {
                            const v = (searchParams as any)?.[k];
                            if (Array.isArray(v)) return Number(v[0]);
                            return v != null ? Number(v) : undefined;
                        };
                        const page = parseParam('page') || 1;
                        const pageSize = parseParam('page_size') || 10;
                        const total = response.data.length;
                        const start = (page - 1) * pageSize;
                        const pageData = response.data.slice(start, start + pageSize);

                        queryClient.setQueryData([PREADMISSION_QUERY_KEYS.STUDENT_COUNT_REPORT, searchParams ?? {}], {
                            data: pageData,
                            total,
                            success: true,
                            message: response.message
                        });
                    } else {
                        // fallback: set whatever was returned
                        queryClient.setQueryData([PREADMISSION_QUERY_KEYS.STUDENT_COUNT_REPORT, searchParams ?? {}], response);
                    }
                } catch (e) {
                    // noop
                }
                reset();
                setReportType('2');
                setRangeType('between');
                setFromDate('');
                setToDate('');
                refetchAcademicYear();
                refetchMasterClass();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleReset = () => {
        reset();
        setReportType('2');
        setRangeType('between');
    };
    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='rounded-lg bg-white p-6 shadow'>
                        <div className='grid grid-cols-1 items-center gap-10 lg:grid-cols-3'>
                            {/* Left column - report select */}
                            <div className='col-span-1'>
                                <Label className='mb-2 block font-medium text-gray-700 text-sm'>Select Report Type</Label>
                                <Select onValueChange={(v) => setReportType(v)} defaultValue={reportType}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Select report type' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='1'>Registered list</SelectItem>
                                        <SelectItem value='2'>Registered but not filled application form</SelectItem>
                                        <SelectItem value='3'>Registered and filled application form</SelectItem>
                                        <SelectItem value='4'>Registration payment done list (Application datewise)</SelectItem>
                                        <SelectItem value='5'>Registration payment not done list</SelectItem>
                                        <SelectItem value='6'>Partial/Admission payment done list</SelectItem>
                                        <SelectItem value='7'>Sibling students list (Paid Students)</SelectItem>
                                        <SelectItem value='8'>Transferred student (Admission Confirm)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className='mt-2 text-primary text-xs'>Registered students who completed the application form</p>
                            </div>

                            {/* Middle column - range radio + dates */}
                            <div className='col-span-1'>
                                <Label className='mb-2 block font-medium text-gray-700 text-sm'>Select Range</Label>
                                <div className='mb-3 flex items-center gap-6'>
                                    <RadioGroup
                                        value={rangeType}
                                        onValueChange={(v) => {
                                            setRangeType(v);
                                            setReportType(v === 'yearwise' ? '1' : '2');
                                        }}
                                        className='flex items-center gap-4'>
                                        <div className='flex items-center gap-2'>
                                            <RadioGroupItem value='yearwise' id='rg-year' />
                                            <label htmlFor='rg-year' className='text-sm'>
                                                Year wise
                                            </label>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <RadioGroupItem value='between' id='rg-between' />
                                            <label htmlFor='rg-between' className='text-sm'>
                                                Between Dates
                                            </label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {rangeType === 'between' && (
                                    <div className='flex gap-2'>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    type='button'
                                                    variant='outline'
                                                    className={cn(
                                                        'w-full justify-start text-left font-normal',
                                                        !fromDate && 'text-muted-foreground'
                                                    )}>
                                                    <CalendarIcon className='mr-2 h-4 w-4' />
                                                    {fromDate ? format(new Date(fromDate), 'dd/MM/yyyy') : 'From date'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className='w-auto p-0' align='start'>
                                                <CalendarYear
                                                    mode='single'
                                                    selected={fromDate ? new Date(fromDate) : undefined}
                                                    onSelect={(date: Date | undefined) => setFromDate(date?.toISOString() ?? '')}
                                                    captionLayout='dropdown'
                                                    fromYear={2000}
                                                    toYear={2050}
                                                />
                                            </PopoverContent>
                                        </Popover>

                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    type='button'
                                                    variant='outline'
                                                    className={cn(
                                                        'w-full justify-start text-left font-normal',
                                                        !toDate && 'text-muted-foreground'
                                                    )}>
                                                    <CalendarIcon className='mr-2 h-4 w-4' />
                                                    {toDate ? format(new Date(toDate), 'dd/MM/yyyy') : 'To date'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className='w-auto p-0' align='start'>
                                                <CalendarYear
                                                    mode='single'
                                                    selected={toDate ? new Date(toDate) : undefined}
                                                    onSelect={(date: Date | undefined) => setToDate(date?.toISOString() ?? '')}
                                                    captionLayout='dropdown'
                                                    fromYear={2000}
                                                    toYear={2050}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                )}

                                {rangeType === 'yearwise' && (
                                    <div className='group flex flex-col gap-1.5'>
                                        <Label aria-label='academic-year' htmlFor='asmaY_Id'>
                                            Academic Year <span className='ml-1 text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            name='asmaY_Id'
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    key={field.value || 'empty'}
                                                    onValueChange={(value) => {
                                                        const numValue = Number(value);
                                                        field.onChange(numValue);
                                                    }}
                                                    value={field.value?.toString() || ''}>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder='Select a Academic Year' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {academicYearLoading ? (
                                                            <SelectItem value='loading' disabled>
                                                                Loading Academic Year...
                                                            </SelectItem>
                                                        ) : academicYearError ? (
                                                            <SelectItem value='error' disabled>
                                                                Error loading Academic Year
                                                            </SelectItem>
                                                        ) : (
                                                            academicYear?.data?.map((item) => (
                                                                <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                                    {item.asmaY_Year}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.asmaY_Id && <FormError>{errors.asmaY_Id.message}</FormError>}
                                    </div>
                                )}
                            </div>
                            {reportType &&
                                ![
                                    '1', // Registered list
                                    '2' // Registered but not filled application form
                                ].includes(reportType) && (
                                    <div className='group flex flex-col gap-1.5'>
                                        <Label aria-label='Class' htmlFor='asmcL_Id'>
                                            Class <span className='ml-1 text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            name='asmcL_Id'
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    key={field.value || 'empty'}
                                                    onValueChange={(value) => {
                                                        field.onChange(Number(value));
                                                    }}
                                                    value={field.value?.toString() || ''}>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder='Select a Class' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {masterClassLoading ? (
                                                            <SelectItem value='loading' disabled>
                                                                Loading Class...
                                                            </SelectItem>
                                                        ) : masterClassError ? (
                                                            <SelectItem value='error' disabled>
                                                                Error loading Class
                                                            </SelectItem>
                                                        ) : (
                                                            masterClass?.data?.map((item) => (
                                                                <SelectItem key={item.asmcL_Id} value={item.asmcL_Id.toString()}>
                                                                    {item.asmcL_ClassName}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.asmcL_Id && <FormError>{errors.asmcL_Id.message}</FormError>}
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* Root Error */}
                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                {/* Action Buttons */}
                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                        Reset
                    </Button>
                    <Button
                        type='submit'
                        disabled={isSubmitting}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            search
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
