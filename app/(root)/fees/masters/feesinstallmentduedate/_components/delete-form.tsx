'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { Label } from '@/components/ui/extension/field';
import { useMasterFeeInstallmentDueDateList } from '@/hooks/fees/useMasters';
import { deleteInstallmentDueDate } from '@/server/fees/masters/feeinstallmentduedate';
import type { IMasterFeesInstallmentDuedateList } from '@/types/fees/masters';
import { useState } from 'react';
import { toast } from 'sonner';

interface DeleteInstallmentDueDateListProps {
    rowData: IMasterFeesInstallmentDuedateList;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function DeleteInstallmentDueDateListForm({ rowData, onClose, onSuccess }: DeleteInstallmentDueDateListProps) {
    const { refetchAll } = useMasterFeeInstallmentDueDateList();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const closeDialog = () => {
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            console.log('Deleting rowData:', rowData);
            const response = await deleteInstallmentDueDate(rowData.ftidD_Id);

            if (response.success) {
                toast.success(response.message);
                onSuccess?.();
                refetchAll();
                closeDialog();
            } else {
                toast.error(response.message || 'Failed to delete record');
            }
        } catch (error: any) {
            console.error('Delete error:', error);
            toast.error(error.message || 'Error deleting record');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdaptiveDialog title={'Delete Installment Due Date'} isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit} className='space-y-6'>
                <AdaptiveBody className='flex flex-col gap-5 '>
                    <Label>
                        Are you sure you want to delete <strong>{rowData.ftI_Name}</strong>?
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
