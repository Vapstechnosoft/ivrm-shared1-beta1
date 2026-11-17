'use client';

import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { FormError, Label } from '@/components/ui/extension/field';
import { TimePicker } from './time-picker';
import { cn } from '@/lib/utils';

interface FormTimePickerProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    disabled?: boolean;
    min?: string;
    className?: string;
    required?: boolean;
    error?: string;
}

export function FormTimePicker<T extends FieldValues>({
    control,
    name,
    label,
    disabled,
    min,
    className,
    required,
    error
}: FormTimePickerProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState: { error: fieldError } }) => (
                <div className={cn("group flex flex-col gap-2", className)}>
                    {label && (
                        <Label htmlFor={name} className={cn(fieldError && "text-red-500")}>
                            {label} {required && <span className="ml-1 text-red-500">*</span>}
                        </Label>
                    )}
                    <TimePicker
                        value={field.value}
                        onChange={field.onChange}
                        disabled={disabled}
                        min={min}
                        className={cn(
                            fieldError && "border-red-500 focus:border-red-500 focus:ring-red-500"
                        )}
                    />
                    {(fieldError?.message || error) && (
                        <FormError>{fieldError?.message || error}</FormError>
                    )}
                </div>
            )}
        />
    );
}