'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2, RotateCcw, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useAbsentStaffList, useDeputationMasters } from '@/hooks/timetable/transaction/useDeputation';
import { DeputationSchema } from '@/schemas/timetable/transactions/deputation';
import { saveDeputation } from '@/server/timetable/transactions/deputation';

import { Button } from '@/components/ui/button';
import { CalendarYear } from '@/components/ui/calendar_year';
import { Checkbox } from '@/components/ui/checkbox';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTimeTableAcademicYear, useTimeTableCategoryDropDownData, useTimeTableClassDropdownData } from '@/hooks/timetable/useMasters';

interface DeputationFormProps {
    onFetch: (data: any) => void;
}

export default function DeputationForm({ onFetch }: DeputationFormProps) {
    const { data: masters, isLoading } = useDeputationMasters();
    const [saving, setSaving] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(DeputationSchema),
        defaultValues: {
            asmaY_Id: '',
            ttmD_Date: undefined,
            ttmD_Day: '',
            absent_Staff_Flag: false,
            sms_Flag: false,
            email_Flag: false,
            notification_Flag: false,
            ttmD_Remarks: '',
            hrE_Id: ''
        }
    });
    const AcademicYear = watch('asmaY_Id');
    const watchDate = watch('ttmD_Date');
    const watchYear = watch('asmaY_Id');
    const watchAbsent = watch('absent_Staff_Flag');

    // Fetch absent staff based on selection
    const { data: absentStaffData } = useAbsentStaffList({
        asmaY_Id: Number(watchYear),
        ttmD_Date: watchDate ? format(watchDate, 'yyyy-MM-dd') : '',
        absent_Staff_Flag: watchAbsent
    });

    useEffect(() => {
        if (watchDate) {
            setValue('ttmD_Day', format(watchDate, 'EEEE').toUpperCase());
        }
    }, [watchDate, setValue]);

    const { data: ayData, isLoading: ayLoading } = useTimeTableAcademicYear();
    const { data: catData, isLoading: catLoading } = useTimeTableCategoryDropDownData();
    const { data: classData, isLoading: classLoading } = useTimeTableClassDropdownData();

    const mastersLoading = ayLoading || catLoading || classLoading;

    const onSubmit = async (data: any) => {
        if (saving) return;

        setSaving(true);

        try {
            const res = await saveDeputation(data);

            if (res) {
                toast.success('Staff allotment saved successfully');
                onFetch(res);
                reset();
            }
        } catch (error) {
            console.error(error);
            toast.error('Unable to save allotment');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        reset();
        onFetch(null);
    };

    return (
        <CollapsibleSection title='Staff Replacement For Class And Section' defaultOpen>
            <div className='rounded-xl border border-purple-100 bg-white p-6 shadow-md'>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    {/* TOP GRID */}
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                        {/* Academic Year */}
                        {/* Academic Year */}
                        <div className='space-y-1'>
                            <Label className={`font-bold text-xs uppercase ${errors.asmaY_Id ? 'text-red-500' : 'text-purple-900'}`}>
                                Academic Year *
                            </Label>
                            <Controller
                                name='asmaY_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        key={field.value || 'empty'}
                                        onValueChange={(value) => {
                                            field.onChange(value || '');
                                        }}
                                        value={field.value?.toString() || undefined}>
                                        <SelectTrigger
                                            className={`h-10 border-purple-100 ${errors.asmaY_Id ? 'border-red-500 ring-red-100' : ''}`}>
                                            <SelectValue placeholder={isLoading ? 'Loading...' : 'Select Year'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {masters?.academicYears?.map((ay: any) => (
                                                <SelectItem key={ay.asmaY_Id} value={ay.asmaY_Id.toString()}>
                                                    {ay.asmaY_Year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.asmaY_Id && <p className='font-medium text-[10px] text-red-500'>{errors.asmaY_Id.message}</p>}
                        </div>
                        {/* Date */}
                        <div className='space-y-1'>
                            <Label className={`font-bold text-xs uppercase ${errors.ttmD_Date ? 'text-red-500' : 'text-purple-900'}`}>
                                Date *
                            </Label>
                            <Controller
                                name='ttmD_Date'
                                control={control}
                                render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                type='button'
                                                variant='outline'
                                                className={`w-full justify-start border-purple-100 ${errors.ttmD_Date ? 'border-red-500 ring-red-100' : ''}`}>
                                                <CalendarIcon className='mr-2 h-4 w-4' />
                                                {field.value ? format(field.value, 'dd/MM/yyyy') : 'Select date'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-auto p-0'>
                                            <CalendarYear
                                                mode='single'
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                fromYear={2000}
                                                toYear={2050}
                                                captionLayout='dropdown'
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                            {errors.ttmD_Date && <p className='font-medium text-[10px] text-red-500'>{errors.ttmD_Date.message}</p>}
                        </div>

                        {/* Day */}
                        <div className='space-y-1'>
                            <Label className='font-bold text-purple-900 text-xs uppercase'>Day</Label>
                            <Controller
                                name='ttmD_Day'
                                control={control}
                                render={({ field }) => <Input {...field} readOnly className='h-10 bg-slate-50 text-purple-700' />}
                            />
                        </div>
                    </div>

                    {/* ABSENT STAFF */}
                    <div className='grid gap-6 rounded-xl border border-orange-100 bg-orange-50/40 p-5 md:grid-cols-2'>
                        <div className='flex items-center space-x-3'>
                            <Controller
                                name='absent_Staff_Flag'
                                control={control}
                                render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} />}
                            />
                            <Label className='font-bold text-orange-700 text-sm'>
                                Absent Staff On : {watchDate ? format(watchDate, 'dd/MM/yyyy') : '--'}
                            </Label>
                        </div>

                        <div className='space-y-1'>
                            <Label className={`font-bold text-xs uppercase ${errors.hrE_Id ? 'text-red-500' : 'text-purple-900'}`}>
                                Staff Name *
                            </Label>
                            <Controller
                                name='hrE_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        key={field.value || 'empty'}
                                        onValueChange={(value) => {
                                            field.onChange(value || '');
                                        }}
                                        value={field.value?.toString() || undefined}>
                                        <SelectTrigger
                                            className={`h-10 border-purple-100 ${errors.hrE_Id ? 'border-red-500 ring-red-100' : ''}`}>
                                            <SelectValue placeholder='-- Select Staff --' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {absentStaffData?.map((staff: any) => (
                                                <SelectItem key={staff.hrmE_Id} value={staff.hrmE_Id.toString()}>
                                                    {staff.staffName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.hrE_Id && <p className='font-medium text-[10px] text-red-500'>{errors.hrE_Id.message}</p>}
                        </div>
                    </div>

                    {/* REMARKS */}
                    <div className='space-y-1'>
                        <Label className='font-bold text-purple-900 text-xs uppercase'>Remarks</Label>
                        <Controller
                            name='ttmD_Remarks'
                            control={control}
                            render={({ field }) => <Input {...field} placeholder='Enter remarks...' />}
                        />
                    </div>

                    {/* FLAGS */}
                    <div className='flex gap-8 border-y py-4'>
                        {['sms_Flag', 'email_Flag', 'notification_Flag'].map((key) => (
                            <div key={key} className='flex items-center gap-2'>
                                <Controller
                                    name={key as any}
                                    control={control}
                                    render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} />}
                                />
                                <Label className='font-bold text-xs uppercase'>{key.replace('_Flag', '')}</Label>
                            </div>
                        ))}
                    </div>

                    {/* ACTIONS */}
                    <div className='flex gap-3'>
                        <Button type='submit' disabled={mastersLoading} className='bg-orange-500 px-6 font-bold'>
                            {saving ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Save className='mr-2 h-4 w-4' />}
                            Save Allotment
                        </Button>

                        <Button type='button' variant='outline' onClick={handleReset} disabled={mastersLoading}>
                            <RotateCcw className='mr-2 h-4 w-4' />
                            Reset
                        </Button>
                        {mastersLoading && <Loader2 className='h-4 w-4 animate-spin self-center text-purple-500' />}
                    </div>
                </form>
            </div>
        </CollapsibleSection>
    );
}
