'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';

interface GenericInputFieldProps {
    name: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    type?: string;
    className?: string;
}

export function GenericInputField({
    name,
    label,
    placeholder,
    required,
    disabled,
    type = 'text',
    className
}: GenericInputFieldProps) {
    const {
        register,
        formState: { errors }
    } = useFormContext();
    const error = errors[name];

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <Label htmlFor={name} className={cn(required && "after:ml-0.5 after:text-red-500 after:content-['*']")}>
                {label}
            </Label>
            <Input
                id={name}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(error && 'border-destructive focus-visible:ring-destructive')}
                {...register(name)}
            />
            {error && <span className='text-xs text-destructive'>{error.message as string}</span>}
        </div>
    );
}

interface GenericTextAreaFieldProps {
    name: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    rows?: number;
}

export function GenericTextAreaField({
    name,
    label,
    placeholder,
    required,
    disabled,
    className,
    rows
}: GenericTextAreaFieldProps) {
    const {
        register,
        formState: { errors }
    } = useFormContext();
    const error = errors[name];

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <Label htmlFor={name} className={cn(required && "after:ml-0.5 after:text-red-500 after:content-['*']")}>
                {label}
            </Label>
            <Textarea
                id={name}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(error && 'border-destructive focus-visible:ring-destructive')}
                {...register(name)}
                rows={rows}
            />
            {error && <span className='text-xs text-destructive'>{error.message as string}</span>}
        </div>
    );
}
