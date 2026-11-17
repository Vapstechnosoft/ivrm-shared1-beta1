'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { masterShiftSchema } from '@/schemas/hrms/attendance-management-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { RefreshCw, Save } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import type { z } from 'zod';
import type { MasterShift } from './columns';
import { TimePicker12Hour } from './time-picker-12hour';
export type MasterShiftFormData = z.infer<typeof masterShiftSchema.addOrUpdate>;
interface ShiftFormProps {
    editingShift: MasterShift | null;
    onSubmit: (data: MasterShiftFormData) => void;
    onCancel: () => void;
}
export function ShiftForm({ editingShift, onSubmit, onCancel }: ShiftFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        control,
        formState: { errors, isSubmitting }
    } = useForm<MasterShiftFormData>({
        resolver: zodResolver(masterShiftSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: editingShift
            ? {
                  shiftName: editingShift.shiftName,
                  startTime: editingShift.startTime,
                  endTime: editingShift.endTime,
                  remarks: editingShift.remarks,
                  specificDay: editingShift.specificDay
              }
            : {
                  shiftName: '',
                  startTime: '00:00',
                  endTime: '00:00',
                  remarks: '',
                  specificDay: false
              }
    });
    // Reset form when editing changes
    useEffect(() => {
        if (editingShift) {
            reset({
                shiftName: editingShift.shiftName,
                startTime: editingShift.startTime,
                endTime: editingShift.endTime,
                remarks: editingShift.remarks,
                specificDay: editingShift.specificDay
            });
        } else {
            reset({
                shiftName: '',
                startTime: '00:00',
                endTime: '00:00',
                remarks: '',
                specificDay: false
            });
        }
    }, [editingShift, reset]);
    const handleFormSubmit: SubmitHandler<MasterShiftFormData> = async (data) => {
        onSubmit(data);
        // Reset form after submit only if adding new (not editing)
        if (!editingShift) {
            reset({
                shiftName: '',
                startTime: '00:00',
                endTime: '00:00',
                remarks: '',
                specificDay: false
            });
        }
    };
    const handleCancel = () => {
        reset({
            shiftName: '',
            startTime: '00:00',
            endTime: '00:00',
            remarks: '',
            specificDay: false
        });
        onCancel();
    };
    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='space-y-2'>
                <label className='font-medium text-sm' htmlFor='shiftName'>
                    Shift Name <span className='text-red-500'>*</span>
                </label>
                <InputText
                    id='shiftName'
                    placeholder='Enter Name'
                    {...register('shiftName')}
                    error={errors.shiftName?.message}
                    maxLength={100}
                />
            </div>
            <div className='space-y-2'>
                <label className='font-medium text-sm' htmlFor='remarks'>
                    Remark <span className='text-red-500'>*</span>
                </label>
                <InputText id='remarks' placeholder='Enter Name' {...register('remarks')} error={errors.remarks?.message} maxLength={250} />
            </div>
            <div className='space-y-2'>
                <label htmlFor='startTime' className='font-medium text-sm'>
                    Shift Start Time <span className='text-red-500'>*</span>
                </label>
                <Controller
                    name='startTime'
                    control={control}
                    render={({ field }) => <TimePicker12Hour value={field.value} onChange={field.onChange} name='startTime' required />}
                />
                {errors.startTime && <FormError>{errors.startTime.message}</FormError>}
            </div>
            <div className='space-y-2'>
                <label htmlFor='endTime' className='font-medium text-sm'>
                    Shift End Time <span className='text-red-500'>*</span>
                </label>
                <Controller
                    name='endTime'
                    control={control}
                    render={({ field }) => <TimePicker12Hour value={field.value} onChange={field.onChange} name='endTime' required />}
                />
                {errors.endTime && <FormError>{errors.endTime.message}</FormError>}
            </div>
            <div className='flex items-center gap-8'>
                <div className='flex items-center gap-2 text-sm'>
                    <Checkbox checked={watch('specificDay')} onCheckedChange={(v) => setValue('specificDay', Boolean(v))} />
                    <span>On Specific Day</span>
                </div>
            </div>
            <div className='flex justify-end gap-4 border-t pt-6 md:col-span-2'>
                <Button type='button' variant='outline' onClick={handleCancel}>
                    <RefreshCw className='mr-2 h-4 w-4' />
                    RESET
                </Button>
                <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className='mr-2 h-4 w-4' />
                            SAVE
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
