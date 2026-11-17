'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { Label } from '@/components/ui/extension/field';
import { useMasterYearlyCategory } from '@/hooks/fees/useMasters';
import { MasterfeeMasterGroupwiseAutoReceipt } from '@/server/fees/masters/fee_master_groupwise_auto_receipt';
import type { IMasterGroupWiseAutoReciptList } from '@/types/fees/masters/masters';
import { useState } from 'react';
import { toast } from 'sonner';

interface DeleteMasterAutoReceiptFormProps {
    rowData: IMasterGroupWiseAutoReciptList;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function deleteMasterAutoReceiptForm({ rowData, onClose, onSuccess }: DeleteMasterAutoReceiptFormProps) {
    const { refetch } = useMasterYearlyCategory();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const closeDialog = () => {
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            // Send fgaR_Id and asmaY_Id to delete
            const response = await MasterfeeMasterGroupwiseAutoReceipt(Number(rowData.fgaR_Id), Number(rowData.asmaY_Id));

            if (response.success) {
                toast.success(response.message);
                await refetch();
                onSuccess?.();
                closeDialog();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            console.error('Delete error:', error);
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdaptiveDialog title={'Delete Auto Receipt'} isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit} className='space-y-6'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <Label>
                        Are you sure you want to delete{' '}
                        <strong>
                            {rowData.fgaR_Name || 'this receipt'} ({rowData.academicyear})
                        </strong>
                        ?
                    </Label>
                    <div className='text-muted-foreground text-sm'>This action cannot be undone.</div>
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
