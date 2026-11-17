'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useFeeconfiguration } from '@/hooks/fees/useConfiguration';
import { feeConfigSchema } from '@/schemas/fees/configuration';
import { toggleMasterfeeconfig } from '@/server/fees/configuration/feeconfiguration';
import type { IFeeConfig } from '@/types/fees/configuration/feesconfiguration';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof feeConfigSchema.delete>;

interface ToggleMasterFeesConfigFormProps {
    rowData: IFeeConfig;
    onClose: () => void;
}

export default function ToggleMasterFeesConfigForm({ rowData, onClose }: ToggleMasterFeesConfigFormProps) {
    const { refetchAll } = useFeeconfiguration();
    const isActive = rowData.fmC_Id;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(feeConfigSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await toggleMasterfeeconfig(Number(rowData.fmC_Id));

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
        <AdaptiveDialog title='Toggle Master Fee Config Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('fmC_Id')} defaultValue={rowData.fmC_Id} />
                    {/* <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.FMC_RUserNameFlag}</strong>?
                    </p> */}
                    <FormError>{errors.fmC_Id?.message}</FormError>
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
