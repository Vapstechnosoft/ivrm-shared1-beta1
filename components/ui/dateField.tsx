'use client';

import { Button } from '@/components/ui/button';
import { CalendarYear } from '@/components/ui/calendar_year';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, isValid, parse } from 'date-fns';
import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FormError, Label } from './extension/field';

interface DateFieldProps {
    field: any;
    fieldState: any;
    label: string;
    placeholder?: string;
    fromDate?: Date;
    toDate?: Date;
    restricted_tofieldName?: string;
    restricted_fromfieldName?: string;
    disabled?: boolean;
    required?: boolean;
    outputFormat?: 'date' | 'string';
}

export const DateField: React.FC<DateFieldProps> = ({
    field,
    fieldState,
    label,
    placeholder = 'Pick a date',
    fromDate,
    toDate,
    restricted_tofieldName,
    restricted_fromfieldName,
    disabled,
    required,
    outputFormat = 'string'
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const parseInputDate = (val: any): Date | null => {
        if (!val && val !== 0) return null;
        if (val instanceof Date) return val;
        if (typeof val === 'number') {
            const d = new Date(val);
            return isValid(d) ? d : null;
        }
        if (typeof val === 'string') {
            // Try ISO / RFC parsing first
            const iso = new Date(val);
            if (isValid(iso)) return iso;

            // Try common formats dd/MM/yyyy and dd-MM-yyyy
            const fmt1 = parse(val, 'dd/MM/yyyy', new Date());
            if (isValid(fmt1)) return fmt1;

            const fmt2 = parse(val, 'dd-MM-yyyy', new Date());
            if (isValid(fmt2)) return fmt2;
        }
        return null;
    };

    const [selectedDate, setSelectedDate] = useState<Date | null>(parseInputDate(field.value));

    useEffect(() => {
        setSelectedDate(parseInputDate(field.value));
    }, [field.value]);

    const handleSelect = (date: Date | undefined) => {
        if (!date) return;
        if (toDate && date > toDate) {
            toast.error(`you can not select date greater than ${restricted_tofieldName} i.e -${format(toDate, 'dd-MM-yyyy')}`);
            return;
        }
        if (fromDate && date < fromDate) {
            toast.error(`you can not select date less than ${restricted_fromfieldName} i.e -${format(fromDate, 'dd-MM-yyyy')}`);
            return;
        }
        setSelectedDate(date);
        field.onChange(outputFormat === 'date' ? date : date.toISOString());
        setIsOpen(false);
    };

    return (
        <div className='mt-5 flex flex-col gap-1.5'>
            <Label htmlFor={field.name}>
                {label}
                {required && <span className='ml-1 text-red-500'>*</span>}
            </Label>

            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant='outline'
                        disabled={disabled}
                        className={cn('w-full justify-between font-normal', !selectedDate && 'text-muted-foreground')}>
                        {selectedDate ? format(selectedDate, 'dd-MM-yyyy') : <span>{placeholder}</span>}
                        <Calendar className='ml-auto h-4 w-4 opacity-50' />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className='flex w-auto items-start p-0' align='start'>
                    <CalendarYear
                        mode='single'
                        captionLayout='buttons'
                        selected={selectedDate ?? undefined}
                        onSelect={handleSelect}
                        onDayClick={() => setIsOpen(false)}
                        fromDate={fromDate}
                    />
                </PopoverContent>
            </Popover>

            {fieldState?.error && <FormError>{fieldState.error.message}</FormError>}
        </div>
    );
};
