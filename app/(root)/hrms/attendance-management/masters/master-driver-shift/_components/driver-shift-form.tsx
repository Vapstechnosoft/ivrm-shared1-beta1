'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePickerWithYear } from '@/components/ui/date-picker-year';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { masterDriverShiftSchema } from '@/schemas/hrms/attendance-management-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, RefreshCw, Save, X } from 'lucide-react';
import React from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import type { z } from 'zod';
export type DriverShiftForm = z.infer<typeof masterDriverShiftSchema.addOrUpdate>;
interface DriverShiftFormProps {
    editingShift: DriverShiftForm | null;
    onSubmit: (data: DriverShiftForm) => void;
    onCancel: () => void;
}
// Mock data - replace with actual data source
const shiftOptions = ['Morning Shift', 'Afternoon Shift', 'Evening Shift', 'Night Shift', 'Ghoshala Shift'];
const driverOptions = ['Arun A', 'Arun R', 'Ashok R', 'Driver 1', 'Driver 2', 'Driver 3'];
export function DriverShiftForm({ editingShift, onSubmit, onCancel }: DriverShiftFormProps) {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<DriverShiftForm>({
        resolver: zodResolver(masterDriverShiftSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: editingShift
            ? {
                  shift: editingShift.shift || '',
                  driver: editingShift.driver || '',
                  fromDate: editingShift.fromDate || '',
                  toDate: editingShift.toDate || '',
                  remarks: editingShift.remarks || '',
                  saturdayOff: editingShift.saturdayOff || false,
                  sundayWorking: editingShift.sundayWorking || false
              }
            : {
                  shift: '',
                  driver: '',
                  fromDate: '',
                  toDate: '',
                  remarks: '',
                  saturdayOff: false,
                  sundayWorking: false
              }
    });
    const fromDate = watch('fromDate');
    // Update form when editingShift changes
    React.useEffect(() => {
        if (editingShift) {
            reset({
                shift: editingShift.shift || '',
                driver: editingShift.driver || '',
                fromDate: editingShift.fromDate || '',
                toDate: editingShift.toDate || '',
                remarks: editingShift.remarks || '',
                saturdayOff: editingShift.saturdayOff || false,
                sundayWorking: editingShift.sundayWorking || false
            });
        } else {
            reset({
                shift: '',
                driver: '',
                fromDate: '',
                toDate: '',
                remarks: '',
                saturdayOff: false,
                sundayWorking: false
            });
        }
    }, [editingShift, reset]);
    const handleFormSubmit: SubmitHandler<DriverShiftForm> = (data) => {
        onSubmit(data);
    };
    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* Left Column */}
                <div className='space-y-6'>
                    <div className='space-y-2'>
                        <label className='font-medium text-sm' htmlFor='shift'>
                            Shift <span className='text-red-500'>*</span>
                        </label>
                        <Select value={watch('shift')} onValueChange={(value) => setValue('shift', value)}>
                            <SelectTrigger id='shift' className={errors.shift ? 'border-red-500' : ''}>
                                <SelectValue placeholder='Select Shift' />
                            </SelectTrigger>
                            <SelectContent>
                                {shiftOptions.map((shift) => (
                                    <SelectItem key={shift} value={shift}>
                                        {shift}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.shift && <FormError>{errors.shift.message}</FormError>}
                    </div>
                    <div className='space-y-2'>
                        <label className='font-medium text-sm' htmlFor='fromDate'>
                            From Date <span className='text-red-500'>*</span>
                        </label>
                        <Controller
                            name='fromDate'
                            control={control}
                            render={({ field }) => {
                                const selectedDate = field.value ? new Date(field.value) : undefined;
                                const minDate = new Date();
                                minDate.setHours(0, 0, 0, 0);
                                return (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant='outline'
                                                className={cn(
                                                    'w-full justify-start text-left font-normal',
                                                    !selectedDate && 'text-muted-foreground',
                                                    errors.fromDate && 'border-red-500'
                                                )}
                                                type='button'>
                                                <CalendarIcon className='mr-2 h-4 w-4' />
                                                {selectedDate ? format(selectedDate, 'dd-MM-yyyy') : 'Select Date'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-auto p-0' align='start'>
                                            <DatePickerWithYear
                                                mode='single'
                                                selected={selectedDate}
                                                onDayClick={(day) => {
                                                    if (day) {
                                                        const dateStr = format(day, 'yyyy-MM-dd');
                                                        field.onChange(dateStr);
                                                    }
                                                }}
                                                fromDate={minDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                );
                            }}
                        />
                        {errors.fromDate && <FormError>{errors.fromDate.message}</FormError>}
                    </div>
                    <div className='space-y-2'>
                        <label className='font-medium text-sm' htmlFor='remarks'>
                            Remarks <span className='text-red-500'>*</span>
                        </label>
                        <InputText
                            id='remarks'
                            placeholder='Enter Remarks'
                            {...register('remarks')}
                            error={errors.remarks?.message}
                            maxLength={250}
                        />
                    </div>
                </div>
                {/* Right Column */}
                <div className='space-y-6'>
                    <div className='space-y-2'>
                        <label className='font-medium text-sm' htmlFor='driver'>
                            Driver <span className='text-red-500'>*</span>
                        </label>
                        <Select value={watch('driver')} onValueChange={(value) => setValue('driver', value)}>
                            <SelectTrigger id='driver' className={errors.driver ? 'border-red-500' : ''}>
                                <SelectValue placeholder='Select Driver' />
                            </SelectTrigger>
                            <SelectContent>
                                {driverOptions.map((driver) => (
                                    <SelectItem key={driver} value={driver}>
                                        {driver}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.driver && <FormError>{errors.driver.message}</FormError>}
                    </div>
                    <div className='space-y-2'>
                        <label className='font-medium text-sm' htmlFor='toDate'>
                            To Date <span className='text-red-500'>*</span>
                        </label>
                        <Controller
                            name='toDate'
                            control={control}
                            render={({ field }) => {
                                const selectedDate = field.value ? new Date(field.value) : undefined;
                                const minDate = fromDate ? new Date(fromDate) : new Date();
                                minDate.setHours(0, 0, 0, 0);
                                return (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant='outline'
                                                className={cn(
                                                    'w-full justify-start text-left font-normal',
                                                    !selectedDate && 'text-muted-foreground',
                                                    errors.toDate && 'border-red-500'
                                                )}
                                                type='button'>
                                                <CalendarIcon className='mr-2 h-4 w-4' />
                                                {selectedDate ? format(selectedDate, 'dd-MM-yyyy') : 'Select Date'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-auto p-0' align='start'>
                                            <DatePickerWithYear
                                                mode='single'
                                                selected={selectedDate}
                                                onDayClick={(day) => {
                                                    if (day) {
                                                        const dateStr = format(day, 'yyyy-MM-dd');
                                                        field.onChange(dateStr);
                                                    }
                                                }}
                                                fromDate={minDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                );
                            }}
                        />
                        {errors.toDate && <FormError>{errors.toDate.message}</FormError>}
                    </div>
                    <div className='space-y-4'>
                        <div className='flex items-center gap-2'>
                            <Checkbox
                                id='saturdayOff'
                                checked={watch('saturdayOff')}
                                onCheckedChange={(checked) => setValue('saturdayOff', !!checked)}
                            />
                            <label htmlFor='saturdayOff' className='cursor-pointer font-medium text-sm'>
                                Saturday Off Flag
                            </label>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Checkbox
                                id='sundayWorking'
                                checked={watch('sundayWorking')}
                                onCheckedChange={(checked) => setValue('sundayWorking', !!checked)}
                            />
                            <label htmlFor='sundayWorking' className='cursor-pointer font-medium text-sm'>
                                Sunday Working Flag
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            {/* Action Buttons */}
            <div className='flex justify-end gap-4 border-t pt-6'>
                <Button type='button' variant='outline' onClick={onCancel}>
                    <X className='mr-2 h-4 w-4' /> CANCEL
                </Button>
                <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <RefreshCw className='mr-2 h-4 w-4 animate-spin' /> Saving...
                        </>
                    ) : (
                        <>
                            <Save className='mr-2 h-4 w-4' /> SAVE
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
