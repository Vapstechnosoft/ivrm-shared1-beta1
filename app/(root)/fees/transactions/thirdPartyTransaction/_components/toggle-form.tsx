'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useFeeThirdParty } from '@/hooks/fees/useTrasactions';
import { thirdPartyTransactionSchema } from '@/schemas/fees/trasactions';
import { deleteThirdPartyTrasaction } from '@/server/fees/trasactions/thirdPartyTrasaction';
import type { IFeeThirdPartyTransaction } from '@/types/fees/transactions/transactions';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof thirdPartyTransactionSchema.delete>;

interface ToggleThirdPartyFormProps {
    rowData: IFeeThirdPartyTransaction;
    onClose: () => void;
}

export default function ToggleThirdPartyForm({ rowData, onClose }: ToggleThirdPartyFormProps) {
    const { refetchAll } = useFeeThirdParty();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(thirdPartyTransactionSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await deleteThirdPartyTrasaction(Number(rowData.fyP_Id));
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
        <AdaptiveDialog title='Delete Fee Group Grouping' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('fyptP_Id')} defaultValue={rowData.fyptP_Id} />
                    <p>Are you sure you want to permanently delete the selected data</p>
                    <FormError>{errors.fyptP_Id?.message}</FormError>
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
