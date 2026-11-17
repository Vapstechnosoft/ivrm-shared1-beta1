'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterLifeSkills } from '@/hooks/exam/exammodule/usemasters';
import { masterLifeSkillSchema } from '@/schemas/exam/exam-module/masters';
import { addOrUpdateMasterLifeSkill } from '@/server/exam/exam-module/masters/life-skills';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterLifeSkillSchema.addOrUpdate>;

interface AddLifeSkillFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddLifeSkillForm({ onSuccess, className = '' }: AddLifeSkillFormProps) {
    const { refetchAll } = useMasterLifeSkills();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterLifeSkillSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            ecS_Id: 0,
            ecS_SkillName: '',
            ecS_SkillCode: ''
        }
    });

    // Add or Update Life Skill
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                ...data
            };

            const response = await addOrUpdateMasterLifeSkill(payload);

            if (response.success) {
                toast.success(response.message || 'Life Skill added successfully');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message || 'Failed to add Life Skill');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    const handleReset = () => reset();

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText label='Life Skill Name' required {...register('ecS_SkillName')} error={errors.ecS_SkillName?.message} />
                        <InputText label='Life Skill Code' required {...register('ecS_SkillCode')} error={errors.ecS_SkillCode?.message} />
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
                            Save Life Skill
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
