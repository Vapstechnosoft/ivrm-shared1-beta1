'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { masterUOMSchema } from '@/schemas/sports/masters/uom';
import { deactivateMasterUOM } from '@/server/sports/masters/uom';
import type { IMasterUOM } from '@/types/sports/masters/uom';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterUOMSchema.delete>;

interface ToggleMasterUOMFormProps {
    rowData: IMasterUOM;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ToggleMasterUOMForm({ rowData, onClose, onSuccess }: ToggleMasterUOMFormProps) {
    const isActive = rowData.spccmuoM_ActiveFlag ?? (rowData as any).SPCCMUOM_ActiveFlag ?? (rowData as any).spccmuom_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterUOMSchema.delete),
        defaultValues: {
            spccmuoM_Id: (rowData?.spccmuoM_Id ?? (rowData as any)?.SPCCMUOM_Id ?? (rowData as any)?.spccmuom_Id)?.toString() ?? ''
        },
        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<FormFields> = async (formData) => {
        try {
            const payload = {
                spccmuoM_Id: Number(formData.spccmuoM_Id),
                spccmuoM_ActiveFlag: !isActive
            };

            const response = await deactivateMasterUOM(payload);

            if (response?.success) {
                toast.success((response.msg as string) || `UOM ${isActive ? 'deactivated' : 'activated'} successfully`);
                onSuccess();
                reset();
                onClose();
            } else {
                toast.error((response?.msg as string) || 'Failed to update UOM status');
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
        <AdaptiveDialog title='Toggle UOM Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('spccmuoM_Id')} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.spccmuoM_UOMName ?? (rowData as any).SPCCMUOM_UOMName ?? (rowData as any).spccmuom_UOMName}</strong>?
                    </p>
                    {errors.spccmuoM_Id && <FormError>{errors.spccmuoM_Id.message}</FormError>}
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
