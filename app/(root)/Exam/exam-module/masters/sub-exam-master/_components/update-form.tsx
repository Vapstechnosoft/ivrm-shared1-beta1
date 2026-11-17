'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterSubExam } from '@/hooks/exam/exammodule/usemasters';
import { masterSubExamSchema } from '@/schemas/exam/exam-module/masters';
import { addOrUpdateMasterSubExam } from '@/server/exam/exam-module/masters/sub-exam';
import type { IMasterSubExam } from '@/types/exam/exam-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterSubExamSchema.addOrUpdate>;

interface UpdateMasterSubExamFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterSubExam;
}

export default function UpdateMasterSubExamForm({ onSuccess, className = '', selectedRow: row }: UpdateMasterSubExamFormProps) {
    const { refetchAll } = useMasterSubExam();
    const [isLoading, setIsLoading] = useState(false);
    const {
        setValue,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterSubExamSchema.addOrUpdate),
        mode: 'onChange'
    });

    useEffect(() => {
        if (row) {
            reset({
                emsE_Id: row.emsE_Id,
                emsE_SubExamName: row.emsE_SubExamName,
                emsE_SubExamCode: row.emsE_SubExamCode
            });
        }
    }, [row, reset, setValue]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                emsE_Id: data.emsE_Id,
                emsE_SubExamName: data.emsE_SubExamName,
                emsE_SubExamCode: data.emsE_SubExamCode
            };

            const response = await addOrUpdateMasterSubExam(payload);

            if (response.success) {
                toast.success(response.message);
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
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
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    {/* Basic Fields */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Sub Exam Name'
                            required
                            id='emsE_SubExamName'
                            {...register('emsE_SubExamName')}
                            defaultValue={row.emsE_SubExamName}
                            error={errors.emsE_SubExamName?.message}
                        />
                        <InputText
                            label='Sub Exam Code'
                            required
                            id='emsE_SubExamCode'
                            {...register('emsE_SubExamCode')}
                            defaultValue={row.emsE_SubExamCode}
                            error={errors.emsE_SubExamCode?.message}
                        />
                    </div>

                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                {/* Buttons */}
                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                        Reset
                    </Button>
                    <Button
                        type='submit'
                        disabled={isSubmitting}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Update Sub exam
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
