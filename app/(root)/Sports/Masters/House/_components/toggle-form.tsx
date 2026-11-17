'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { masterHouseSchema } from '@/schemas/sports/masters/house';
import { deactivateMasterHouse } from '@/server/sports/masters/house';
import type { IMasterHouse } from '@/types/sports/masters/house';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterHouseSchema.delete>;

interface ToggleMasterHouseFormProps {
    rowData: IMasterHouse;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ToggleMasterHouseForm({ rowData, onClose, onSuccess }: ToggleMasterHouseFormProps) {
    const isActive = rowData.spccmH_ActiveFlag ?? (rowData as any).SPCCMH_ActiveFlag ?? (rowData as any).spccmh_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterHouseSchema.delete),
        defaultValues: {
            spccmH_Id: (rowData?.spccmH_Id ?? (rowData as any)?.SPCCMH_Id ?? (rowData as any)?.spccmh_Id)?.toString() ?? ''
        },
        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<FormFields> = async (formData) => {
        try {
            const payload = {
                spccmH_Id: Number(formData.spccmH_Id),
                spccmH_ActiveFlag: !isActive
            };

            const response = await deactivateMasterHouse(payload);

            if (response?.success || response?.returnVal == true || response?.message?.includes('Successfully')) {
                toast.success((response.msg as string) || (response.message as string) || `House ${isActive ? 'deactivated' : 'activated'} successfully`);
                onSuccess();
                reset();
                onClose();
            } else {
                toast.error((response?.msg as string) || (response?.message as string) || 'Failed to update House status');
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
        <AdaptiveDialog title='Toggle House Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('spccmH_Id')} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.spccmH_HouseName ?? (rowData as any).SPCCMH_HouseName ?? (rowData as any).spccmh_HouseName}</strong>?
                    </p>
                    {errors.spccmH_Id && <FormError>{errors.spccmH_Id.message}</FormError>}
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
