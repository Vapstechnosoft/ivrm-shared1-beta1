'use client';
import { Button } from '@/components/ui/button';
import { DaySelectionCheckbox } from '@/components/ui/day-selection-checkbox';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterShift, useSaveMasterShift } from '@/hooks/hrms/attendance-management/useMasters';
import { masterShiftSchema } from '@/schemas/hrms/attendance-management-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import type { z } from 'zod';
import { TimePicker12Hour } from './time-picker-12hour';
type FormFields = z.infer<typeof masterShiftSchema.addOrUpdate>;
interface AddMasterShiftFormProps {
    onSuccess?: () => void;
    className?: string;
}
export default function AddMasterShiftForm({ onSuccess, className = '' }: AddMasterShiftFormProps) {
    const { refetchAll } = useMasterShift();
    const { mutate: saveMasterShift, isPending } = useSaveMasterShift();
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterShiftSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            shiftName: '',
            startTime: '00:00',
            endTime: '00:00',
            remarks: '',
            specificDay: false
        }
    });
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        saveMasterShift(
            {
                shiftName: data.shiftName,
                startTime: data.startTime,
                endTime: data.endTime,
                remarks: data.remarks,
                specificDay: data.specificDay ?? false
            },
            {
                onSuccess: () => {
                    reset();
                    refetchAll();
                    onSuccess?.();
                }
            }
        );
    };
    const handleReset = () => {
        reset();
        setSelectedDays([]);
    };
    const handleDaysChange = (days: string[]) => {
        setSelectedDays(days);
        setValue('specificDay', days.length > 0);
    };
    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Shift Name'
                            required
                            id='shiftName'
                            {...register('shiftName')}
                            error={errors.shiftName?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                            maxLength={100}
                        />
                        <InputText
                            label='Remarks'
                            required
                            id='remarks'
                            {...register('remarks')}
                            error={errors.remarks?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                            maxLength={250}
                        />
                    </div>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div className='space-y-2'>
                            <label htmlFor='startTime' className='font-medium text-sm'>
                                Shift Start Time <span className='text-red-500'>*</span>
                            </label>
                            <Controller
                                name='startTime'
                                control={control}
                                render={({ field }) => (
                                    <TimePicker12Hour value={field.value} onChange={field.onChange} name='startTime' required />
                                )}
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
                                render={({ field }) => (
                                    <TimePicker12Hour value={field.value} onChange={field.onChange} name='endTime' required />
                                )}
                            />
                            {errors.endTime && <FormError>{errors.endTime.message}</FormError>}
                        </div>
                    </div>
                    <div className='flex items-center gap-8'>
                        <DaySelectionCheckbox
                            id='specificDay'
                            label='On Specific Day'
                            checked={watch('specificDay')}
                            selectedDays={selectedDays}
                            onCheckedChange={(checked) => setValue('specificDay', checked)}
                            onDaysChange={handleDaysChange}
                        />
                    </div>
                </div>
                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting || isPending}
                        className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                        Reset
                    </Button>
                    <Button
                        type='submit'
                        disabled={isSubmitting || isPending}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting || isPending}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Save Master Shift
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
