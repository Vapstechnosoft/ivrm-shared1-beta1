'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { masterCompetitionLevelSchema } from '@/schemas/sports/masters/competition-level';
import { deactivateMasterCompetitionLevel } from '@/server/sports/masters/competition-level';
import type { IMasterCompetitionLevel } from '@/types/sports/masters/competition-level';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterCompetitionLevelSchema.delete>;

interface ToggleMasterCompetitionLevelFormProps {
    rowData: IMasterCompetitionLevel;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ToggleMasterCompetitionLevelForm({ rowData, onClose, onSuccess }: ToggleMasterCompetitionLevelFormProps) {
    // Removed internal hook
    const isActive = rowData.spccmcL_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterCompetitionLevelSchema.delete),
        defaultValues: {
            spccmcL_Id: rowData?.spccmcL_Id?.toString() ?? ''
        },
        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<FormFields> = async (formData) => {
        try {
            // Ensure payload matches what the server action expects.
            // The server action creates query params from these fields.
            const payload = {
                spccmcL_Id: Number(formData.spccmcL_Id),
                spccmcL_ActiveFlag: !isActive
            };

            const response = await deactivateMasterCompetitionLevel(payload);

            if (response?.success || response?.returnval == true || (response?.message && response?.message !== 'activationFailed')) {
                toast.success(response.message || `Level ${isActive ? 'deactivated' : 'activated'} successfully`);
                onSuccess();
                reset();
                onClose();
            } else {
                toast.error(response?.message || 'Failed to update level status');
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
        <AdaptiveDialog title='Toggle Competition Level Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('spccmcL_Id')} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.spccmcL_CompitionLevel}</strong>?
                    </p>
                    {errors.spccmcL_Id && <FormError>{errors.spccmcL_Id.message}</FormError>}
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
