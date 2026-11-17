'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { staffWiseReportSchema } from '@/schemas/timetable/reports';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Search, X } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';

type FormFields = z.infer<typeof staffWiseReportSchema.search>;

interface StaffWiseFormProps {
    initialData: any;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export default function StaffWiseForm({ initialData, onSubmit, onCancel }: StaffWiseFormProps) {
    const academicList = initialData?.acayear || [];
    const staffList = initialData?.stafflist || [];

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(staffWiseReportSchema.search),
        defaultValues: {
            staffId: [],
            rpttyp: 'SAWC'
        }
    });

    const onFormSubmit = (data: FormFields) => {
        const selectedStaff = staffList.filter((s: any) => data.staffId?.includes(s.hrmE_Id));

        const payload = {
            ASMAY_Id: data.asmaY_Id,
            staffarray: selectedStaff,
            rpttyp: data.rpttyp // Useful for frontend display logic primarily
        };
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-6 rounded-lg border bg-white p-6 shadow-sm'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* Academic Year */}
                <div className='space-y-2'>
                    <Label>
                        Academic Year <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        control={control}
                        name='asmaY_Id'
                        render={({ field }) => (
                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder='--Select--' />
                                </SelectTrigger>
                                <SelectContent>
                                    {academicList.map((item: any) => (
                                        <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                            {item.asmaY_Year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.asmaY_Id && <span className='text-red-500 text-sm'>{errors.asmaY_Id.message}</span>}
                </div>

                {/* Staff */}
                <div className='space-y-2'>
                    <Label>
                        Staff Name <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        control={control}
                        name='staffId'
                        render={({ field }) => (
                            <MultiSelect
                                options={staffList.map((s: any) => ({ label: s.staffName, value: s.hrmE_Id.toString() }))}
                                defaultValue={(field.value || []).map(String)}
                                onValueChange={(val) => field.onChange(val.map(Number))}
                                placeholder='Select Staff'
                            />
                        )}
                    />
                    {errors.staffId && <span className='text-red-500 text-sm'>{errors.staffId.message}</span>}
                </div>
            </div>

            {/* Report Type */}
            <div className='space-y-2'>
                <Label>Report Type</Label>
                <Controller
                    control={control}
                    name='rpttyp'
                    render={({ field }) => (
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-row space-x-4'>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='SAWC' id='SAWC' />
                                <Label htmlFor='SAWC'>Subject Along With Class</Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='SNWC' id='SNWC' />
                                <Label htmlFor='SNWC'>Subject Not With Class</Label>
                            </div>
                        </RadioGroup>
                    )}
                />
            </div>

            <div className='flex justify-center space-x-2'>
                <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                    <Search className='mr-2 h-4 w-4' />
                    Report
                </Button>
                <Button type='button' variant='destructive' onClick={onCancel}>
                    <X className='mr-2 h-4 w-4' />
                    Cancel
                </Button>
            </div>
        </form>
    );
}
