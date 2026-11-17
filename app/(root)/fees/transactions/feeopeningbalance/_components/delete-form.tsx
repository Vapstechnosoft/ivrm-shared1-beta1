'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { deleteOpeningBalance } from '@/server/fees/trasactions/fee_opening_balance';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type DeleteFormFields = {
    fmoB_Id?: number;
    fmC_Id?: number;
};

interface DeleteOpeningBalanceFormProps {
    rowData: any;
    onClose: () => void;
    onSuccess: () => void;
    activeTab: 'Fee' | 'PDA';
}

export default function DeleteOpeningBalanceForm({ rowData, onClose, onSuccess, activeTab }: DeleteOpeningBalanceFormProps) {
    const {
        handleSubmit,
        formState: { isSubmitting },
        reset
    } = useForm<DeleteFormFields>({
        resolver: zodResolver(
            z.object({
                fmoB_Id: z.number().optional(),
                fmC_Id: z.number().optional()
            })
        )
    });

    const closeDialog = () => {
        reset();
        onClose();
    };

    const onSubmit = async () => {
        try {
            const id = rowData.fmoB_Id || rowData.fmC_Id;
            const isPDA = !!rowData.fmoB_Id; // fmoB_Id = PDA, fmC_Id = Fee

            // const response = await deleteOpeningBalance(isPDA ? 'PDA' : 'Fee', id);

            const response = await deleteOpeningBalance(activeTab, id);

            if (response.success) {
                toast.success(response.message || 'Opening balance deleted successfully');
                onSuccess();
                closeDialog();
            } else {
                toast.error(response.message || 'Failed to delete');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    const studentName = [rowData.amsT_FirstName, rowData.amsT_MiddleName, rowData.amsT_LastName].filter(Boolean).join(' ');

    return (
        <AdaptiveDialog title='Delete Opening Balance' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <p>
                        Are you sure you want to delete the opening balance for <strong>{studentName || 'this student'}</strong>?
                    </p>
                    <p className='text-muted-foreground text-sm'>
                        This action <strong>cannot be undone</strong>.
                    </p>
                </AdaptiveBody>

                <AdaptiveFooter>
                    <Button variant='secondary' onClick={closeDialog} type='button' disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type='submit' variant='destructive' isLoading={isSubmitting}>
                        Delete Permanently
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
