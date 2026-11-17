'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, RotateCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { type StaffPeriodTransferValues, staffPeriodTransferSchema } from '@/schemas/timetable/transactions/staffPeriodTransfer';

import { useStaffPeriodTransferMasters } from '@/hooks/timetable/transaction/useStaffPeriodTransfer';
import { getStaffPeriodTransferMasters } from '@/server/timetable/transactions/staffPeriodTransfer';

interface StaffPeriodTransferFormProps {
    onFetch: (data: StaffPeriodTransferValues | null) => void;
}

export default function StaffPeriodTransferForm({ onFetch }: StaffPeriodTransferFormProps) {
    const { data: masters, isLoading: mastersLoading } = useStaffPeriodTransferMasters();

    const [saving, setSaving] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<StaffPeriodTransferValues>({
        resolver: zodResolver(staffPeriodTransferSchema),
        defaultValues: {
            asmaY_Id: '',
            hrmE_Id: ''
        }
    });

    /* -------------------- SUBMIT -------------------- */
    const onSubmit = async (data: StaffPeriodTransferValues) => {
        if (saving) return;

        setSaving(true);
        try {
            await getStaffPeriodTransferMasters(); // just validates / preloads
            toast.success('Details loaded');

            onFetch(data); // ✅ THIS IS THE KEY FIX
        } catch (error) {
            console.error(error);
            toast.error('Unable to load details');
        } finally {
            setSaving(false);
        }
    };

    /* -------------------- RESET -------------------- */
    const handleReset = () => {
        reset();
        onFetch(null);
        // reset({
        //     asmaY_Id: "",
        //     hrmE_Id: "",
        // });
        // onFetch(null); // 🔥 clear report grid
    };

    return (
        <CollapsibleSection title='Staff Period Transfer Selection' defaultOpen className='overflow-hidden rounded-2xl shadow-xl'>
            <div className='bg-white p-8'>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
                    <div className='grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2'>
                        {/* Academic Year */}
                        <div className='space-y-2'>
                            <Label className='font-bold text-purple-900'>Academic Year *</Label>
                            <Controller
                                name='asmaY_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        // onValueChange={field.onChange}
                                        //  value={field.value}
                                        key={field.value || 'empty'}
                                        onValueChange={(value) => {
                                            field.onChange(value || '');
                                        }}
                                        value={field.value?.toString() || undefined}>
                                        <SelectTrigger className='h-11 border-purple-100'>
                                            <SelectValue placeholder='-- Select Year --' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {masters?.years?.map((y) => (
                                                <SelectItem key={y.asmaY_Id} value={y.asmaY_Id.toString()}>
                                                    {y.asmaY_Year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.asmaY_Id && <p className='text-red-500 text-xs'>{errors.asmaY_Id.message}</p>}
                        </div>

                        {/* Staff */}
                        <div className='space-y-2'>
                            <Label className='font-bold text-purple-900'>Staff *</Label>
                            <Controller
                                name='hrmE_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        key={field.value || 'empty'}
                                        onValueChange={(value) => {
                                            field.onChange(value || '');
                                        }}
                                        value={field.value?.toString() || undefined}>
                                        <SelectTrigger className='h-11 border-purple-100'>
                                            <SelectValue placeholder='-- Select Staff --' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {masters?.staff?.map((s) => (
                                                <SelectItem key={s.hrmE_Id} value={s.hrmE_Id.toString()}>
                                                    {s.staffName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.hrmE_Id && <p className='text-red-500 text-xs'>{errors.hrmE_Id.message}</p>}
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className='flex gap-2 border-t pt-4'>
                        <Button
                            type='submit'
                            disabled={mastersLoading || saving}
                            className='bg-orange-500 px-6 font-semibold text-xs hover:bg-orange-600'>
                            {saving ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Search className='mr-2 h-4 w-4' />}
                            Get Details
                        </Button>

                        <Button type='button' variant='outline' onClick={handleReset}>
                            <RotateCcw className='mr-2 h-4 w-4' />
                            Reset
                        </Button>
                    </div>
                </form>
            </div>
        </CollapsibleSection>
    );
}
