'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { masterEventSchema } from '@/schemas/sports/masters/events';
import { deactivateMasterEvent } from '@/server/sports/masters/events';
import type { IMasterEvent } from '@/types/sports/masters/events';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterEventSchema.delete>;

interface ToggleMasterEventFormProps {
    rowData: IMasterEvent;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ToggleMasterEventForm({ rowData, onClose, onSuccess }: ToggleMasterEventFormProps) {
    // Removed internal useMasterEvents hook to avoid query key mismatch
    const isActive = rowData.spccmE_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterEventSchema.delete),
        defaultValues: {
            spccmE_Id: rowData?.spccmE_Id?.toString() ?? ''
        },
        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<FormFields> = async (formData) => {
        try {
            const payload = {
                spccmE_Id: Number(formData.spccmE_Id),
                spccmE_ActiveFlag: !isActive
            };

            const response = await deactivateMasterEvent(payload);

            if (response?.success || response?.returnval == true || (response?.message && response?.message !== 'activationFailed')) {
                toast.success(response.message || `Event ${isActive ? 'deactivated' : 'activated'} successfully`);
                onSuccess();
                reset();
                onClose();
            } else {
                toast.error(response?.message || 'Failed to update event status');
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
        <AdaptiveDialog title='Toggle Event Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('spccmE_Id')} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.spccmE_EventName}</strong>?
                    </p>
                    {errors.spccmE_Id && <FormError>{errors.spccmE_Id.message}</FormError>}
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
