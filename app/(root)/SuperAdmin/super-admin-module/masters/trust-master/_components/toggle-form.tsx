'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { trustMasterSchema } from '@/schemas/super-admin/super-admin-module/trust-masters';
import { activateDeactivateTrustMaster } from '@/server/super-admin/super-admin-module/masters/trust-master';
import type { ITrustMaster } from '@/types/super-admin/super-admin-module/trust-masters';

import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof trustMasterSchema.delete>;

interface ToggleTrustMasterFormProps {
    rowData: ITrustMaster;
    onClose: () => void;
    onRefresh?: () => void;
}

export default function ToggleTrustMasterForm({ rowData, onClose, onRefresh }: ToggleTrustMasterFormProps) {
    const isActive = rowData.mO_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(trustMasterSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const response = await activateDeactivateTrustMaster(data.mO_Id);

            if (response.success) {
                toast.success(response.message || `Trust ${isActive ? 'deactivated' : 'activated'} successfully`);
                onRefresh?.();
                closeDialog();
            } else {
                toast.error(response.message || 'Failed to update status');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    return (
        <AdaptiveDialog title='Toggle Trust Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('mO_Id')} defaultValue={rowData.mO_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.mO_Name}</strong>?
                    </p>
                    <FormError>{errors.mO_Id?.message}</FormError>
                    <FormError>{errors.root?.message}</FormError>
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
