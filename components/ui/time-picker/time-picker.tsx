'use client';

import { Label } from '@/components/ui/label';
import * as React from 'react';
import { TimePickerInput } from './time-picker-input';

interface TimePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    // New props for form integration
    name?: string;
    value?: string; // HH:mm:ss format
    onChange?: (value: string) => void; // Returns HH:mm:ss format
    disabled?: boolean;
    required?: boolean;
    className?: string;
}

export function TimePicker({ date, setDate, name, value, onChange, disabled = false, required = false, className }: TimePickerProps) {
    const minuteRef = React.useRef<HTMLInputElement>(null);
    const hourRef = React.useRef<HTMLInputElement>(null);
    const secondRef = React.useRef<HTMLInputElement>(null);

    // Handle controlled component behavior
    React.useEffect(() => {
        if (value && !date) {
            // Parse HH:mm:ss format to create a Date object
            const [hours, minutes, seconds] = value.split(':').map(Number);
            const newDate = new Date();
            newDate.setHours(hours || 0, minutes || 0, seconds || 0, 0);
            setDate(newDate);
        }
    }, [value, date, setDate]);

    // Handle date changes and call onChange with HH:mm:ss format
    const handleDateChange = React.useCallback(
        (newDate: Date | undefined) => {
            setDate(newDate);
            if (newDate && onChange) {
                const hours = newDate.getHours().toString().padStart(2, '0');
                const minutes = newDate.getMinutes().toString().padStart(2, '0');
                const seconds = newDate.getSeconds().toString().padStart(2, '0');
                onChange(`${hours}:${minutes}:${seconds}`);
            } else if (!newDate && onChange) {
                onChange('');
            }
        },
        [setDate, onChange]
    );

    // Initialize with current time if no date is provided
    React.useEffect(() => {
        if (!date && !value) {
            const now = new Date();
            now.setHours(0, 0, 0, 0); // Start with 00:00:00
            handleDateChange(now);
        }
    }, [date, value, handleDateChange]);

    return (
        <div className={`flex items-start gap-2 ${className || ''}`}>
            {/* Hidden input for form submission */}
            {name && (
                <input
                    type='hidden'
                    name={name}
                    value={
                        date
                            ? `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
                            : ''
                    }
                    required={required}
                />
            )}

            <div className='grid gap-1 text-center'>
                <TimePickerInput
                    picker='hours'
                    date={date}
                    setDate={handleDateChange}
                    ref={hourRef}
                    onRightFocus={() => minuteRef.current?.focus()}
                    disabled={disabled}
                    id={`${name}-hours` || 'hours'}
                />
                <Label htmlFor={`${name}-hours` || 'hours'} className='text-xs'>
                    Hours
                </Label>
            </div>
            <div className='grid gap-1 text-center'>
                <TimePickerInput
                    picker='minutes'
                    date={date}
                    setDate={handleDateChange}
                    ref={minuteRef}
                    onLeftFocus={() => hourRef.current?.focus()}
                    onRightFocus={() => secondRef.current?.focus()}
                    disabled={disabled}
                    id={`${name}-minutes` || 'minutes'}
                />
                <Label htmlFor={`${name}-minutes` || 'minutes'} className='text-xs'>
                    Minutes
                </Label>
            </div>
            <div className='grid gap-1 text-center'>
                <TimePickerInput
                    picker='seconds'
                    date={date}
                    setDate={handleDateChange}
                    ref={secondRef}
                    onLeftFocus={() => minuteRef.current?.focus()}
                    disabled={disabled}
                    id={`${name}-seconds` || 'seconds'}
                />
                <Label htmlFor={`${name}-seconds` || 'seconds'} className='text-xs'>
                    Seconds
                </Label>
            </div>
        </div>
    );
}
