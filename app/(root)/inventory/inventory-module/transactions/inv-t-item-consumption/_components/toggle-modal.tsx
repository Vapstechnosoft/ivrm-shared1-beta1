'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { useInvTItemConsumption } from '@/hooks/inventory/transactions/use-inv-t-item-consumption';
import type { InvTItemConsumption } from '@/types/inventory/transactions/inv-t-item-consumption';
import { useForm } from 'react-hook-form';

interface ToggleItemConsumptionModalProps {
    rowData: InvTItemConsumption;
    onClose: () => void;
}

export function ToggleItemConsumptionModal({ rowData, onClose }: ToggleItemConsumptionModalProps) {
    const { deleteMutation } = useInvTItemConsumption();
    const isActive = rowData.invmiC_ActiveFlg;

    const {
        handleSubmit,
        formState: { isSubmitting }
    } = useForm();

    const onSubmit = async () => {
        try {
            await deleteMutation.mutateAsync(rowData);
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AdaptiveDialog title='Toggle Consumption Status' isOpen={true} onClose={onClose} size="md">
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <div className='space-y-3'>
                        <p className='text-sm text-warning-foreground'>
                            Are you sure you want to {isActive ? 'deactivate' : 'activate'} Consumption <strong>{rowData.invmiC_ICNo}</strong>?
                        </p>
                    </div>
                </AdaptiveBody>

                <AdaptiveFooter>
                    <Button variant='secondary' onClick={onClose} type='button' disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        type='submit'
                        isLoading={isSubmitting}
                        variant={isActive ? 'destructive' : 'default'}
                        loadingText={isActive ? 'Deactivating...' : 'Activating...'}>
                        {isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
