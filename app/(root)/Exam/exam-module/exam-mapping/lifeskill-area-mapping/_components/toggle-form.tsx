'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterLifeSkillAreaMapping } from '@/hooks/exam/exammodule/usemasters';
import { lifeSkillAreaMappingSchema } from '@/schemas/exam/exam-module/exam-mapping';
import { toggleLifeSkillAreaMapping } from '@/server/exam/exam-module/masters/life-skills';
import type { ILifeSkillAreaMapping } from '@/types/exam/exam-module/exam-mapping';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

// 🔹 Infer form type from Zod schema
type FormFields = z.infer<typeof lifeSkillAreaMappingSchema.delete>;

interface ToggleLifeSkillAreaMappingFormProps {
    rowData: ILifeSkillAreaMapping;
    onClose: () => void;
}

/**
 * 🔹 Toggle Life Skill Area Mapping (Activate / Deactivate)
 * - Uses Zod schema validation
 * - Handles backend toggle request
 * - Displays AdaptiveDialog UI
 */
export default function ToggleLifeSkillAreaMappingForm({ rowData, onClose }: ToggleLifeSkillAreaMappingFormProps) {
    const { refetchAll } = useMasterLifeSkillAreaMapping();
    const isActive = rowData.ecsaM_ActiveFlag;

    // 🔹 React Hook Form setup with Zod validation
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(lifeSkillAreaMappingSchema.delete),
        defaultValues: { ecsaM_Id: rowData.ecsaM_Id ?? 0 } // ✅ ensure number type default
    });

    // 🔹 Close handler
    function closeDialog() {
        onClose();
        reset();
    }

    // 🔹 Submit handler
    const onSubmit = async (data: FormFields) => {
        try {
            const response = await toggleLifeSkillAreaMapping(data.ecsaM_Id); // orgId: 30

            if (response?.success) {
                toast.success(response.message ?? 'Status updated successfully');
                refetchAll();
                closeDialog();
            } else {
                toast.error(response.message ?? 'Failed to update status');
            }
        } catch (error: any) {
            console.error(' Toggle Error:', error);
            toast.error(error?.message ?? 'Unexpected error while toggling');
        }
    };

    // 🔹 Render
    return (
        <AdaptiveDialog title='Toggle Life Skill Area Mapping Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    {/* Hidden input (bound to RHF state) */}
                    <input type='hidden' {...register('ecsaM_Id', { valueAsNumber: true })} />

                    <p>
                        Are you sure you want to <strong>{isActive ? 'deactivate' : 'activate'}</strong> the mapping for{' '}
                        <strong>
                            {rowData.ecS_SkillName} - {rowData.ecsA_SkillArea}
                        </strong>
                        ?
                    </p>

                    {/* 🔹 Validation Errors */}
                    {errors.ecsaM_Id && <FormError>{errors.ecsaM_Id.message}</FormError>}
                    {errors.root && <FormError>{errors.root.message}</FormError>}
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
