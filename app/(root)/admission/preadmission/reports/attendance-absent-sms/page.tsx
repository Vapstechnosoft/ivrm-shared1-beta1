'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { CalendarIcon, Save } from 'lucide-react';

import React, { useState } from 'react';
import { toast } from 'sonner';

import { CalendarYear } from '@/components/ui/calendar_year';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAcademicYearDropdown } from '@/hooks/admission/preadmission/useMasters';
import { useAttendanceAbsentSmsReport } from '@/hooks/admission/preadmission/useReports';
import { cn } from '@/lib/utils';
import { getExcelAttendanceAbsentSmsReport } from '@/server/admission/preadmission/reports/month_end_report';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { absentStudentColumns, attendanceSummaryColumns } from './_components/columns';

// helper to compare local dates
const isSameLocalDate = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

// Local schema for this form (only allow today's date)
const attendanceAbsentSmsSchema = z.object({
    frequency: z.enum(['once', 'twice']).default('once'),
    asmaY_Id: z.number().min(1, 'Academic Year is required'),
    from_date: z
        .string()
        .nonempty('Date is required')
        .refine((val) => {
            const d = new Date(val);
            return isSameLocalDate(d, new Date());
        }, "Only today's date is allowed")
});
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type FormFields = z.infer<typeof attendanceAbsentSmsSchema>;

