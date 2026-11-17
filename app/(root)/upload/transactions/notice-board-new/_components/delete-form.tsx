'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { Label } from '@/components/ui/extension/field';
import { useFeeTransactionWaivedOffGrid } from '@/hooks/fees/useTrasactions';
import { deleteWaivedoff } from '@/server/fees/trasactions/waived_off';
import type { feeTransactionWaivedOffGrid } from '@/types/fees/transactions/transactions';
import { useState } from 'react';
import { toast } from 'sonner';

interface DeleteFeeTransactionWaivedOffProps {
    rowData: feeTransactionWaivedOffGrid;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function DeleteFeeTransactionWaivedOffForm({ rowData, onClose, onSuccess }: DeleteFeeTransactionWaivedOffProps) {
    const { refetchAll } = useFeeTransactionWaivedOffGrid();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const closeDialog = () => {
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await deleteWaivedoff(rowData.fswO_Id);

            if (response.success) {
                toast.success(response.message);
                await refetchAll();
                onSuccess?.();
                closeDialog();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            console.error('Delete error:', error);
            toast.error(error.message || 'Error deleting record');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdaptiveDialog title={'Delete Fee Transaction WaivedOff'} isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit} className='space-y-6'>
                <AdaptiveBody className='flex flex-col gap-5 '>
                    <Label>
                        Are you sure you want to delete <strong>{rowData.fmH_FeeName}</strong>?
                    </Label>
                </AdaptiveBody>

                <AdaptiveFooter className='flex flex-col gap-3 sm:flex-row sm:justify-end'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={closeDialog}
                        disabled={isSubmitting}
                        className='w-fit transition-all duration-200 hover:scale-105'>
                        Cancel
                    </Button>
                    <Button
                        type='submit'
                        disabled={isSubmitting}
                        variant='destructive'
                        className='w-fit transition-all duration-200 hover:scale-105'>
                        {isSubmitting ? 'Deleting...' : 'Delete'}
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
