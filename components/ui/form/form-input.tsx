'use client';

import { InputText, InputTextProps } from '@/components/ui/extension/input-text';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface FormInputProps<T extends FieldValues> extends Omit<InputTextProps, 'name' | 'error' | 'value' | 'onChange' | 'onBlur'> {
    control: Control<T>;
    name: Path<T>;
}

export function FormInput<T extends FieldValues>({ control, name, ...props }: FormInputProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState: { error } }) => (
                <InputText
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
