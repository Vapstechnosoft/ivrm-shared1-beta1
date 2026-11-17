'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FieldValues, FormProvider, useForm, type SubmitHandler, type UseFormProps } from 'react-hook-form';
import { toast } from 'sonner';
import { type z } from 'zod';

interface GenericFormProps<TData extends FieldValues, TSchema extends z.ZodType<any>> {
    schema: TSchema;
    initialValues: TData;
    onSubmit: (values: TData) => Promise<void> | void;
    mode?: 'create' | 'edit';
    successMessage?: string;
    errorMessage?: string;
    onSuccess?: () => void;
    className?: string;
    children: React.ReactNode;
}

export function GenericForm<TData extends FieldValues, TSchema extends z.ZodType<any>>({
    schema,
    initialValues,
    onSubmit,
    mode = 'create',
    successMessage = 'Submitted successfully',
    errorMessage = 'Failed to submit',
    onSuccess,
    className,
    children
}: GenericFormProps<TData, TSchema>) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const methods = useForm<TData>({
        resolver: zodResolver(schema),
        defaultValues: initialValues as any
    });

    const handleSubmit: SubmitHandler<TData> = async (values) => {
        setIsSubmitting(true);
        try {
            await onSubmit(values);
            toast.success(successMessage);
            onSuccess?.();
            if (mode === 'create') {
                methods.reset();
            }
        } catch (error) {
            console.error(error);
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)} className={cn('space-y-6', className)}>
                {children}
                <div className='flex justify-end gap-2'>
                    <Button type='submit' disabled={isSubmitting} isLoading={isSubmitting}>
                        {mode === 'create' ? 'Create' : 'Update'}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