export default function StudyCertificateReportPage(props: {
    searchParams: SearchParams;
}) {
    const searchParams = (React as any).use(props.searchParams);
    const [openPopover, setOpenPopover] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(attendanceAbsentSmsSchema),
        defaultValues: {
            frequency: 'once',
            from_date: new Date().toISOString()
        }
    });

    // Dropdown data
    const { data: academicYears, isLoading: ayLoading } = useAcademicYearDropdown();
    const asmaY_Id = watch('asmaY_Id');
    const from_date = watch('from_date');
    const frequency = watch('frequency');

    const { data: response, refetch, isLoading: reportLoading } = useAttendanceAbsentSmsReport(asmaY_Id, from_date, frequency, searchParams);

    const onSubmit = async () => {
        if (!asmaY_Id || asmaY_Id === 0) {
            toast.error('Please select Academic Year');
            return;
        }
        setIsLoading(true);
        try {
            const { data } = await refetch();
            if (data?.message) {
                toast.success(data.message);
            } else if (!data?.data?.studentAttendanceList?.length && !data?.data?.absentStudentList?.length) {
                toast.error('No data found for the selected criteria');
            }
        } catch {
            toast.error('Failed to generate report');
        } finally {
            setIsLoading(false);
        }
    };

    const downloadExcel = async () => {
        try {
            if (!asmaY_Id || !from_date || !frequency) {
                toast.error('Please fill all required fields!');
                return;
            }

            const response = await getExcelAttendanceAbsentSmsReport(asmaY_Id, from_date, frequency, searchParams);

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
            link.download = 'AttendanceAbsentSmsReport.xlsx';
            document.body.appendChild(link);
            link.click();

            // Cleanup
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

    const studentAttendanceList = (response as any)?.data?.studentAttendanceList ?? [];
    const absentStudentList = (response as any)?.data?.absentStudentList ?? [];
    const totalAttendanceRecords = (response as any)?.data?.totalAttendanceRecords ?? 0;
    const totalAbsentRecords = (response as any)?.data?.totalAbsentRecords ?? 0;

    return (
        <div className='min-h-screen space-y-6'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='mb-4 rounded-xl border bg-card p-6 shadow-xl'>
                    {/* ──────────────── RADIO BUTTONS (ADDED ON TOP) ──────────────── */}
                    <div className='mb-6 text-center'>
                        <div className='mt-3 mb-6 flex justify-center'>
                            <Controller
                                name='frequency'
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup value={field.value} onValueChange={field.onChange} className='flex gap-6'>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='once' id='once' />
                                            <Label htmlFor='once'>
                                                Daily Once<span className='text-red-500'>*</span>
                                            </Label>
                                        </div>

                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='twice' id='twice' />
                                            <Label htmlFor='twice'>
                                                Daily Twice<span className='text-red-500'>*</span>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />

                            {errors.frequency && <FormError>{errors.frequency.message}</FormError>}
                        </div>
                    </div>

                    {/* ──────────────── Filters Grid ──────────────── */}
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2'>
                        {/* Academic Year */}
                        <div className='flex flex-col gap-1.5'>
                            <Label>
                                Academic Year <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='asmaY_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString()}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Academic Year' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ayLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading...
                                                </SelectItem>
                                            ) : (
                                                academicYears?.data?.map((y) => (
                                                    <SelectItem key={y.asmaY_Id} value={y.asmaY_Id.toString()}>
                                                        {y.asmaY_Year}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.asmaY_Id && <FormError>{errors.asmaY_Id.message}</FormError>}
                        </div>

                        {/* Date Picker */}
                        <Controller
                            name='from_date'
                            control={control}
                            render={({ field }) => (
                                <div className='flex flex-col gap-1.5'>
                                    <Label>
                                        Date <span className='text-red-500'>*</span>
                                    </Label>
                                    <Popover
                                        open={openPopover === 'From_Date'}
                                        onOpenChange={(open) => setOpenPopover(open ? 'From_Date' : null)}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                type='button'
                                                variant='outline'
                                                className={cn(
                                                    'justify-start text-left font-normal',
                                                    !field.value && 'text-muted-foreground',
                                                    errors.from_date && 'border-red-500'
                                                )}>
                                                <CalendarIcon className='mr-2 h-4 w-4' />
                                                {field.value ? format(new Date(field.value), 'dd/MM/yyyy') : 'Pick a date'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-auto p-0' align='start'>
                                            <CalendarYear
                                                mode='single'
                                                selected={field.value ? new Date(field.value) : undefined}
                                                onSelect={(date) => {
                                                    if (!date) return;
                                                    if (!isSameLocalDate(date, new Date())) {
                                                        toast.error("Please select today's date");
                                                        return;
                                                    }
                                                    date && field.onChange(date.toISOString());
                                                    setOpenPopover(null);
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.from_date && <FormError>{errors.from_date.message}</FormError>}
                                </div>
                            )}
                        />
                    </div>

                    {/* ─────────────── Action Buttons ─────────────── */}
                    <div className='mt-6 flex justify-start gap-3 border-t pt-4'>
                        <Button type='button' variant='outline' onClick={() => reset()} disabled={isSubmitting} className='w-fit'>
                            Reset
                        </Button>

                        <Button type='submit' disabled={isSubmitting} isLoading={isLoading || isSubmitting} className='w-fit'>
                            <Save className='mr-2 h-4 w-4' />
                            Report
                        </Button>
                        <Button type='button' onClick={downloadExcel} className='w-fit'>
                            Export to Excel
                        </Button>
                    </div>
                </div>
            </form>

            <div className='container space-y-8 p-0'>
                {/* Summary Table Section */}
                <CollapsibleSection
                    title='Overall Daily Attendance Summary'
                    defaultOpen={true}
                    variant='outline'
                    size='md'
                    className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                    <GenericDataTable
                        data={studentAttendanceList}
                        totalItems={totalAttendanceRecords}
                        columns={attendanceSummaryColumns}
                        isLoading={reportLoading}
                        loadingMessage='Loading Attendance Summary...'
                        noDataTitle='No Attendance Data'
                        noDataDescription='Please generate the report to see results.'
                        showViewOptions={false}
                    />
                </CollapsibleSection>

                {/* Absent Students Section */}
                <CollapsibleSection
                    title='Absent Student List'
                    defaultOpen={true}
                    variant='outline'
                    size='md'
                    className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                    <GenericDataTable
                        data={absentStudentList}
                        totalItems={totalAbsentRecords}
                        columns={absentStudentColumns}
                        isLoading={reportLoading}
                        loadingMessage='Loading Absent Students...'
                        noDataTitle='No Absent Students'
                        noDataDescription='No absent students found for the selected criteria.'
                        showViewOptions={false}
                    />
                </CollapsibleSection>
            </div>
        </div>
    );
}
