'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { useCoScholasticArea } from '@/hooks/exam/exammodule/usemasters';
import { coScholasticAreaSchema } from '@/schemas/exam/exam-module/masters';
import { addOrUpdatecoScholasticArea } from '@/server/exam/exam-module/masters/co-scholastic-area';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof coScholasticAreaSchema.addOrUpdate>;

interface AddCoScholasticAreaFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddCoScholasticAreaForm({ onSuccess, className = '' }: AddCoScholasticAreaFormProps) {
    const { refetchAll } = useCoScholasticArea();

    const {
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
    //  Add or Update Co-Scholastic Area
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                ...data
            };

            const response = await addOrUpdatecoScholasticArea(payload);

            if (response.success) {
                toast.success(response.message || 'Co-Scholastic Area added successfully');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message || 'Failed to add Co-Scholastic Area');
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
                            label='Co-Scholastic Area Order'
                            required
                            {...register('ecactA_SkillOrder')}
                            error={errors.ecactA_SkillOrder?.message}
                            onInput={(e) => {
                                const input = e.currentTarget; // <-- HTMLInputElement
                                input.value = input.value.replace(/[^0-9]/g, '');
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
                            Save Area
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
