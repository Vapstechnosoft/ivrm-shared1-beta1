'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterLifeSkillArea } from '@/hooks/exam/exammodule/usemasters';
import { lifeSkillAreaSchema } from '@/schemas/exam/exam-module/masters';
import { toggleMasterLifeSkillArea } from '@/server/exam/exam-module/masters/life-skills';
import type { ILifeSkillArea } from '@/types/exam/exam-module/masters';

import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof lifeSkillAreaSchema.delete>;

interface ToggleLifeSkillAreaFormProps {
    rowData: ILifeSkillArea;
    onClose: () => void;
}

export default function ToggleLifeSkillAreaForm({ rowData, onClose }: ToggleLifeSkillAreaFormProps) {
    const { refetchAll } = useMasterLifeSkillArea();
    const isActive = rowData.ecsA_ActiveFlag; //  toggle flag for Life Skill Area

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(lifeSkillAreaSchema.delete),
        mode: 'onChange'
    });

    const closeDialog = () => {
        onClose();
        reset();
    };

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await toggleMasterLifeSkillArea(Number(rowData.ecsA_Id));

            if (response.success) {
                toast.success(response.message || 'Life Skill Area status updated successfully');
                refetchAll();
                closeDialog();
            } else {
                toast.error(response.message || 'Failed to update status');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    return (
        <AdaptiveDialog title='Toggle Life Skill Area Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('ecsA_Id')} defaultValue={rowData.ecsA_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.ecsA_SkillArea}</strong>?
                    </p>
                    <FormError>{errors.ecsA_Id?.message}</FormError>
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
