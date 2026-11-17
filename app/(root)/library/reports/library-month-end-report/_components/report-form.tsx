'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLibraryMonthEndReportInitialData } from '@/hooks/library/reports/useLibraryMonthEndReport';
import type { ILibraryMonthEndReportRequest } from '@/types/library/reports/library-month-end-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
    ASMAY_Id: z.preprocess((val) => Number(val), z.number().min(1, 'Academic Year is required')),
    IVRM_Month_Id: z.preprocess((val) => Number(val), z.number().min(1, 'Month is required')),
    year: z.string().min(1, 'Year is required') // This refers to the specific calendar year selected
    // iename: z.string().optional(), // Keeping it optional as it was just an input for display
});

interface ReportFormProps {
    onSearch: (data: ILibraryMonthEndReportRequest) => void;
    isLoading: boolean;
}

export const ReportForm = ({ onSearch, isLoading }: ReportFormProps) => {
    const { data: initialData, isLoading: isInitialLoading } = useLibraryMonthEndReportInitialData();
    const [yearsList, setYearsList] = useState<string[]>([]);

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        reset
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {}
    });

    const selectedAcademicYearId = watch('ASMAY_Id');

    // Logic to populate Year dropdown based on Academic Year
    useEffect(() => {
        if (selectedAcademicYearId && initialData?.acdlist) {
            const selectedYear = initialData.acdlist.find((y) => y.asmaY_Id === selectedAcademicYearId);
            if (selectedYear) {
                const yearParts = selectedYear.asmaY_Year.split('-');
                if (yearParts.length >= 1) {
                    const y1 = yearParts[0];
                    const y2 = yearParts[1];
                    // Legacy code logic: s1 = year.substring(0, 4); s2 = year.substring(year.length, 5);
                    // But typically '2023-2024' split gives ['2023', '2024']
                    const tempYears = [];
                    if (y1) tempYears.push(y1);
                    if (y2) tempYears.push(y2);
                    setYearsList(tempYears);
                } else {
                    setYearsList([selectedYear.asmaY_Year]);
                }
            }
        } else {
            setYearsList([]);
        }
    }, [selectedAcademicYearId, initialData]);

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        onSearch(values);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {/* Academic Year Selection */}
                <div className='space-y-2'>
                    <Label>
                        Academic Year <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        control={control}
                        name='ASMAY_Id'
                        render={({ field }) => (
                            <Select
                                onValueChange={(val) => {
                                    field.onChange(val);
                                    setValue('year', ''); // Reset year on academic year change
                                }}
                                value={field.value?.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Academic Year' />
                                </SelectTrigger>
                                <SelectContent>
                                    {initialData?.acdlist?.map((item) => (
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

                {/* Month Selection */}
                <div className='space-y-2'>
                    <Label>
                        Month <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        control={control}
                        name='IVRM_Month_Id'
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Month' />
                                </SelectTrigger>
                                <SelectContent>
                                    {initialData?.monthlist?.map((item) => (
                                        <SelectItem key={item.ivrM_Month_Id} value={item.ivrM_Month_Id.toString()}>
                                            {item.ivrM_Month_Name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.IVRM_Month_Id && <p className='text-red-500 text-sm'>{errors.IVRM_Month_Id.message}</p>}
                </div>

                {/* Year Selection (Dependent) */}
                <div className='space-y-2'>
                    <Label>
                        Year <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        control={control}
                        name='year'
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value} disabled={yearsList.length === 0}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Year' />
                                </SelectTrigger>
                                <SelectContent>
                                    {yearsList.map((y) => (
                                        <SelectItem key={y} value={y}>
                                            {y}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.year && <p className='text-red-500 text-sm'>{errors.year.message}</p>}
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
