'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { masterVenueSchema } from '@/schemas/sports/masters/venue';
import { deactivateMasterVenue } from '@/server/sports/masters/venue';
import type { IMasterEventVenue } from '@/types/sports/masters/venue';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterVenueSchema.delete>;

interface ToggleMasterVenueFormProps {
    rowData: IMasterEventVenue;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ToggleMasterVenueForm({ rowData, onClose, onSuccess }: ToggleMasterVenueFormProps) {
    // Removed internal hook
    const isActive = rowData.spccmeV_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterVenueSchema.delete),
        defaultValues: {
            spccmeV_Id: rowData?.spccmeV_Id?.toString() ?? ''
        },
        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<FormFields> = async (formData) => {
        try {
            const payload = {
                spccmeV_Id: Number(formData.spccmeV_Id),
                spccmeV_ActiveFlag: !isActive // Inverted Logic as per MasterEvents fix
            };

            const response = await deactivateMasterVenue(payload);

            // Loose equality check for legacy backend response compatibility
            if (response?.success || response?.returnval == true || (response?.message && response?.message !== 'activationFailed')) {
                toast.success(response.message || `Venue ${isActive ? 'deactivated' : 'activated'} successfully`);
                onSuccess();
                reset();
                onClose();
            } else {
                toast.error(response?.message || 'Failed to update venue status');
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
        <AdaptiveDialog title='Toggle Venue Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('spccmeV_Id')} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.spccmeV_EventVenue}</strong>?
                    </p>
                    {errors.spccmeV_Id && <FormError>{errors.spccmeV_Id.message}</FormError>}
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
