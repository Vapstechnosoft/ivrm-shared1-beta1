'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { useInvTSales } from '@/hooks/inventory/transactions/use-inv-t-sales';
import type { IInvTSales } from '@/types/inventory/transactions/inv-t-sales';
import { useForm } from 'react-hook-form';

interface ToggleSalesModalProps {
    rowData: IInvTSales;
    onClose: () => void;
}

export function ToggleSalesModal({ rowData, onClose }: ToggleSalesModalProps) {
    const { toggleActiveMutation } = useInvTSales();
    const isActive = rowData.invmsL_ActiveFlg;

    const {
        handleSubmit,
        formState: { isSubmitting }
    } = useForm();

    const onSubmit = async () => {
        try {
            await toggleActiveMutation.mutateAsync(rowData);
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AdaptiveDialog title='Toggle Sales Status' isOpen={true} onClose={onClose} size="md">
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <div className='space-y-3'>
                        <p className='text-sm text-warning-foreground'>
                            Are you sure you want to {isActive ? 'deactivate' : 'activate'} Sale <strong>{rowData.invmsL_SalesNo}</strong>?
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
