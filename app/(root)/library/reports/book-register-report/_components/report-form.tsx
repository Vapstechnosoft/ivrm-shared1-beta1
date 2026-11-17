'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBookRegisterReportInitialData } from '@/hooks/library/reports/useBookRegisterReport';
import type { IBookRegisterReportRequest } from '@/types/library/reports/book-register-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
    Type: z.enum(['all', 'Issue', 'Reference']),
    LMD_Id: z.preprocess((val) => Number(val), z.number().min(0, 'Department is required'))
});

interface ReportFormProps {
    onSearch: (data: IBookRegisterReportRequest) => void;
    isLoading: boolean;
}

export const ReportForm = ({ onSearch, isLoading }: ReportFormProps) => {
    const { data: initialData, isLoading: isInitialLoading } = useBookRegisterReportInitialData();

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            Type: 'all'
        }
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        onSearch(values);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2'>
                {/* Book Type Radio */}
                <div className='space-y-2 rounded-md border p-4'>
                    <h5 className='mb-2 font-medium'>Book Type :-</h5>
                    <hr className='mb-4' />
                    <Controller
                        control={control}
                        name='Type'
                        render={({ field }) => (
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className='flex flex-row justify-center gap-6'>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='all' id='r-all' />
                                    <Label htmlFor='r-all'>ALL</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Issue' id='r-issue' />
                                    <Label htmlFor='r-issue'>Issue</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Reference' id='r-reference' />
                                    <Label htmlFor='r-reference'>Reference</Label>
                                </div>
                            </RadioGroup>
                        )}
                    />
                    {errors.Type && <p className='text-red-500 text-sm'>{errors.Type.message}</p>}
                </div>

                {/* Department Selection */}
                <div className='space-y-2'>
                    <Label>
                        Department <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        control={control}
                        name='LMD_Id'
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Department' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='0'>ALL</SelectItem>
                                    {initialData?.deptlist?.map((item) => (
                                        <SelectItem key={item.lmD_Id} value={item.lmD_Id.toString()}>
                                            {item.lmD_DepartmentName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.LMD_Id && <p className='text-red-500 text-sm'>{errors.LMD_Id.message}</p>}
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
