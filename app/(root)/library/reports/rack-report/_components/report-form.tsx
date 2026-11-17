'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRackReportInitialData } from '@/hooks/library/reports/useRackReport';
import type { IRackReportRequest } from '@/types/library/reports/rack-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Search, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const reportFormSchema = z.object({
    LMAL_Id: z.coerce.number().min(1, 'Library is required'),
    LMRA_RackName: z.string().min(1, 'Rack Name is required')
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

interface ReportFormProps {
    onSearch: (data: IRackReportRequest) => void;
    isLoading: boolean;
}

export const ReportForm = ({ onSearch, isLoading }: ReportFormProps) => {
    const { data: initialData } = useRackReportInitialData();

    const {
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm<ReportFormValues>({
        resolver: zodResolver(reportFormSchema),
        defaultValues: {
            LMRA_RackName: ''
        }
    });

    const onSubmit = (data: ReportFormValues) => {
        onSearch(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <Card>
                    <CardHeader>
                        <CardTitle className='text-lg'>Filters</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        {/* Library */}
                        <div>
                            <Label>
                                Library Name <span className='text-red-500'>*</span>
                            </Label>
                            <Select onValueChange={(v) => setValue('LMAL_Id', Number(v))}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Library' />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.isArray(initialData?.lib_list) &&
                                        initialData?.lib_list?.map((lib) => (
                                            <SelectItem key={lib.lmaL_Id} value={lib.lmaL_Id.toString()}>
                                                {lib.lmaL_LibraryName}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            {errors.LMAL_Id && <p className='text-red-500 text-sm'>{errors.LMAL_Id.message}</p>}
                        </div>

                        {/* Rack Name */}
                        <div>
                            <Label>
                                Rack Name <span className='text-red-500'>*</span>
                            </Label>
                            <Select onValueChange={(v) => setValue('LMRA_RackName', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Rack Name' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='ALL'>ALL</SelectItem>
                                    {Array.isArray(initialData?.racklist) &&
                                        initialData?.racklist?.map((rack) => (
                                            <SelectItem key={rack.lmrA_Id} value={rack.lmrA_RackName}>
                                                {rack.lmrA_RackName}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            {errors.LMRA_RackName && <p className='text-red-500 text-sm'>{errors.LMRA_RackName.message}</p>}
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
