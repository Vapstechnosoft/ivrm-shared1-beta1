'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterFeeYearlyRebateSettingFacade } from '@/hooks/fees/useMasters';
import { YearlyRebateSettingsSchema } from '@/schemas/fees/masters';
import { toggleYearlyRebateSetting } from '@/server/fees/masters/feeyearlyrebatesettingfacade';
import type { IMasterFeeYearlyRebateSettingFacade } from '@/types/fees/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import type { z } from 'zod';

type FormFields = z.infer<typeof YearlyRebateSettingsSchema.delete>;

interface ToggleRebateSettingFormProps {
    rowData: IMasterFeeYearlyRebateSettingFacade;
    onClose: () => void;
}

export default function ToggleRebateSettingColumnForm({ rowData, onClose }: ToggleRebateSettingFormProps) {
    const { refetchAll } = useMasterFeeYearlyRebateSettingFacade();

    const isActive = Boolean(rowData.fyrebseT_ActiveId);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(YearlyRebateSettingsSchema.delete),
        mode: 'onChange',
        defaultValues: {
            // pick a numeric id from known possible fields
            fyG_Id: String((rowData as any).fyG_Id ?? (rowData as any).fyG_Id ?? rowData.asmaY_Id ?? 0)
        }
    });

    const closeDialog = () => {
        reset();
        onClose();
    };

    const onSubmit: SubmitHandler<FormFields> = async (formData) => {
        const fyG_Id = Number(formData.fyG_Id || rowData.asmaY_Id || 0);

        if (!fyG_Id) return;

        try {
            const response = await toggleYearlyRebateSetting(rowData.fyrebseT_Id);

            if (response.success) {
                refetchAll();
                closeDialog();
            }
        } catch (error) {
            console.error('ToggleRebateSettingColumnForm error:', error);
            closeDialog();
        }
    };

    return (
        <AdaptiveDialog title='Toggle Rebate Setting Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('fyG_Id')} defaultValue={String(rowData.asmaY_Id ?? 0)} />

                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'}{' '}
                        <strong>{rowData.asmaY_Year ?? 'Rebate Setting'}</strong>?
                    </p>

                    {errors.fyG_Id && <FormError>{errors.fyG_Id.message}</FormError>}
                    {errors.root && <FormError>{errors.root.message}</FormError>}
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
