'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { useCoScholasticActivity } from '@/hooks/exam/exammodule/usemasters';
import { coScholasticActivitySchema } from '@/schemas/exam/exam-module/masters';
import { addOrUpdatecoScholasticActivity } from '@/server/exam/exam-module/masters/co-scholastic-activity';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof coScholasticActivitySchema.addOrUpdate>;

interface AddCoScholasticActivityFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddCoScholasticActivityForm({ onSuccess, className = '' }: AddCoScholasticActivityFormProps) {
    const { refetchAll } = useCoScholasticActivity();

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(coScholasticActivitySchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            ecacT_Id: 0,
            ecacT_SkillName: '',
            ecacT_SkillCode: ''
        }
    });
    //  Add or Update Co-Scholastic Activity
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                ...data
            };

            const response = await addOrUpdatecoScholasticActivity(payload);

            if (response.success) {
                toast.success(response.message || 'Co-Scholastic Activity added successfully');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message || 'Failed to add Co-Scholastic Activity');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    const handleReset = () => reset();
    // Fetch and open order modal
    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Co-Scholastic Activity Name'
                            required
                            {...register('ecacT_SkillName')}
                            error={errors.ecacT_SkillName?.message}
                            onInput={(e) => {
                                const input = e.currentTarget;
                                input.value = input.value.replace(/[^A-Za-z0-9\s]/g, '');
                            }}
                        />

                        <InputText
                            label='Co-Scholastic Activity Code'
                            required
                            {...register('ecacT_SkillCode')}
                            error={errors.ecacT_SkillCode?.message}
                            onInput={(e) => {
                                const input = e.currentTarget;
                                input.value = input.value.replace(/[^A-Za-z0-9]/g, '');
                            }}
                        />
                    </div>
                </div>

                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className='order-3 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
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
                            Save Activity
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
