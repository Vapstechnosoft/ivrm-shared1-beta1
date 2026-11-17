'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { masterHouseDesignationSchema } from '@/schemas/sports/masters/house-designation';
import { deactivateMasterHouseDesignation } from '@/server/sports/masters/house-designation';
import type { IMasterHouseDesignation } from '@/types/sports/masters/house-designation';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Define a schema for deletion/toggling if not already defined, or reuse addOrUpdate partial
const toggleSchema = z.object({
    spccmhD_Id: z.any() // Accept string or number
});

type FormFields = z.infer<typeof toggleSchema>;

interface ToggleMasterHouseDesignationFormProps {
    rowData: IMasterHouseDesignation;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ToggleMasterHouseDesignationForm({ rowData, onClose, onSuccess }: ToggleMasterHouseDesignationFormProps) {
    const isActive = rowData.spccmhD_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(toggleSchema),
        defaultValues: {
            spccmhD_Id: rowData?.spccmhD_Id
        },
        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<FormFields> = async (formData) => {
        try {
            const payload = {
                spccmhD_Id: Number(formData.spccmhD_Id),
                spccmhD_ActiveFlag: !isActive
            };

            const response = await deactivateMasterHouseDesignation(payload);

            if (response?.success || response?.returnVal == true || (response?.message && response?.message !== 'activationFailed')) {
                toast.success(response.message || `Record ${isActive ? 'Deactivated' : 'Activated'} Successfully`);
                onSuccess();
                reset();
                onClose();
            } else {
                toast.error(response?.message || 'Failed to update status');
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
        <AdaptiveDialog title='Toggle Designation Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('spccmhD_Id')} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.spccmhD_DesignationName}</strong>?
                    </p>
                    {errors.spccmhD_Id && <FormError>{errors.spccmhD_Id.message as string}</FormError>}
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
