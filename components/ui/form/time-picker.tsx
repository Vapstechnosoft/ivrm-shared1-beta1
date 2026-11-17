'use client';

import * as React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils'; // Assuming cn utility exists

interface TimePickerProps {
    value?: string; // "HH:mm" in 24h format
    onChange?: (value: string) => void;
    disabled?: boolean;
    className?: string;
    min?: string; // "HH:mm"
}

export function TimePicker({ value, onChange, disabled, className, min }: TimePickerProps) {
    // Parse initial value
    const [hours, setHours] = React.useState(12);
    const [minutes, setMinutes] = React.useState(0);
    const [period, setPeriod] = React.useState<'AM' | 'PM'>('AM');

    React.useEffect(() => {
        if (value) {
            const [h, m] = value.split(':').map(Number);
            if (!isNaN(h) && !isNaN(m)) {
                if (h === 0) {
                    setHours(12);
                    setPeriod('AM');
                } else if (h === 12) {
                    setHours(12);
                    setPeriod('PM');
                } else if (h > 12) {
                    setHours(h - 12);
                    setPeriod('PM');
                } else {
                    setHours(h);
                    setPeriod('AM');
                }
                setMinutes(m);
            }
        }
    }, [value]);

    const updateValue = (newHours: number, newMinutes: number, newPeriod: 'AM' | 'PM') => {
        let h = newHours;
        if (newPeriod === 'AM') {
            if (h === 12) h = 0;
        } else {
            if (h !== 12) h += 12;
        }

        const timeString = `${h.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
        onChange?.(timeString);
    };

    const handleHourChange = (delta: number) => {
        if (disabled) return;
        let newHours = hours + delta;
        if (newHours > 12) newHours = 1;
        if (newHours < 1) newHours = 12;
        setHours(newHours);
        updateValue(newHours, minutes, period);
    };

    const handleMinuteChange = (delta: number) => {
        if (disabled) return;
        let newMinutes = minutes + delta;
        if (newMinutes > 59) newMinutes = 0;
        if (newMinutes < 0) newMinutes = 59;
        setMinutes(newMinutes);
        updateValue(hours, newMinutes, period);
    };

    const togglePeriod = () => {
        if (disabled) return;
        const newPeriod = period === 'AM' ? 'PM' : 'AM';
        setPeriod(newPeriod);
        updateValue(hours, minutes, newPeriod);
    };

    return (
        <div className={cn("flex items-center gap-1", className)}>
            {/* Hours */}
            <div className="flex flex-col items-center gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleHourChange(1)}
                    disabled={disabled}
                >
                    <ChevronUp className="h-4 w-4" />
                </Button>
                <div className="flex items-center justify-center border rounded-md h-8 w-10 bg-background">
                    <span className="text-sm font-medium">{hours.toString().padStart(2, '0')}</span>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleHourChange(-1)}
                    disabled={disabled}
                >
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </div>

            <span className="pb-1 font-bold text-lg">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleMinuteChange(1)}
                    disabled={disabled}
                >
                    <ChevronUp className="h-4 w-4" />
                </Button>
                <div className="flex items-center justify-center border rounded-md h-8 w-10 bg-background">
                    <span className="text-sm font-medium">{minutes.toString().padStart(2, '0')}</span>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleMinuteChange(-1)}
                    disabled={disabled}
                >
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </div>

            {/* Period */}
            <div className="flex flex-col items-center gap-1 ml-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={togglePeriod}
                    disabled={disabled}
                >
                    <ChevronUp className="h-4 w-4" />
                </Button>
                <div className="flex items-center justify-center border rounded-md h-8 w-10 bg-background cursor-pointer" onClick={togglePeriod}>
                    <span className="text-sm font-medium">{period}</span>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={togglePeriod}
                    disabled={disabled}
                >
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
