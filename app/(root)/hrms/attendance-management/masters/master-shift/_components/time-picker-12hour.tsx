'use client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TimePickerInput } from '@/components/ui/time-picker/time-picker-input';
import type { Period } from '@/components/ui/time-picker/time-picker-utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import * as React from 'react';
interface TimePicker12HourProps {
    value?: string; // HH:mm format
    onChange?: (value: string) => void; // Returns HH:mm format
    disabled?: boolean;
    required?: boolean;
    className?: string;
    name?: string;
    showPeriod?: boolean; // Show AM/PM selector (default: true)
}
export function TimePicker12Hour({
    value,
    onChange,
    disabled = false,
    required = false,
    className,
    name,
    showPeriod = true
}: TimePicker12HourProps) {
    const minuteRef = React.useRef<HTMLInputElement>(null);
    const hourRef = React.useRef<HTMLInputElement>(null);
    const [date, setDate] = React.useState<Date | undefined>(undefined);
    const [period, setPeriod] = React.useState<Period>('AM');
    // Initialize date from value (HH:mm format)
    React.useEffect(() => {
        if (value) {
            const [hours, minutes] = value.split(':').map(Number);
            const newDate = new Date();
            newDate.setHours(hours || 0, minutes || 0, 0, 0);
            setDate(newDate);
            // Determine period from 24-hour format
            setPeriod(hours >= 12 ? 'PM' : 'AM');
        } else {
            const newDate = new Date();
            newDate.setHours(0, 0, 0, 0);
            setDate(newDate);
            setPeriod('AM');
        }
    }, [value]);
    // Handle date changes and call onChange with HH:mm format
    const handleDateChange = React.useCallback(
        (newDate: Date | undefined) => {
            setDate(newDate);
            if (newDate && onChange) {
                const hours = newDate.getHours();
                const minutes = newDate.getMinutes();
                onChange(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
            } else if (!newDate && onChange) {
                onChange('');
            }
        },
        [onChange]
    );
    // Handle period change
    const handlePeriodChange = React.useCallback(() => {
        if (!date) return;
        const newPeriod = period === 'AM' ? 'PM' : 'AM';
        setPeriod(newPeriod);
        // Convert current hour to 12-hour format, then apply new period
        const currentHour24 = date.getHours();
        const currentHour12 = currentHour24 === 0 ? 12 : currentHour24 > 12 ? currentHour24 - 12 : currentHour24;
        const newDate = new Date(date);
        if (newPeriod === 'PM') {
            if (currentHour12 === 12) {
                newDate.setHours(12);
            } else {
                newDate.setHours(currentHour12 + 12);
            }
        } else {
            if (currentHour12 === 12) {
                newDate.setHours(0);
            } else {
                newDate.setHours(currentHour12);
            }
        }
        handleDateChange(newDate);
    }, [date, period, handleDateChange]);
    const incrementHour = () => {
        if (!date) return;
        const newDate = new Date(date);
        const currentHour24 = date.getHours();
        if (showPeriod) {
            // 12-hour format logic
            const hour12 = currentHour24 === 0 ? 12 : currentHour24 > 12 ? currentHour24 - 12 : currentHour24;
            const newHour12 = hour12 >= 12 ? 1 : hour12 + 1;
            if (period === 'PM') {
                newDate.setHours(newHour12 === 12 ? 12 : newHour12 + 12);
            } else {
                newDate.setHours(newHour12 === 12 ? 0 : newHour12);
            }
        } else {
            // 24-hour format logic (0-23)
            newDate.setHours(currentHour24 >= 23 ? 0 : currentHour24 + 1);
        }
        handleDateChange(newDate);
    };
    const decrementHour = () => {
        if (!date) return;
        const newDate = new Date(date);
        const currentHour24 = date.getHours();
        if (showPeriod) {
            // 12-hour format logic
            const hour12 = currentHour24 === 0 ? 12 : currentHour24 > 12 ? currentHour24 - 12 : currentHour24;
            const newHour12 = hour12 <= 1 ? 12 : hour12 - 1;
            if (period === 'PM') {
                newDate.setHours(newHour12 === 12 ? 12 : newHour12 + 12);
            } else {
                newDate.setHours(newHour12 === 12 ? 0 : newHour12);
            }
        } else {
            // 24-hour format logic (0-23)
            newDate.setHours(currentHour24 <= 0 ? 23 : currentHour24 - 1);
        }
        handleDateChange(newDate);
    };
    const incrementMinute = () => {
        if (!date) return;
        const newDate = new Date(date);
        const minutes = date.getMinutes();
        newDate.setMinutes(minutes >= 59 ? 0 : minutes + 1);
        handleDateChange(newDate);
    };
    const decrementMinute = () => {
        if (!date) return;
        const newDate = new Date(date);
        const minutes = date.getMinutes();
        newDate.setMinutes(minutes <= 0 ? 59 : minutes - 1);
        handleDateChange(newDate);
    };
    return (
        <div className={`flex items-center gap-2 ${className || ''}`}>
            {/* Hidden input for form submission */}
            {name && (
                <input
                    type='hidden'
                    name={name}
                    value={date ? `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}` : ''}
                    required={required}
                />
            )}
            <div className='flex flex-col items-center'>
                <div className='flex flex-col items-center'>
                    <button
                        type='button'
                        onClick={incrementHour}
                        disabled={disabled}
                        className='rounded-t border border-input p-1 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50'>
                        <ChevronUp className='h-3 w-3' />
                    </button>
                    <TimePickerInput
                        picker={showPeriod ? '12hours' : 'hours'}
                        date={date}
                        setDate={handleDateChange}
                        period={showPeriod ? period : undefined}
                        ref={hourRef}
                        onRightFocus={() => minuteRef.current?.focus()}
                        disabled={disabled}
                        id={`${name}-hours` || 'hours'}
                        className='w-12 border-input border-x text-center'
                    />
                    <button
                        type='button'
                        onClick={decrementHour}
                        disabled={disabled}
                        className='rounded-b border border-input p-1 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50'>
                        <ChevronDown className='h-3 w-3' />
                    </button>
                </div>
                <Label htmlFor={`${name}-hours` || 'hours'} className='mt-1 text-xs'>
                    Hours
                </Label>
            </div>
            <span className='font-semibold text-lg'>:</span>
            <div className='flex flex-col items-center'>
                <div className='flex flex-col items-center'>
                    <button
                        type='button'
                        onClick={incrementMinute}
                        disabled={disabled}
                        className='rounded-t border border-input p-1 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50'>
                        <ChevronUp className='h-3 w-3' />
                    </button>
                    <TimePickerInput
                        picker='minutes'
                        date={date}
                        setDate={handleDateChange}
                        ref={minuteRef}
                        onLeftFocus={() => hourRef.current?.focus()}
                        disabled={disabled}
                        id={`${name}-minutes` || 'minutes'}
                        className='w-12 border-input border-x text-center'
                    />
                    <button
                        type='button'
                        onClick={decrementMinute}
                        disabled={disabled}
                        className='rounded-b border border-input p-1 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50'>
                        <ChevronDown className='h-3 w-3' />
                    </button>
                </div>
                <Label htmlFor={`${name}-minutes` || 'minutes'} className='mt-1 text-xs'>
                    Minutes
                </Label>
            </div>
            {showPeriod && (
                <Button
                    type='button'
                    onClick={handlePeriodChange}
                    disabled={disabled}
                    variant='outline'
                    className='h-[72px] px-3 font-medium text-sm'>
                    {period}
                </Button>
            )}
        </div>
    );
}
