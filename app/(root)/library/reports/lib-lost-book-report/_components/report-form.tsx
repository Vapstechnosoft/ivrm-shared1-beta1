'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLibLostBookReportInitialData } from '@/hooks/library/reports/useLibLostBookReport';
import type { ILibLostBookReportRequest } from '@/types/library/reports/lib-lost-book-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z
    .object({
        LMAL_Id: z.preprocess((val) => Number(val), z.number().min(1, 'Library Name is required')),
        BNBFlg: z.enum(['Book', 'Non-Book']),
        BookType: z.enum(['Issue', 'Reference']),
        datewised: z.boolean().default(false),
        Fromdate: z.date().optional(),
        ToDate: z.date().optional()
    })
    .refine(
        (data) => {
            if (data.datewised) {
                return !!data.Fromdate && !!data.ToDate;
            }
            return true;
        },
        {
            message: "From Date and To Date are required when 'Between Date' is selected",
            path: ['Fromdate']
        }
    );

interface ReportFormProps {
    onSearch: (data: ILibLostBookReportRequest) => void;
    isLoading: boolean;
}

export const ReportForm = ({ onSearch, isLoading }: ReportFormProps) => {
    const { data: initialData, isLoading: isInitialLoading } = useLibLostBookReportInitialData();
    const [isDateEnabled, setIsDateEnabled] = useState(false);

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        reset
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            BNBFlg: 'Book',
            BookType: 'Issue',
            datewised: false
        }
    });

    const datewised = watch('datewised');

    useEffect(() => {
        setIsDateEnabled(datewised);
    }, [datewised]);

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        onSearch({
            ...values,
            Fromdate: values.Fromdate ? values.Fromdate.toISOString() : undefined,
            ToDate: values.ToDate ? values.ToDate.toISOString() : undefined
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
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
                                    {initialData?.lib_list?.map((item) => (
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

                {/* Book / Non-Book Radio */}
                <div className='space-y-2 rounded-md border p-4'>
                    <Controller
                        control={control}
                        name='BNBFlg'
                        render={({ field }) => (
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-row space-x-4'>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Book' id='r-book' />
                                    <Label htmlFor='r-book'>BOOK</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Non-Book' id='r-nonbook' />
                                    <Label htmlFor='r-nonbook'>NON-BOOK</Label>
                                </div>
                            </RadioGroup>
                        )}
                    />
                </div>

                {/* Issue / Reference Radio */}
                <div className='space-y-2 rounded-md border p-4'>
                    <Controller
                        control={control}
                        name='BookType'
                        render={({ field }) => (
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-row space-x-4'>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Issue' id='r-issue' />
                                    <Label htmlFor='r-issue'>ISSUE</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Reference' id='r-reference' />
                                    <Label htmlFor='r-reference'>REFERENCE</Label>
                                </div>
                            </RadioGroup>
                        )}
                    />
                </div>
            </div>

            <div className='grid grid-cols-1 items-end gap-6 rounded-md border bg-muted/20 p-4 md:grid-cols-3'>
                {/* Checkbox */}
                <div className='flex items-center space-x-2 pb-2'>
                    <Controller
                        control={control}
                        name='datewised'
                        render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} id='datewised' />}
                    />
                    <Label htmlFor='datewised'>Between Date (Entry Date)</Label>
                </div>

                {/* From Date */}
                <div className='space-y-2'>
                    <Label>From Date</Label>
                    {/* <Controller
                        control={control}
                        name="Fromdate"
                        render={({ field }) => (
                            <DatePickerWithYear
                                date={field.value}
                                setDate={field.onChange}
                                placeholder="Select Date"
                                disabled={(date) => !isDateEnabled || date > new Date() || date < new Date('1900-01-01')}
                            />
                        )}
                    /> */}
                    {errors.Fromdate && <p className='text-red-500 text-sm'>{errors.Fromdate.message}</p>}
                </div>

                {/* To Date */}
                <div className='space-y-2'>
                    <Label>To Date</Label>
                    {/* <Controller
                        control={control}
                        name="ToDate"
                        render={({ field }) => (
                            <DatePickerWithYear
                                date={field.value}
                                setDate={field.onChange}
                                placeholder="Select Date"
                                disabled={(date) => !isDateEnabled || date > new Date() || date < new Date('1900-01-01')}
                            />
                        )}
                    /> */}
                    {errors.ToDate && <p className='text-red-500 text-sm'>{errors.ToDate.message}</p>}
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
