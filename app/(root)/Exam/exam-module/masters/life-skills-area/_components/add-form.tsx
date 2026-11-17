'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterLifeSkillArea } from '@/hooks/exam/exammodule/usemasters';
import { lifeSkillAreaSchema } from '@/schemas/exam/exam-module/masters';
import { addOrUpdateMasterLifeSkillArea } from '@/server/exam/exam-module/masters/life-skills';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { type SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof lifeSkillAreaSchema.addOrUpdate>;

interface AddLifeSkillAreaFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddLifeSkillAreaForm({ onSuccess, className = '' }: AddLifeSkillAreaFormProps) {
    const { refetchAll } = useMasterLifeSkillArea();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(lifeSkillAreaSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            ecS_Id: 0,
            ecS_SkillName: 'Life Skill', // hidden default value
            ecS_SkillCode: 'LS001', // hidden default value
            subexamDTO: [
                {
                    ecsA_Id: 0,
                    ecsA_SkillOrder: 0,
                    ecsA_SkillArea: ''
                }
            ],
            mappingDTO: []
        }
    });

    const { fields: subAreas } = useFieldArray({
        control,
        name: 'subexamDTO'
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                ...data
            };
            const response = await addOrUpdateMasterLifeSkillArea(payload);

            if (response.success) {
                toast.success(response.message || 'Life Skill Area added successfully');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message || 'Failed to add Life Skill Area');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                {/* Hidden Inputs to maintain schema validity */}
                <input type='hidden' {...register('ecS_SkillName')} value='Life Skill' />
                <input type='hidden' {...register('ecS_SkillCode')} value='LS001' />

                <div className='space-y-4'>
                    <div className='mt-4'>
                        {subAreas.map((_, index) => (
                            <div
                                key={index}
                                className='mb-3 flex flex-wrap items-center justify-center gap-6 rounded-lg border bg-gray-50 p-3'>
                                <div className='w-[30%]'>
                                    <InputText
                                        label='Skill Area Name'
                                        required
                                        {...register(`subexamDTO.${index}.ecsA_SkillArea` as const)}
                                        error={errors.subexamDTO?.[index]?.ecsA_SkillArea?.message}
                                    />
                                </div>

                                <div className='w-[30%]'>
                                    <InputText
                                        label='Skill Area Order'
                                        type='number'
                                        required
                                        {...register(`subexamDTO.${index}.ecsA_SkillOrder` as const, {
                                            valueAsNumber: true
                                        })}
                                        error={errors.subexamDTO?.[index]?.ecsA_SkillOrder?.message}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={() => reset()}
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
                            Save Life Skill Area
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
