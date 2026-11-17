'use client';

import { Button } from '@/components/ui/button';
import { CalendarYear } from '@/components/ui/calendar_year';
import { FormError } from '@/components/ui/extension/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HRMS_QUERY_KEYS } from '@/constants/query-keys';
import { cn } from '@/lib/utils';
import { gpsLocationReportFilterSchema } from '@/schemas/hrms/attendance-management-schemas';
import { getGPSLocationReport } from '@/server/hrms/hrmsConfig/reports/gps-location-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Save } from 'lucide-react';
import { Label } from 'react-aria-components';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof gpsLocationReportFilterSchema>;

interface AddGPSLocationReportFormProps {
    onSuccess?: () => void;
    className?: string;
    searchParams?: any;
}

export default function AddGPSLocationReportForm({ onSuccess, className = '', searchParams }: AddGPSLocationReportFormProps) {
    const queryClient = useQueryClient();

    const {
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(gpsLocationReportFilterSchema),
        mode: 'onChange',
        defaultValues: {
            filterType: 'Between Date',
            employee: '',
            fromDate: '',
            toDate: ''
        }
    });

    const filterTypeValue = watch('filterType');

    const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
        try {
            const payload = {
                filterType: data.filterType,
                employee: data.filterType === 'Employee Wise' ? data.employee : undefined,
                fromDate: data.filterType === 'Between Date' ? data.fromDate : undefined,
                toDate: data.filterType === 'Between Date' ? data.toDate : undefined
            };

            const response = await getGPSLocationReport(payload, searchParams);

            if (response.success) {
                toast.success(response.message || 'Report generated successfully');
                try {
                    if (response?.total != null) {
                        queryClient.setQueryData([HRMS_QUERY_KEYS.GPS_LOCATION_REPORT, searchParams ?? {}], response);
                    } else if (Array.isArray(response?.data)) {
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

                        queryClient.setQueryData([HRMS_QUERY_KEYS.GPS_LOCATION_REPORT, searchParams ?? {}], {
                            data: pageData,
                            total,
                            success: true,
                            message: response.message
                        });
                    } else {
                        queryClient.setQueryData([HRMS_QUERY_KEYS.GPS_LOCATION_REPORT, searchParams ?? {}], response);
                    }
                } catch (e) {
                    // noop
                }
                reset();
                onSuccess?.();
            } else {
                toast.error(response.message || 'Failed to generate report');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to generate report');
        }
    };

    const handleReset = () => {
        reset();
    };

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='rounded-lg bg-white p-6 shadow'>
                        <div className='grid grid-cols-1 items-center gap-10 lg:grid-cols-3'>
                            {/* Filter Type */}
                            <div className='col-span-1'>
                                <Label className='mb-2 block font-medium text-gray-700 text-sm'>
                                    Filter Type <span className='ml-1 text-red-500'>*</span>
                                </Label>
                                <Controller
                                    name='filterType'
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className={errors.filterType ? 'border-red-500' : ''}>
                                                <SelectValue placeholder='Select Filter Type' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='Between Date'>Between Date</SelectItem>
                                                <SelectItem value='Employee Wise'>Employee Wise</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.filterType && <FormError>{errors.filterType.message}</FormError>}
                            </div>

                            {/* Employee - Only show when Employee Wise is selected */}
                            {filterTypeValue === 'Employee Wise' && (
                                <div className='col-span-1'>
                                    <Label className='mb-2 block font-medium text-gray-700 text-sm'>
                                        Employee <span className='ml-1 text-red-500'>*</span>
                                    </Label>
                                    <Controller
                                        name='employee'
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type='text'
                                                {...field}
                                                placeholder='Enter employee name'
                                                className={`w-full rounded-md border px-3 py-2 ${errors.employee ? 'border-red-500' : ''}`}
                                            />
                                        )}
                                    />
                                    {errors.employee && <FormError>{errors.employee.message}</FormError>}
                                </div>
                            )}

                            {/* From Date - Only show when Between Date is selected */}
                            {filterTypeValue === 'Between Date' && (
                                <div className='col-span-1'>
                                    <Label className='mb-2 block font-medium text-gray-700 text-sm'>
                                        From Date <span className='ml-1 text-red-500'>*</span>
                                    </Label>
                                    <Controller
                                        name='fromDate'
                                        control={control}
                                        render={({ field }) => (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        type='button'
                                                        variant='outline'
                                                        className={cn(
                                                            'w-full justify-start text-left font-normal',
                                                            !field.value && 'text-muted-foreground',
                                                            errors.fromDate && 'border-red-500'
                                                        )}>
                                                        <CalendarIcon className='mr-2 h-4 w-4' />
                                                        {field.value ? format(new Date(field.value), 'dd/MM/yyyy') : 'From date'}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className='w-auto p-0' align='start'>
                                                    <CalendarYear
                                                        mode='single'
                                                        selected={field.value ? new Date(field.value) : undefined}
                                                        onSelect={(date: Date | undefined) => field.onChange(date?.toISOString() ?? '')}
                                                        captionLayout='dropdown'
                                                        fromYear={2000}
                                                        toYear={2050}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    />
                                    {errors.fromDate && <FormError>{errors.fromDate.message}</FormError>}
                                </div>
                            )}

                            {/* To Date - Only show when Between Date is selected */}
                            {filterTypeValue === 'Between Date' && (
                                <div className='col-span-1'>
                                    <Label className='mb-2 block font-medium text-gray-700 text-sm'>
                                        To Date <span className='ml-1 text-red-500'>*</span>
                                    </Label>
                                    <Controller
                                        name='toDate'
                                        control={control}
                                        render={({ field }) => (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        type='button'
                                                        variant='outline'
                                                        className={cn(
                                                            'w-full justify-start text-left font-normal',
                                                            !field.value && 'text-muted-foreground',
                                                            errors.toDate && 'border-red-500'
                                                        )}>
                                                        <CalendarIcon className='mr-2 h-4 w-4' />
                                                        {field.value ? format(new Date(field.value), 'dd/MM/yyyy') : 'To date'}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className='w-auto p-0' align='start'>
                                                    <CalendarYear
                                                        mode='single'
                                                        selected={field.value ? new Date(field.value) : undefined}
                                                        onSelect={(date: Date | undefined) => field.onChange(date?.toISOString() ?? '')}
                                                        captionLayout='dropdown'
                                                        fromYear={2000}
                                                        toYear={2050}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    />
                                    {errors.toDate && <FormError>{errors.toDate.message}</FormError>}
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
                        loadingText='Searching...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Search
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
