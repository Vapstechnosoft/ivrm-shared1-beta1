'use client';

import { CaretDownIcon, CaretUpIcon } from '@radix-ui/react-icons';
import {
    type ButtonProps as AriaButtonProps,
    Input as AriaInput,
    type InputProps as AriaInputProps,
    NumberField as AriaNumberField,
    type NumberFieldProps as AriaNumberFieldProps,
    type ValidationResult as AriaValidationResult,
    Text,
    composeRenderProps
} from 'react-aria-components';

import { cn } from '@/lib/utils';

import { FieldError, FieldGroup, Label } from '@/components/ui/extension/field';
import { Button } from './button';

const NumberField = AriaNumberField;

function NumberFieldInput({ className, ...props }: AriaInputProps) {
    return (
        <AriaInput
            className={composeRenderProps(className, (className) =>
                cn(
                    'w-fit min-w-0 flex-1 border-transparent border-r bg-background pr-2 outline outline-0 placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden',
                    className
                )
            )}
            {...props}
        />
    );
}

function NumberFieldSteppers({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div className={cn('absolute right-0 flex h-full flex-col border-l', className)} {...props}>
            <NumberFieldStepper slot='increment' type='button'>
                <CaretUpIcon aria-hidden className='size-4' />
            </NumberFieldStepper>
            <div className='border-b' />
            <NumberFieldStepper slot='decrement' type='button'>
                <CaretDownIcon aria-hidden className='size-4' />
            </NumberFieldStepper>
        </div>
    );
}

function NumberFieldStepper({ className, ...props }: AriaButtonProps) {
    return (
        <Button
            className={composeRenderProps(className, (className) => cn('w-auto grow rounded-none px-0.5 text-muted-foreground', className))}
            variant={'ghost'}
            size={'icon'}
            {...props}
        />
    );
}

interface NumberFieldProps extends AriaNumberFieldProps {
    label?: string;
    description?: string;
    required?: boolean;
    optional?: boolean;
    error?: string | ((validation: AriaValidationResult) => string);
    inputFieldClassName?: string;
    step?: number;
    formatOptions?: Intl.NumberFormatOptions;
    maxDigits?: number;
    placeholder?: string;
}

function InputNumber({
    label,
    description,
    error,
    className,
    inputFieldClassName,
    required,
    optional,
    step = 1,
    formatOptions = { minimumFractionDigits: 0, maximumFractionDigits: 1 },
    maxDigits,
    placeholder,
    ...props
}: NumberFieldProps) {
    // Check if defaultValue is provided; if undefined, let it be undefined.
    // We only sanitize NaN if a value IS provided but invalid, though typical usage defines it or not.
    // To safely handle existing usages relying on 0, we'll only check if it is explicitly passed as undefined.
    // If it's NaN, we probably shouldn't pass it as is, but passing undefined is safer than forced 0.
    const safeDefaultValue = props.defaultValue;
    // Compute a maxValue from maxDigits if provided and no explicit maxValue passed
    const computedMaxValue = props.maxValue ?? (maxDigits ? 10 ** maxDigits - 1 : undefined);
    return (
        <NumberField
            className={composeRenderProps(className, (className) => cn('group flex flex-col gap-1.5', className))}
            step={step}
            formatOptions={formatOptions}
            defaultValue={safeDefaultValue}
            isInvalid={!!error}
            {...(computedMaxValue !== undefined ? { maxValue: computedMaxValue } : {})}
            {...props}>
            <Label aria-label={label}>
                {label}
                {required && <span className='ml-1 text-red-500'>*</span>}
                {optional && <span className='text-muted-foreground'>(optional)</span>}
            </Label>
            <FieldGroup className={cn('w-full', inputFieldClassName)}>
                <NumberFieldInput maxLength={maxDigits} inputMode='numeric' placeholder={placeholder} />
                <NumberFieldSteppers />
            </FieldGroup>
            {description && !error && (
                <Text className='text-[0.8rem] text-muted-foreground' slot='description'>
                    {description}
                </Text>
            )}
            {error && <div className='font-medium text-[0.8rem] text-destructive'>{typeof error === 'function' ? 'Invalid input' : error}</div>}
        </NumberField>
    );
}

export { NumberField, NumberFieldInput, NumberFieldSteppers, NumberFieldStepper, InputNumber };

export type { NumberFieldProps };
