'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { masterDivisionSchema } from '@/schemas/sports/masters/division';
import { deactivateMasterDivision } from '@/server/sports/masters/division';
import type { IMasterDivision } from '@/types/sports/masters/division';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterDivisionSchema.delete>;

interface ToggleMasterDivisionFormProps {
    rowData: IMasterDivision;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ToggleMasterDivisionForm({ rowData, onClose, onSuccess }: ToggleMasterDivisionFormProps) {
    // Removed internal hook
    const isActive = rowData.spccmD_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterDivisionSchema.delete),
        defaultValues: {
            spccmD_Id: rowData?.spccmD_Id?.toString() ?? ''
        },
        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<FormFields> = async (formData) => {
        try {
            const payload = {
                spccmD_Id: Number(formData.spccmD_Id),
                spccmD_ActiveFlag: !isActive // Inverted logic as per requirement
            };

            const response = await deactivateMasterDivision(payload);

            if (response?.success || response?.returnval == true || (response?.message && response?.message !== 'activationFailed')) {
                toast.success(response.message || `Division ${isActive ? 'deactivated' : 'activated'} successfully`);
                onSuccess();
                reset();
                onClose();
            } else {
                toast.error(response?.message || 'Failed to update division status');
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
        <AdaptiveDialog title='Toggle Division Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('spccmD_Id')} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.spccmD_DivisionName}</strong>?
                    </p>
                    {errors.spccmD_Id && <FormError>{errors.spccmD_Id.message}</FormError>}
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
