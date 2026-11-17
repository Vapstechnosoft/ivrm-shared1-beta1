'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { masterProgramSchema } from '@/schemas/sports/masters/program';
import { deactivateMasterProgram } from '@/server/sports/masters/program';
import type { IMasterProgram } from '@/types/sports/masters/program';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterProgramSchema.delete>;

interface ToggleMasterProgramFormProps {
    rowData: IMasterProgram;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ToggleMasterProgramForm({ rowData, onClose, onSuccess }: ToggleMasterProgramFormProps) {
    // Removed internal hook
    const isActive = rowData.spccpM_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterProgramSchema.delete),
        defaultValues: {
            spccpM_Id: rowData?.spccpM_Id?.toString() ?? ''
        },
        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<FormFields> = async (formData) => {
        try {
            const payload = {
                spccpM_Id: Number(formData.spccpM_Id),
                spccpM_ActiveFlag: !isActive
            };

            const response = await deactivateMasterProgram(payload);

            if (response?.success || response?.returnval == true || (response?.message && response?.message !== 'activationFailed')) {
                toast.success(response.message || `Program ${isActive ? 'deactivated' : 'activated'} successfully`);
                onSuccess();
                reset();
                onClose();
            } else {
                toast.error(response?.message || 'Failed to update program status');
            }
        } catch (error: any) {
            console.error('Toggle error:', error);
            toast.error(error.message || 'Something went wrong');
        }
    };

    const closeDialog = () => {
        reset();
        onClose();
    };

    return (
        <AdaptiveDialog title='Toggle Program Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('spccpM_Id')} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.spccpM_Name}</strong>?
                    </p>
                    {errors.spccpM_Id && <FormError>{errors.spccpM_Id.message}</FormError>}
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
