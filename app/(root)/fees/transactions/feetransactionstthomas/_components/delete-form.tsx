'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { useFeeTransactionListStThomas } from '@/hooks/fees/useTrasactions';
import { deletefeeTransaction } from '@/server/fees/trasactions/fee_student_transaction';
import type { Ifeetransaction } from '@/types/fees/transactions/transactions';
import { useState } from 'react';
import { toast } from 'sonner';

interface DeleteFeeTransactionProps {
    rowData: Ifeetransaction;
    onClose: () => void;
    onSuccess?: () => void;
    asmayId: number;
}

export default function DeleteFeeTransactionFormStThomas({ rowData, onClose, onSuccess, asmayId }: DeleteFeeTransactionProps) {
    const { refetchAll } = useFeeTransactionListStThomas(Number(asmayId));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [remark, setRemark] = useState('');

    const closeDialog = () => {
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        if (remark === '') {
            toast.error('Please Enter a Remark!!');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                fyP_Id: rowData.fyP_Id,
                fyP_Remarks: remark,
                asmaY_Id: rowData.asmaY_ID
            };
            const response = await deletefeeTransaction(payload);

            if (response.returnval === 'true') {
                toast.success(response.message || ' Transaction Deleted successfully');
                await refetchAll();
                onSuccess?.();
                closeDialog();
            } else {
                const errorMessage = response?.returnval;
                if (typeof errorMessage === 'string' && errorMessage.trim() !== '') {
                    toast.error(errorMessage);
                } else {
                    toast.error('failed');
                }
            }
        } catch (error: any) {
            console.error('Delete error:', error);
            toast.error(error.message || 'Error deleting record');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdaptiveDialog title={'Delete Fee Transaction'} isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit} className='space-y-6'>
                <AdaptiveBody className='flex flex-col gap-5 '>
                    <Label>
                        Are you sure you want to delete the Receipt <strong>{rowData.fyP_Receipt_No}</strong> of{' '}
                        <strong>{rowData.amsT_FirstName}</strong> <strong>{rowData.amsT_MiddleName}</strong>{' '}
                        <strong>{rowData.amsT_LastName}</strong>?
                    </Label>
                    <InputText
                        id='remark'
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        placeholder='Enter Remark'
                        className='flex transition-colors focus:ring-2 focus:ring-primary/20'
                    />
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
