'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterLifeSkills } from '@/hooks/exam/exammodule/usemasters';
import { masterLifeSkillSchema } from '@/schemas/exam/exam-module/masters';
import { toggleMasterLifeSkill } from '@/server/exam/exam-module/masters/life-skills';
import type { ILifeSkill } from '@/types/exam/exam-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterLifeSkillSchema.delete>;

interface ToggleLifeSkillFormProps {
    rowData: ILifeSkill;
    onClose: () => void;
}

export default function ToggleLifeSkillForm({ rowData, onClose }: ToggleLifeSkillFormProps) {
    const { refetchAll } = useMasterLifeSkills();
    const isActive = rowData.ecS_ActiveFlag; // ✅ Active flag for Life Skill

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterLifeSkillSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await toggleMasterLifeSkill(Number(rowData.ecS_Id));

            if (response.success) {
                toast.success(response.message || `Life Skill ${isActive ? 'deactivated' : 'activated'} successfully`);
                refetchAll();
                closeDialog();
            } else {
                toast.error(response.message || 'Action failed');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    return (
        <AdaptiveDialog title='Toggle Life Skill Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('ecS_Id')} defaultValue={rowData.ecS_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.ecS_SkillName}</strong>?
                    </p>
                    <FormError>{errors.ecS_Id?.message}</FormError>
                    <FormError>{errors.root?.message}</FormError>
                </AdaptiveBody>

                <AdaptiveFooter>
                    <Button variant='secondary' onClick={closeDialog} type='button'>
                        Cancel
                    </Button>
                    <Button type='submit' isLoading={isSubmitting} variant={isActive ? 'destructive' : 'default'}>
                        {isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
