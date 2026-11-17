'use client';

import { FormError, Label } from '@/components/ui/extension/field';
import { useEffect, useId } from 'react';
import { type Control, Controller, type FieldErrors } from 'react-hook-form';
import { TimePicker12Hour } from '../master-shift/_components/time-picker-12hour';

// Helper function to calculate time difference in HH:mm format
export function calculateTimeDifference(startTime: string, endTime: string): string {
    if (!startTime || !endTime) return '00:00';
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    let diffMinutes = endTotalMinutes - startTotalMinutes;
    if (diffMinutes < 0) {
        diffMinutes += 24 * 60; // Handle next day
    }
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

interface ShiftTimingFieldsProps<T extends Record<string, any>> {
    control: Control<T>;
    errors: FieldErrors<T>;
    watch: (name: keyof T) => any;
    setValue: (name: keyof T, value: any) => void;
    fieldNames: {
        shiftStartTime: keyof T;
        shiftEndTime: keyof T;
        totalWorkingHours: keyof T;
        lunchStartTime: keyof T;
        lunchEndTime: keyof T;
        lunchHours: keyof T;
        earlyPerShift: keyof T;
        delayPerShift: keyof T;
        halfDayWorkingHours: keyof T;
    };
}

export function ShiftTimingFields<T extends Record<string, any>>({
    control,
    errors,
    watch,
    setValue,
    fieldNames
}: ShiftTimingFieldsProps<T>) {
    const shiftStartTimeId = useId();
    const shiftEndTimeId = useId();
    const totalWorkingHoursId = useId();
    const lunchStartTimeId = useId();
    const lunchEndTimeId = useId();
    const lunchHoursId = useId();
    const earlyPerShiftId = useId();
    const delayPerShiftId = useId();
    const halfDayWorkingHoursId = useId();

    const shiftStartTime = watch(fieldNames.shiftStartTime);
    const shiftEndTime = watch(fieldNames.shiftEndTime);
    const lunchStartTime = watch(fieldNames.lunchStartTime);
    const lunchEndTime = watch(fieldNames.lunchEndTime);

    // Calculate total working hours when start/end times change
    useEffect(() => {
        if (shiftStartTime && shiftEndTime) {
            const totalHours = calculateTimeDifference(shiftStartTime, shiftEndTime);
            setValue(fieldNames.totalWorkingHours, totalHours);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shiftStartTime, shiftEndTime]);

    // Calculate lunch hours when lunch start/end times change
    useEffect(() => {
        if (lunchStartTime && lunchEndTime) {
            const lunchHours = calculateTimeDifference(lunchStartTime, lunchEndTime);
            setValue(fieldNames.lunchHours, lunchHours);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lunchStartTime, lunchEndTime]);

    return (
        <div className='space-y-4 rounded-md border border-input bg-background p-4'>
            <h3 className='font-semibold text-sm'>Timing Details</h3>
            {/* First Row: Shift Start Time, Shift End Time, Total working hours per shift */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div className='space-y-2'>
                    <Label htmlFor={shiftStartTimeId}>Shift Start Time</Label>
                    <Controller
                        name={fieldNames.shiftStartTime as any}
                        control={control}
                        render={({ field }) => (
                            <TimePicker12Hour
                                value={field.value}
                                onChange={field.onChange}
                                name={String(fieldNames.shiftStartTime)}
                                showPeriod={false}
                            />
                        )}
                    />
                    {errors[fieldNames.shiftStartTime] && <FormError>{(errors[fieldNames.shiftStartTime] as any)?.message}</FormError>}
                </div>
                <div className='space-y-2'>
                    <Label htmlFor={shiftEndTimeId}>Shift End Time</Label>
                    <Controller
                        name={fieldNames.shiftEndTime as any}
                        control={control}
                        render={({ field }) => (
                            <TimePicker12Hour
                                value={field.value}
                                onChange={field.onChange}
                                name={String(fieldNames.shiftEndTime)}
                                showPeriod={false}
                            />
                        )}
                    />
                    {errors[fieldNames.shiftEndTime] && <FormError>{(errors[fieldNames.shiftEndTime] as any)?.message}</FormError>}
                </div>
                <div className='space-y-2'>
                    <Label htmlFor={totalWorkingHoursId}>Total working hours per shift</Label>
                    <Controller
                        name={fieldNames.totalWorkingHours as any}
                        control={control}
                        render={({ field }) => (
                            <TimePicker12Hour
                                value={field.value}
                                onChange={field.onChange}
                                name={String(fieldNames.totalWorkingHours)}
                                disabled
                                showPeriod={false}
                            />
                        )}
                    />
                    {errors[fieldNames.totalWorkingHours] && (
                        <FormError>{(errors[fieldNames.totalWorkingHours] as any)?.message}</FormError>
                    )}
                </div>
            </div>
            {/* Second Row: Lunch start time, Lunch End time, Lunch Hours */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div className='space-y-2'>
                    <Label htmlFor={lunchStartTimeId}>Lunch start time</Label>
                    <Controller
                        name={fieldNames.lunchStartTime as any}
                        control={control}
                        render={({ field }) => (
                            <TimePicker12Hour
                                value={field.value}
                                onChange={field.onChange}
                                name={String(fieldNames.lunchStartTime)}
                                showPeriod={false}
                            />
                        )}
                    />
                    {errors[fieldNames.lunchStartTime] && <FormError>{(errors[fieldNames.lunchStartTime] as any)?.message}</FormError>}
                </div>
                <div className='space-y-2'>
                    <Label htmlFor={lunchEndTimeId}>Lunch End time</Label>
                    <Controller
                        name={fieldNames.lunchEndTime as any}
                        control={control}
                        render={({ field }) => (
                            <TimePicker12Hour
                                value={field.value}
                                onChange={field.onChange}
                                name={String(fieldNames.lunchEndTime)}
                                showPeriod={false}
                            />
                        )}
                    />
                    {errors[fieldNames.lunchEndTime] && <FormError>{(errors[fieldNames.lunchEndTime] as any)?.message}</FormError>}
                </div>
                <div className='space-y-2'>
                    <Label htmlFor={lunchHoursId}>Lunch Hours</Label>
                    <Controller
                        name={fieldNames.lunchHours as any}
                        control={control}
                        render={({ field }) => (
                            <TimePicker12Hour
                                value={field.value}
                                onChange={field.onChange}
                                name={String(fieldNames.lunchHours)}
                                disabled
                                showPeriod={false}
                            />
                        )}
                    />
                    {errors[fieldNames.lunchHours] && <FormError>{(errors[fieldNames.lunchHours] as any)?.message}</FormError>}
                </div>
            </div>
            {/* Third Row: Early per shift, Delay per shift, Half day working hours per shift */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div className='space-y-2'>
                    <Label htmlFor={earlyPerShiftId}>Early per shift</Label>
                    <Controller
                        name={fieldNames.earlyPerShift as any}
                        control={control}
                        render={({ field }) => (
                            <TimePicker12Hour
                                value={field.value}
                                onChange={field.onChange}
                                name={String(fieldNames.earlyPerShift)}
                                showPeriod={false}
                            />
                        )}
                    />
                    {errors[fieldNames.earlyPerShift] && <FormError>{(errors[fieldNames.earlyPerShift] as any)?.message}</FormError>}
                </div>
                <div className='space-y-2'>
                    <Label htmlFor={delayPerShiftId}>Delay per shift</Label>
                    <Controller
                        name={fieldNames.delayPerShift as any}
                        control={control}
                        render={({ field }) => (
                            <TimePicker12Hour
                                value={field.value}
                                onChange={field.onChange}
                                name={String(fieldNames.delayPerShift)}
                                showPeriod={false}
                            />
                        )}
                    />
                    {errors[fieldNames.delayPerShift] && <FormError>{(errors[fieldNames.delayPerShift] as any)?.message}</FormError>}
                </div>
                <div className='space-y-2'>
                    <Label htmlFor={halfDayWorkingHoursId}>Half day working hours per shift</Label>
                    <Controller
                        name={fieldNames.halfDayWorkingHours as any}
                        control={control}
                        render={({ field }) => (
                            <TimePicker12Hour
                                value={field.value}
                                onChange={field.onChange}
                                name={String(fieldNames.halfDayWorkingHours)}
                                showPeriod={false}
                            />
                        )}
                    />
                    {errors[fieldNames.halfDayWorkingHours] && (
                        <FormError>{(errors[fieldNames.halfDayWorkingHours] as any)?.message}</FormError>
                    )}
                </div>
            </div>
        </div>
    );
}
