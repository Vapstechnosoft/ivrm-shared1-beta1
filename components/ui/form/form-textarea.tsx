'use client';

import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface FormTextareaProps<T extends FieldValues> extends Omit<any, 'name' | 'error' | 'value' | 'onChange' | 'onBlur'> {
    control: Control<T>;
    name: Path<T>;
}

export function FormTextarea<T extends FieldValues>({ control, name, ...props }: FormTextareaProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState: { error } }) => (
                <InputTextarea
                    {...props}
                    {...field}
                    error={error?.message}
                    value={field.value || ''}
                    id={name}
                />
            )}
        />
    );
}
