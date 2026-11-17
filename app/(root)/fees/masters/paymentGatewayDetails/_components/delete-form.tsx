'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterPaymentgatewaydetails } from '@/hooks/fees/useMasters';
import { useFeeAmountEntry } from '@/hooks/fees/useTrasactions';
import { paymentgatewaydetailsSchema } from '@/schemas/fees/masters';
import { amountEntrySchema } from '@/schemas/fees/trasactions';
import { deletepaymentgatewaydetails } from '@/server/fees/masters/fee_payment_gateway_details';
import { deleteAmountEntry, togglepaymentgatewaydetails } from '@/server/fees/trasactions/feeAmountEntry';
import { IMasterPaymentGatewayList } from '@/types/fees/masters/masters';
import type { IFeeAmountEntryList } from '@/types/fees/transactions/transactions';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof paymentgatewaydetailsSchema.delete>;

interface DeletePaymentGatewayFormProps {
    rowData: IMasterPaymentGatewayList;
    onClose: () => void;
}

export default function DeletePaymentGatewayForm({ rowData, onClose }: DeletePaymentGatewayFormProps) {
       const { refetchAll } = useMasterPaymentgatewaydetails();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(paymentgatewaydetailsSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
              const response = await deletepaymentgatewaydetails(Number(rowData.fpgD_Id));
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
        <AdaptiveDialog title='Delete Payment Gateway' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('FPGD_Id')} defaultValue={rowData.fpgD_Id} />
                    <p>
                        Are you sure you want to permanently delete The selected Data
                       
                    </p>
                    <FormError>{errors.FPGD_Id?.message}</FormError>
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
