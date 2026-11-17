'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterExam } from '@/hooks/exam/exammodule/usemasters';
import { masterSubExamSchema } from '@/schemas/exam/exam-module/masters';
import { addOrUpdateMasterSubExam } from '@/server/exam/exam-module/masters/sub-exam';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterSubExamSchema.addOrUpdate>;

interface AddMasterSubExamFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddMasterSubExamForm({ onSuccess, className = '' }: AddMasterSubExamFormProps) {
    const { refetchAll } = useMasterExam();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterSubExamSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            emsE_Id: 0,
            emsE_SubExamName: '',
            emsE_SubExamCode: ''
        }
    });
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const response = await addOrUpdateMasterSubExam(data);
            if (response.success) {
                toast.success(response.message);
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Error saving sub-exam.');
        }
    };
    const handleReset = () => {
        reset();
    };
    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                {/* Basic Fields */}
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <InputText
                        label='Sub Exam Name'
                        required
                        id='emsE_SubExamName'
                        {...register('emsE_SubExamName')}
                        error={errors.emsE_SubExamName?.message}
                    />

                    <InputText
                        label='Sub Exam Code'
                        required
                        id='emsE_SubExamCode'
                        {...register('emsE_SubExamCode')}
                        error={errors.emsE_SubExamCode?.message}
                    />
                </div>
                {/* Root Error */}
                {errors.root && <FormError>{errors.root.message}</FormError>}

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
                            Save Sub Exam
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
