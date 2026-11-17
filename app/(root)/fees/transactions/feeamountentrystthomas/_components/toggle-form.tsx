'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useFeeAmountEntryforStThomas } from '@/hooks/fees/useTrasactions';
import { amountEntrySchemastThomas } from '@/schemas/fees/trasactions';
import { deleteAmountEntrystthomas } from '@/server/fees/trasactions/feeAmountEntryStThomas';
import type { IFeeAmountEntryList } from '@/types/fees/transactions/transactions';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof amountEntrySchemastThomas.delete>;

interface ToggleMasterAmountEntryFormProps {
    rowData: IFeeAmountEntryList;
    onClose: () => void;
    asmay_Id: number;
}

export default function ToggleMasterAmountEntryFormStThomas({ rowData, onClose, asmay_Id }: ToggleMasterAmountEntryFormProps) {
    const { refetchAll } = useFeeAmountEntryforStThomas();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(amountEntrySchemastThomas.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await deleteAmountEntrystthomas(Number(asmay_Id ?? 0), Number(rowData.fmA_Id));
            if (response?.success) {
                toast.success(response.message || 'Deleted successfully');
                refetchAll();
                closeDialog();
            } else {
                toast.error(response?.message || 'Failed to delete');
            }
        } catch (error: any) {
            toast.error(error.message ?? 'Failed to delete');
        }
    };

    return (
        <AdaptiveDialog title='Delete Fee Amount Entry' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('fmA_Id')} defaultValue={rowData.fmA_Id} />
                    <p>
                        Are you sure you want to <strong>permanently delete</strong> the group-
                        <strong>
                            {rowData.fmG_GroupName},Head-{rowData.fmH_FeeName},Installment-{rowData.ftI_Name},Amount- {rowData.fmA_Amount}{' '}
                            Data
                        </strong>
                        ?
                    </p>
                    <FormError>{errors.fmA_Id?.message}</FormError>
                    <FormError>{errors.root?.message}</FormError>
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='secondary' onClick={closeDialog} type='button'>
                        Cancel
                    </Button>
                    <Button type='submit' isLoading={isSubmitting} variant='destructive'>
                        <Trash2 className='mr-2 h-4 w-4' />
                        Delete
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
