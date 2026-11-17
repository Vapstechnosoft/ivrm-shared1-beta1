'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HRMS_QUERY_KEYS } from '@/constants/query-keys';
import { foMonthEndReportFilterSchema } from '@/schemas/hrms/attendance-management-schemas';
import { getFOMonthEndReport } from '@/server/hrms/hrmsConfig/reports/fo-monthend-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { Label } from 'react-aria-components';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof foMonthEndReportFilterSchema>;

interface AddFOMonthEndReportFormProps {
    onSuccess?: () => void;
    className?: string;
    searchParams?: any;
}

export default function AddFOMonthEndReportForm({ onSuccess, className = '', searchParams }: AddFOMonthEndReportFormProps) {
    const queryClient = useQueryClient();

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(foMonthEndReportFilterSchema),
        mode: 'onChange',
        defaultValues: {
            year: '',
            month: '',
            ieName: ''
        }
    });

    const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
        try {
            const payload = {
                year: data.year,
                month: data.month,
                ieName: data.ieName
            };

            const response = await getFOMonthEndReport(payload, searchParams);

            if (response.success) {
                toast.success(response.message || 'Report generated successfully');
                try {
                    if (response?.total != null) {
                        queryClient.setQueryData([HRMS_QUERY_KEYS.FO_MONTHEND_REPORT, searchParams ?? {}], response);
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

                        queryClient.setQueryData([HRMS_QUERY_KEYS.FO_MONTHEND_REPORT, searchParams ?? {}], {
                            data: pageData,
                            total,
                            success: true,
                            message: response.message
                        });
                    } else {
                        queryClient.setQueryData([HRMS_QUERY_KEYS.FO_MONTHEND_REPORT, searchParams ?? {}], response);
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

    // Generate year options (current year ± 5 years)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='rounded-lg bg-white p-6 shadow'>
                        <div className='grid grid-cols-1 items-center gap-10 lg:grid-cols-3'>
                            {/* Year */}
                            <div className='col-span-1'>
                                <Label className='mb-2 block font-medium text-gray-700 text-sm'>
                                    Year <span className='ml-1 text-red-500'>*</span>
                                </Label>
                                <Controller
                                    name='year'
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value || ''} onValueChange={field.onChange}>
                                            <SelectTrigger className={errors.year ? 'border-red-500' : ''}>
                                                <SelectValue placeholder='Select Year' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {yearOptions.map((year) => (
                                                    <SelectItem key={year} value={year.toString()}>
                                                        {year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.year && <FormError>{errors.year.message}</FormError>}
                            </div>

                            {/* Month */}
                            <div className='col-span-1'>
                                <Label className='mb-2 block font-medium text-gray-700 text-sm'>
                                    Month <span className='ml-1 text-red-500'>*</span>
                                </Label>
                                <Controller
                                    name='month'
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value || ''} onValueChange={field.onChange}>
                                            <SelectTrigger className={errors.month ? 'border-red-500' : ''}>
                                                <SelectValue placeholder='Select Month' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[
                                                    { value: '01', label: 'January' },
                                                    { value: '02', label: 'February' },
                                                    { value: '03', label: 'March' },
                                                    { value: '04', label: 'April' },
                                                    { value: '05', label: 'May' },
                                                    { value: '06', label: 'June' },
                                                    { value: '07', label: 'July' },
                                                    { value: '08', label: 'August' },
                                                    { value: '09', label: 'September' },
                                                    { value: '10', label: 'October' },
                                                    { value: '11', label: 'November' },
                                                    { value: '12', label: 'December' }
                                                ].map((m) => (
                                                    <SelectItem key={m.value} value={m.value}>
                                                        {m.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.month && <FormError>{errors.month.message}</FormError>}
                            </div>

                            {/* IE Name */}
                            <div className='col-span-1'>
                                <Label className='mb-2 block font-medium text-gray-700 text-sm'>
                                    IE Name <span className='ml-1 text-red-500'>*</span>
                                </Label>
                                <Controller
                                    name='ieName'
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type='text'
                                            {...field}
                                            placeholder='Enter IE Name'
                                            className={`w-full rounded-md border px-3 py-2 ${errors.ieName ? 'border-red-500' : ''}`}
                                        />
                                    )}
                                />
                                {errors.ieName && <FormError>{errors.ieName.message}</FormError>}
                            </div>
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
