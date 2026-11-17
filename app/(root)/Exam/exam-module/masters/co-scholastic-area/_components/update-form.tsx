'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { useCoScholasticArea } from '@/hooks/exam/exammodule/usemasters';
import { coScholasticAreaSchema } from '@/schemas/exam/exam-module/masters';
import { addOrUpdatecoScholasticArea } from '@/server/exam/exam-module/masters/co-scholastic-area';
import type { ICoScholasticArea } from '@/types/exam/exam-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof coScholasticAreaSchema.addOrUpdate>;

interface UpdateCoScholasticAreaFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: ICoScholasticArea;
}

export default function UpdateCoScholasticAreaForm({ onSuccess, className = '', selectedRow: row }: UpdateCoScholasticAreaFormProps) {
    const { refetchAll } = useCoScholasticArea();

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(coScholasticAreaSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            ecactA_Id: 0,
            ecactA_SkillArea: '',
            ecactA_SkillOrder: 0
        }
    });

    // ✅ Prefill data when editing
    useEffect(() => {
        if (row) {
            reset({
                ecactA_Id: row.ecactA_Id,
                ecactA_SkillArea: row.ecactA_SkillArea ?? '',
                ecactA_SkillOrder: row.ecactA_SkillOrder ?? 0
            });
        }
    }, [row, reset]);

    // ✅ Submit handler
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                ...data
            };

            const response = await addOrUpdatecoScholasticArea(payload);

            if (response.success) {
                toast.success(response.message || 'Exam updated successfully');
                reset(payload);
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message || 'Failed to update exam');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    // ✅ Reset form to selected row values
    const handleReset = () => {
        if (row) {
            reset({
                ecactA_Id: row.ecactA_Id,
                ecactA_SkillArea: row.ecactA_SkillArea ?? '',
                ecactA_SkillOrder: row.ecactA_SkillOrder ?? 0
            });
        }
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                {/* Exam Basic Info */}
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <InputText
                        label='Co-Scholastic Area Name'
                        required
                        {...register('ecactA_SkillArea')}
                        error={errors.ecactA_SkillArea?.message}
                        onInput={(e) => {
                            const input = e.currentTarget; // <-- HTMLInputElement
                            input.value = input.value.replace(/[^A-Za-z0-9\s]/g, '');
                        }}
                    />
                    <InputText
                        label='Co-Scholastic Activity Order'
                        type='number'
                        required
                        {...register('ecactA_SkillOrder')}
                        error={errors.ecactA_SkillOrder?.message}
                        onInput={(e) => {
                            const input = e.currentTarget; // <-- HTMLInputElement
                            input.value = input.value.replace(/[^0-9]/g, '');
                        }}
                    />
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
                            Update exam
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
