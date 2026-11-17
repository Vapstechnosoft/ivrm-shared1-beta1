'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterSubjectGroup } from '@/hooks/exam/exammodule/usemasters';
import { masterSubjectGroupSchema } from '@/schemas/exam/exam-module/masters';
import { toggleMasterSubjectGroup } from '@/server/exam/exam-module/masters/subject-group';
import type { IMasterSubjectGroup } from '@/types/exam/exam-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterSubjectGroupSchema.delete>;

interface ToggleMasterSubjectGroupFormProps {
    rowData: IMasterSubjectGroup;
    onClose: () => void;
}

export default function ToggleMasterSubjectGroupForm({ rowData, onClose }: ToggleMasterSubjectGroupFormProps) {
    const { refetchAll } = useMasterSubjectGroup();
    const isActive = rowData.emG_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterSubjectGroupSchema.delete),
        defaultValues: {
            emG_Id: rowData.emG_Id
        },
        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<FormFields> = async (formData) => {
        try {
            const response = await toggleMasterSubjectGroup(Number(formData.emG_Id));
            if (response.success) {
                toast.success(response.message || `Subject group ${rowData?.emG_ActiveFlag ? 'deactivated' : 'activated'} successfully`);
                refetchAll();
                reset();
                onClose();
            } else {
                toast.error(response.message || 'Failed to update subject group status');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    const closeDialog = () => {
        reset();
        onClose();
    };

    return (
        <AdaptiveDialog title='Toggle Master Subject Group Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('emG_Id')} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.emG_GroupName}</strong>?
                    </p>
                    {errors.emG_Id && <FormError>{errors.emG_Id.message}</FormError>}
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
