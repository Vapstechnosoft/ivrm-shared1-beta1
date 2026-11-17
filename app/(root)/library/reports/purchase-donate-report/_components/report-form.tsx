'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { IPurchaseDonateReportRequest } from '@/types/library/reports/purchase-donate-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Search, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const reportFormSchema = z.object({
    book_Flag: z.enum(['Purchased', 'Donated']),
    LMB_BookType: z.string().min(1, 'Book Category is required')
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

interface ReportFormProps {
    onSearch: (data: IPurchaseDonateReportRequest) => void;
    isLoading: boolean;
}

export const ReportForm = ({ onSearch, isLoading }: ReportFormProps) => {
    const {
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm<ReportFormValues>({
        resolver: zodResolver(reportFormSchema),
        defaultValues: {
            book_Flag: 'Purchased',
            LMB_BookType: ''
        }
    });

    const onSubmit = (data: ReportFormValues) => {
        onSearch({
            LBCPA_Flg: data.LMB_BookType,
            Circ_Flag: data.book_Flag
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <Card>
                    <CardHeader>
                        <CardTitle className='text-lg'>Filters</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                        {/* Report Type */}
                        <div>
                            <Label className='mb-2 block'>Report Type</Label>
                            <RadioGroup
                                defaultValue='Purchased'
                                onValueChange={(v) => setValue('book_Flag', v as any)}
                                className='flex gap-4 rounded-md border p-4'>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Purchased' id='r-purchased' />
                                    <Label htmlFor='r-purchased'>Purchase</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Donated' id='r-donated' />
                                    <Label htmlFor='r-donated'>Donate</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Book Category */}
                        <div>
                            <Label>
                                Book Category <span className='text-red-500'>*</span>
                            </Label>
                            <Select onValueChange={(v) => setValue('LMB_BookType', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Book Category' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='Book'>Book</SelectItem>
                                    <SelectItem value='Non-Book'>Non-Book</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.LMB_BookType && <p className='text-red-500 text-sm'>{errors.LMB_BookType.message}</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className='flex justify-center gap-4'>
                <Button type='submit' disabled={isLoading}>
                    {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Search className='mr-2 h-4 w-4' />}
                    Report
                </Button>
                <Button type='button' variant='destructive' onClick={() => reset()}>
                    <X className='mr-2 h-4 w-4' />
                    Cancel
                </Button>
            </div>
        </form>
    );
};
