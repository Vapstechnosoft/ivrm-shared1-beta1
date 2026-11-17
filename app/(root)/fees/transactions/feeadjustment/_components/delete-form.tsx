'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useFeeAdjustment } from '@/hooks/fees/useTrasactions';
import { feeAdjustmentSchema } from '@/schemas/fees/trasactions';
import { deleteFeeAdjustment } from '@/server/fees/trasactions/fee_adjustment';
import type { IFeeAdjustmentGridList } from '@/types/fees/transactions/transactions';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof feeAdjustmentSchema.delete>;

interface DeleteFeeAdjustmnetFormProps {
    rowData: IFeeAdjustmentGridList;
    onClose: () => void;
}

export default function DeleteFeeAdjustmentForm({ rowData, onClose }: DeleteFeeAdjustmnetFormProps) {
    const { refetchAll } = useFeeAdjustment();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(feeAdjustmentSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await deleteFeeAdjustment(Number(rowData.fsA_Id));
            if (response?.success) {
                toast.success(response.message);
                refetchAll();
                closeDialog();
            } else {
                toast.error(response?.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <AdaptiveDialog title='Delete Fee Adjustment' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('fsA_Id')} defaultValue={rowData.fsA_Id} />
                    <p>Are you sure you want to permanently delete the Selected Data</p>
                    <FormError>{errors.fsA_Id?.message}</FormError>
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
