'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterLifeSkills } from '@/hooks/exam/exammodule/usemasters';
import { masterLifeSkillSchema } from '@/schemas/exam/exam-module/masters';
import { addOrUpdateMasterLifeSkill } from '@/server/exam/exam-module/masters/life-skills';
import type { ILifeSkill } from '@/types/exam/exam-module/masters'; // make sure this type exists
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterLifeSkillSchema.addOrUpdate>;

interface UpdateLifeSkillFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: ILifeSkill;
}

export default function UpdateLifeSkillForm({ onSuccess, className = '', selectedRow: row }: UpdateLifeSkillFormProps) {
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

    // ✅ Prefill values when editing
    useEffect(() => {
        if (row) {
            reset({
                ecS_Id: row.ecS_Id,
                ecS_SkillName: row.ecS_SkillName ?? '',
                ecS_SkillCode: row.ecS_SkillCode ?? ''
            });
        }
    }, [row, reset]);

    // ✅ Submit handler
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                ...data
            };

            const response = await addOrUpdateMasterLifeSkill(payload);

            if (response.success) {
                toast.success(response.message || 'Life Skill updated successfully');
                reset(payload);
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message || 'Failed to update Life Skill');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    // ✅ Reset form to original row values
    const handleReset = () => {
        if (row) {
            reset({
                ecS_Id: row.ecS_Id,
                ecS_SkillName: row.ecS_SkillName ?? '',
                ecS_SkillCode: row.ecS_SkillCode ?? ''
            });
        }
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                {/* Life Skill Info */}
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <InputText label='Life Skill Name' required {...register('ecS_SkillName')} error={errors.ecS_SkillName?.message} />
                    <InputText label='Life Skill Code' required {...register('ecS_SkillCode')} error={errors.ecS_SkillCode?.message} />
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
                        loadingText='Updating...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Update Life Skill
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
