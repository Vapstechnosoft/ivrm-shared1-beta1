'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterModeOfPayment } from '@/hooks/fees/useMasters';

import { masterModeOfPaymentSchema } from '@/schemas/fees/masters';
import { toggleModeOfPayment } from '@/server/fees/masters/modeOfPayment';
import type { IModeOfPaymentList } from '@/types/fees/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterModeOfPaymentSchema.delete>;

interface ToggleMasterMOdeOfPaymentFormProps {
    rowData: IModeOfPaymentList;
    onClose: () => void;
}

export default function ToggleMasterModeOfPaymentForm({ rowData, onClose }: ToggleMasterMOdeOfPaymentFormProps) {
    const { refetchAll } = useMasterModeOfPayment();
    const isActive = rowData.ivrmmoD_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterModeOfPaymentSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await toggleModeOfPayment(Number(rowData.ivrmmoD_Id));

            if (response.success) {
                toast.success(response.message);
                refetchAll();
                closeDialog();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <AdaptiveDialog title='Toggle Master Fee Head Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('ivrmmoD_Id')} defaultValue={rowData.ivrmmoD_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.ivrmmoD_ModeOfPayment}</strong>?
                    </p>
                    <FormError>{errors.ivrmmoD_Id?.message}</FormError>
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
