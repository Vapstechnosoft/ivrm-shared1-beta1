'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterFeeInstallment } from '@/hooks/fees/useMasters';
import { masterInstallmentSchema } from '@/schemas/fees/masters';
import { toggleMasterfeeInstallment } from '@/server/fees/masters/feeinstallment';
import type { IMasterFeesInstallmentList } from '@/types/fees/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterInstallmentSchema.delete>;

interface ToggleMasterInstallmentFormProps {
    rowData: IMasterFeesInstallmentList;
    onClose: () => void;
}

export default function ToggleMasterInstallmentForm({ rowData, onClose }: ToggleMasterInstallmentFormProps) {
    const { refetchAll } = useMasterFeeInstallment();

    const isActive = rowData.fmI_ActiceFlag === true;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterInstallmentSchema.delete),
        mode: 'onChange'
    });

    const closeDialog = () => {
        onClose();
        reset();
    };

    const onSubmit: SubmitHandler<FormFields> = async (_formData) => {
        try {
            const response = await toggleMasterfeeInstallment(rowData.fmI_Id);

            if (response.success) {
                toast.success(response.message || 'Status updated successfully!');
                await refetchAll();
                closeDialog();
            } else {
                toast.error(response.message || 'Failed to update status.');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    return (
        <AdaptiveDialog title='Toggle Master Installment Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('fmI_Id', { valueAsNumber: true })} defaultValue={rowData.fmI_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.fmI_Name}</strong>?
                    </p>

                    <FormError>{errors.fmI_Id?.message}</FormError>
                    <FormError>{errors.root?.message}</FormError>
                </AdaptiveBody>

                <AdaptiveFooter>
                    <Button variant='secondary' onClick={closeDialog} type='button'>
                        Cancel
                    </Button>
                    <Button type='submit' isLoading={isSubmitting} variant={isActive ? 'destructive' : 'default'}>
                        {isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
