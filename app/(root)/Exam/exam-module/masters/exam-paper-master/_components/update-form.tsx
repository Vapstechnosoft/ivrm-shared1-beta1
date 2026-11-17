'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterExamPaper } from '@/hooks/exam/exammodule/usemasters';
import { masterExamPaperSchema } from '@/schemas/exam/exam-module/masters';
import { addOrUpdateMasterExamPaper } from '@/server/exam/exam-module/masters/exam-paper';
import type { IMasterExamPaper } from '@/types/exam/exam-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterExamPaperSchema.addOrUpdate>;

interface UpdateMasterExamPaperFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterExamPaper;
}

export default function UpdateMasterExamPaperForm({ onSuccess, className = '', selectedRow: row }: UpdateMasterExamPaperFormProps) {
    const { refetchAll } = useMasterExamPaper();
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterExamPaperSchema.addOrUpdate),
        mode: 'onChange'
    });

    // Set initial values when a row is selected
    useEffect(() => {
        if (row) {
            reset({
                empatY_Id: row.empatY_Id,
                empatY_PaperTypeName: row.empatY_PaperTypeName,
                empatY_Color: row.empatY_Color,
                empatY_PaperTypeDescription: row.empatY_PaperTypeDescription
            });
        }
    }, [row, reset]);

    // Handle form submission
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                empatY_Id: row.empatY_Id, // Hardcoded for now
                empatY_PaperTypeName: data.empatY_PaperTypeName,
                empatY_Color: data.empatY_Color,
                empatY_PaperTypeDescription: data.empatY_PaperTypeDescription
            };

            const response = await addOrUpdateMasterExamPaper(payload);

            if (response.success) {
                toast.success(response.message);
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleReset = () => {
        reset();
    };

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500)
        return () => clearTimeout(timer);
    }, [row])

    if (isLoading) {
        return (
            <div className='flex flex-col items-center justify-center space-y-4 py-12'>
                <RefreshCw className='h-8 w-8 animate-spin text-secondary' />
                <p className='text-muted-foreground text-sm'>Loading data...</p>
            </div>
        );
    }

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Paper Type Name'
                            required
                            id='empatY_PaperTypeName'
                            {...register('empatY_PaperTypeName')}
                            defaultValue={row.empatY_PaperTypeName}
                            error={errors.empatY_PaperTypeName?.message}
                        />
                        <InputText
                            label='Color'
                            required
                            id='empatY_Color'
                            {...register('empatY_Color')}
                            defaultValue={row.empatY_Color}
                            error={errors.empatY_Color?.message}
                        />
                    </div>

                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Paper Type Description'
                            required
                            id='empatY_PaperTypeDescription'
                            {...register('empatY_PaperTypeDescription')}
                            defaultValue={row.empatY_PaperTypeDescription}
                            error={errors.empatY_PaperTypeDescription?.message}
                        />
                    </div>

                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button type='button' variant='outline' onClick={handleReset} disabled={isSubmitting} className='order-2 w-fit'>
                        Reset
                    </Button>
                    <Button
                        type='submit'
                        disabled={isSubmitting}
                        isLoading={isSubmitting}
                        loadingText='Saving...'
                        className='order-1 w-fit'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Save Paper Type
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
