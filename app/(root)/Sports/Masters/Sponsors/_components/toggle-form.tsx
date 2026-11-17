'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { masterSponsorSchema } from '@/schemas/sports/masters/sponsors';
import { deactivateMasterSponsor } from '@/server/sports/masters/sponsors';
import type { IMasterSponsor } from '@/types/sports/masters/sponsors';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterSponsorSchema.delete>;

interface ToggleMasterSponsorFormProps {
    rowData: IMasterSponsor;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ToggleMasterSponsorForm({ rowData, onClose, onSuccess }: ToggleMasterSponsorFormProps) {
    // Removed internal hook
    const isActive = rowData.spccmsP_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterSponsorSchema.delete),
        defaultValues: {
            spccmsP_Id: rowData?.spccmsP_Id?.toString() ?? ''
        },
        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<FormFields> = async (formData) => {
        try {
            const payload = {
                spccmsP_Id: Number(formData.spccmsP_Id),
                spccmsP_ActiveFlag: !isActive // Inverted Logic
            };

            const response = await deactivateMasterSponsor(payload);

            if (response?.success || response?.returnval == true || (response?.message && response?.message !== 'activationFailed')) {
                toast.success(response.message || `Sponsor ${isActive ? 'deactivated' : 'activated'} successfully`);
                onSuccess();
                reset();
                onClose();
            } else {
                toast.error(response?.message || 'Failed to update sponsor status');
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
        <AdaptiveDialog title='Toggle Sponsor Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('spccmsP_Id')} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.spccmsP_SponsorName}</strong>?
                    </p>
                    {errors.spccmsP_Id && <FormError>{errors.spccmsP_Id.message}</FormError>}
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
