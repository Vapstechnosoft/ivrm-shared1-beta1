'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const weekDays = [
    { value: 'MON', label: 'Monday' },
    { value: 'TUE', label: 'Tuesday' },
    { value: 'WED', label: 'Wednesday' },
    { value: 'THU', label: 'Thursday' },
    { value: 'FRI', label: 'Friday' },
    { value: 'SAT', label: 'Saturday' },
    { value: 'SUN', label: 'Sunday' }
];

interface DaySelectionCheckboxProps {
    checked?: boolean;
    selectedDays?: string[];
    onCheckedChange?: (checked: boolean) => void;
    onDaysChange?: (days: string[]) => void;
    className?: string;
    id?: string;
    label?: string;
}

export function DaySelectionCheckbox({
    checked = false,
    selectedDays = [],
    onCheckedChange,
    onDaysChange,
    className,
    id,
    label
}: DaySelectionCheckboxProps) {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    // Auto-update checked state based on selectedDays
    const isChecked = checked || selectedDays.length > 0;

    const handleDayToggle = (dayValue: string) => {
        const newSelectedDays = selectedDays.includes(dayValue) ? selectedDays.filter((d) => d !== dayValue) : [...selectedDays, dayValue];
        onDaysChange?.(newSelectedDays);

        // Update checked state based on whether any days are selected
        const hasSelectedDays = newSelectedDays.length > 0;
        onCheckedChange?.(hasSelectedDays);
    };

    const handlePopoverOpenChange = (open: boolean) => {
        setIsPopoverOpen(open);
    };

    return (
        <Popover open={isPopoverOpen} onOpenChange={handlePopoverOpenChange}>
            <div className={cn('flex items-center gap-2', className)}>
                <PopoverTrigger asChild>
                    <button
                        type='button'
                        aria-checked={isChecked}
                        data-state={isChecked ? 'checked' : 'unchecked'}
                        className='peer inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-xs border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground'
                        aria-label='Select days'>
                        {isChecked && (
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='3'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                className='h-4 w-4 text-primary-foreground'>
                                <path d='M20 6L9 17l-5-5' />
                            </svg>
                        )}
                    </button>
                </PopoverTrigger>
                {label && (
                    <label
                        htmlFor={id}
                        className='cursor-pointer font-medium text-sm'
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsPopoverOpen(!isPopoverOpen);
                        }}>
                        {label}
                    </label>
                )}
            </div>
            <PopoverContent className='w-auto p-3' align='start'>
                <div className='space-y-3'>
                    <span className='font-medium text-sm'>Select Days:</span>
                    <div className='grid grid-cols-2 gap-2'>
                        {weekDays.map((day) => (
                            <div
                                key={day.value}
                                className='flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm transition-colors hover:bg-accent'
                                onClick={() => handleDayToggle(day.value)}>
                                <Checkbox checked={selectedDays.includes(day.value)} onCheckedChange={() => handleDayToggle(day.value)} />
                                <span>{day.label}</span>
                            </div>
                        ))}
                    </div>
                    {selectedDays.length > 0 && (
                        <div className='mt-2 border-t pt-2'>
                            <div className='text-muted-foreground text-xs'>
                                Selected: {selectedDays.map((d) => weekDays.find((wd) => wd.value === d)?.label).join(', ')}
                            </div>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
