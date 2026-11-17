'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { useInvTGRN } from '@/hooks/inventory/transactions/use-inv-t-grn';
import type { IInvTGRN } from '@/types/inventory/transactions/inv-t-grn';
import { useForm } from 'react-hook-form';

interface ToggleGRNModalProps {
    rowData: IInvTGRN;
    onClose: () => void;
}

export function ToggleGRNModal({ rowData, onClose }: ToggleGRNModalProps) {
    const { toggleActiveMutation } = useInvTGRN();
    const isActive = rowData.invmgrN_ActiveFlg;

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
        <AdaptiveDialog title='Toggle GRN Status' isOpen={true} onClose={onClose} size="md">
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <div className='space-y-3'>
                        <p className='text-sm text-warning-foreground'>
                            Are you sure you want to {isActive ? 'deactivate' : 'activate'} GRN <strong>{rowData.invmgrN_GRNNo}</strong>?
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
