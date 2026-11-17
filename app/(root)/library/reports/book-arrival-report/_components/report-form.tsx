'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { InputText } from '@/components/ui/extension/input-text';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBookArrivalReportInitialData } from '@/hooks/library/reports/useBookArrivalReport';
import type { IBookArrivalReportRequest } from '@/types/library/reports/book-arrival-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Search, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const reportFormSchema = z
    .object({
        LMAL_Id: z.coerce.number().min(1, 'Library is required'),
        Type: z.string().min(1, 'Book Type is required'),
        Type2: z.string().min(1, 'Source Type is required'),
        LMD_Id: z.coerce.number().optional(), // 0 = ALL
        datewised: z.boolean().default(false),
        Fromdate: z.string().optional(),
        ToDate: z.string().optional()
    })
    .refine(
        (data) => {
            if (data.datewised) {
                return !!data.Fromdate && !!data.ToDate;
            }
            return true;
        },
        {
            message: 'Both dates are required when date filter is enabled',
            path: ['Fromdate']
        }
    );

type ReportFormValues = z.infer<typeof reportFormSchema>;

interface ReportFormProps {
    onSearch: (data: IBookArrivalReportRequest) => void;
    isLoading: boolean;
}

export const ReportForm = ({ onSearch, isLoading }: ReportFormProps) => {
    const { data: initialData } = useBookArrivalReportInitialData();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors }
    } = useForm<ReportFormValues>({
        resolver: zodResolver(reportFormSchema),
        defaultValues: {
            Type: 'ALL',
            Type2: 'ALL',
            datewised: false,
            LMD_Id: 0
        }
    });

    const watchDatewised = watch('datewised');

    const onSubmit = (data: ReportFormValues) => {
        const payload: IBookArrivalReportRequest = {
            LMAL_Id: data.LMAL_Id,
            Type: data.Type,
            Type2: data.Type2,
            LMD_Id: data.LMD_Id || 0,
            Fromdate: data.datewised ? data.Fromdate : undefined,
            ToDate: data.datewised ? data.ToDate : undefined
        };
        onSearch(payload);
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
                            {errors.LMAL_Id && <p>{errors.LMAL_Id.message}</p>}
                        </div>

                        {/* Department */}
                        <div>
                            <Label>
                                Department <span className='text-red-500'>*</span>
                            </Label>
                            <Select onValueChange={(v) => setValue('LMD_Id', Number(v))} defaultValue='0'>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Department' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='0'>ALL</SelectItem>
                                    {Array.isArray(initialData?.deptlist) &&
                                        initialData?.deptlist?.map((dept) => (
                                            <SelectItem key={dept.lmD_Id} value={dept.lmD_Id.toString()}>
                                                {dept.lmD_DepartmentName}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            {errors.LMD_Id && <p className='text-red-500 text-sm'>{errors.LMD_Id.message}</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Types */}
                <Card>
                    <CardHeader>
                        <CardTitle className='text-lg'>Types</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                        {/* Book Type */}
                        <div>
                            <Label className='mb-2 block'>Book Type</Label>
                            <RadioGroup defaultValue='ALL' onValueChange={(v) => setValue('Type', v)} className='grid grid-cols-2 gap-2'>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='ALL' id='bt_all' />
                                    <Label htmlFor='bt_all'>ALL</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Issue' id='bt_issue' />
                                    <Label htmlFor='bt_issue'>Issue</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Reference' id='bt_ref' />
                                    <Label htmlFor='bt_ref'>Reference</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Issuable' id='bt_issuable' />
                                    <Label htmlFor='bt_issuable'>Issuable</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Reference' id='bt_notiss' />
                                    <Label htmlFor='bt_notiss'>Not Issuable</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='ReferenceonlyIssuable' id='bt_r_iss' />
                                    <Label htmlFor='bt_r_iss'>Ref Only Issuable</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='ReferenceonlyNon-Issuable' id='bt_r_niss' />
                                    <Label htmlFor='bt_r_niss'>Ref Only Non-Issuable</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Source Type */}
                        <div>
                            <Label className='mb-2 block'>Source Type</Label>
                            <RadioGroup defaultValue='ALL' onValueChange={(v) => setValue('Type2', v)} className='flex gap-4'>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='ALL' id='st_all' />
                                    <Label htmlFor='st_all'>ALL</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Purchased' id='st_pur' />
                                    <Label htmlFor='st_pur'>Purchased</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Donated' id='st_don' />
                                    <Label htmlFor='st_don'>Donated</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Date Filter */}
            <Card>
                <CardHeader>
                    <CardTitle className='text-lg'>Date Range</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col items-start gap-6 md:flex-row md:items-center'>
                        <div className='flex items-center space-x-2'>
                            <Checkbox id='datewised' onCheckedChange={(c) => setValue('datewised', c === true)} />
                            <Label htmlFor='datewised'>Between Entry Date</Label>
                        </div>

                        <div className='flex flex-1 items-center gap-4'>
                            <div className='flex-1'>
                                <InputText
                                    label='From Date'
                                    type='date'
                                    disabled={!watchDatewised}
                                    {...register('Fromdate')}
                                    error={errors.Fromdate?.message}
                                />
                            </div>
                            <span>to</span>
                            <div className='flex-1'>
                                <InputText
                                    label='To Date'
                                    type='date'
                                    disabled={!watchDatewised}
                                    {...register('ToDate')}
                                    error={errors.ToDate?.message}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

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
