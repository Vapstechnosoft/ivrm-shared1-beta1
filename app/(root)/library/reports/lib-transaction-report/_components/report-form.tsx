'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLibTransactionReportInitialData } from '@/hooks/library/reports/useLibTransactionReport';
import type { ILibTransactionReportRequest } from '@/types/library/reports/lib-transaction-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
    LMAL_Id: z.preprocess((val) => Number(val), z.number().min(1, 'Library Name is required')),
    ASMAY_Id: z.preprocess((val) => Number(val), z.number().min(1, 'Academic Year is required')),
    statuscount: z.boolean().default(false),
    Issue_Date: z.date({ required_error: 'From Date is required' }),
    IssueToDate: z.date({ required_error: 'To Date is required' })
});

interface ReportFormProps {
    onSearch: (data: ILibTransactionReportRequest) => void;
    isLoading: boolean;
}

export const ReportForm = ({ onSearch, isLoading }: ReportFormProps) => {
    const { data: initialData, isLoading: isInitialLoading } = useLibTransactionReportInitialData();

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            statuscount: false
        }
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        onSearch({
            ...values,
            Issue_Date: values.Issue_Date.toISOString(),
            IssueToDate: values.IssueToDate.toISOString()
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                {/* Library Selection */}
                <div className='space-y-2'>
                    <Label>
                        Library Name <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        control={control}
                        name='LMAL_Id'
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Library' />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.isArray(initialData?.msterliblist1) &&
                                        initialData?.msterliblist1?.map((item) => (
                                            <SelectItem key={item.lmaL_Id} value={item.lmaL_Id.toString()}>
                                                {item.lmaL_LibraryName}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.LMAL_Id && <p className='text-red-500 text-sm'>{errors.LMAL_Id.message}</p>}
                </div>

                {/* Academic Year Selection */}
                <div className='space-y-2'>
                    <Label>
                        Academic Year <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        control={control}
                        name='ASMAY_Id'
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Year' />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.isArray(initialData?.yearlist) &&
                                        initialData?.yearlist?.map((item) => (
                                            <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                {item.asmaY_Year}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.ASMAY_Id && <p className='text-red-500 text-sm'>{errors.ASMAY_Id.message}</p>}
                </div>

                {/* Status Count Checkbox */}
                <div className='flex h-[72px] flex-row items-end space-x-3 space-y-0 rounded-md border p-4'>
                    <Controller
                        control={control}
                        name='statuscount'
                        render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} />}
                    />
                    <div className='space-y-1 leading-none'>
                        <Label>Status Count</Label>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                {/* From Date */}
                <div className='space-y-2'>
                    <Label>
                        From Date <span className='text-red-500'>*</span>
                    </Label>
                    {/* <Controller
                        control={control}
                        name="Issue_Date"
                        render={({ field }) => (
                            <DatePickerWithYear
                                date={field.value}
                                setDate={field.onChange}
                                placeholder="Select Date"
                                disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                            />
                        )}
                    /> */}
                    {errors.Issue_Date && <p className='text-red-500 text-sm'>{errors.Issue_Date.message}</p>}
                </div>

                {/* To Date */}
                <div className='space-y-2'>
                    <Label>
                        To Date <span className='text-red-500'>*</span>
                    </Label>
                    {/* <Controller
                        control={control}
                        name="IssueToDate"
                        render={({ field }) => (
                            <DatePickerWithYear
                                date={field.value}
                                setDate={field.onChange}
                                placeholder="Select Date"
                                disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                            />
                        )}
                    /> */}
                    {errors.IssueToDate && <p className='text-red-500 text-sm'>{errors.IssueToDate.message}</p>}
                </div>
            </div>

            <div className='flex justify-center gap-2'>
                <Button type='submit' disabled={isLoading || isInitialLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Generating...
                        </>
                    ) : (
                        'Report'
                    )}
                </Button>
                <Button type='button' variant='destructive' onClick={() => reset()}>
                    Cancel
                </Button>
            </div>
        </form>
    );
};
