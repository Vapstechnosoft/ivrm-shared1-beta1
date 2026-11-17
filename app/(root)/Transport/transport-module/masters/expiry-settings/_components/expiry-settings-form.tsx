'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { useExpirySettings } from '@/hooks/transport/transportmodule/usemasters';
import { saveExpirySettings } from '@/server/transport/transport-module/masters/expiry-settings';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
    TRC_TaxExpDays: z.coerce.number().min(0, 'Must be a positive number'),
    TRC_FitnessExpDays: z.coerce.number().min(0, 'Must be a positive number'),
    TRC_PermitDays: z.coerce.number().min(0, 'Must be a positive number'),
    TRC_InsuranceDays: z.coerce.number().min(0, 'Must be a positive number'),
    TRC_EmmisionExpDays: z.coerce.number().min(0, 'Must be a positive number'),
    TRC_SpeedControlDays: z.coerce.number().min(0, 'Must be a positive number'),
    TRC_CeaseFireDays: z.coerce.number().min(0, 'Must be a positive number'),
    TRC_GreenTaxDays: z.coerce.number().min(0, 'Must be a positive number'),
    TRC_DLExpReminderDays: z.coerce.number().min(0, 'Must be a positive number'),
});

type FormFields = z.infer<typeof formSchema>;

export default function ExpirySettingsForm() {
    const { data, refetchAll } = useExpirySettings();
    const settings = data?.data?.[0];

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            TRC_TaxExpDays: 0,
            TRC_FitnessExpDays: 0,
            TRC_PermitDays: 0,
            TRC_InsuranceDays: 0,
            TRC_EmmisionExpDays: 0,
            TRC_SpeedControlDays: 0,
            TRC_CeaseFireDays: 0,
            TRC_GreenTaxDays: 0,
            TRC_DLExpReminderDays: 0,
        }
    });

    useEffect(() => {
        if (settings) {
            reset({
                TRC_TaxExpDays: settings.trC_TaxExpDays,
                TRC_FitnessExpDays: settings.trC_FitnessExpDays,
                TRC_PermitDays: settings.trC_PermitDays,
                TRC_InsuranceDays: settings.trC_InsuranceDays,
                TRC_EmmisionExpDays: settings.trC_EmmisionExpDays,
                TRC_SpeedControlDays: settings.trC_SpeedControlDays,
                TRC_CeaseFireDays: settings.trC_CeaseFireDays,
                TRC_GreenTaxDays: settings.trC_GreenTaxDays,
                TRC_DLExpReminderDays: settings.trC_DLExpReminderDays,
            });
        }
    }, [settings, reset]);

    const onSubmit: SubmitHandler<FormFields> = async (values) => {
        try {
            const payload = {
                trC_Id: settings?.trC_Id || 0,
                trC_TaxExpDays: values.TRC_TaxExpDays,
                trC_FitnessExpDays: values.TRC_FitnessExpDays,
                trC_PermitDays: values.TRC_PermitDays,
                trC_InsuranceDays: values.TRC_InsuranceDays,
                trC_EmmisionExpDays: values.TRC_EmmisionExpDays,
                trC_SpeedControlDays: values.TRC_SpeedControlDays,
                trC_CeaseFireDays: values.TRC_CeaseFireDays,
                trC_GreenTaxDays: values.TRC_GreenTaxDays,
                trC_DLExpReminderDays: values.TRC_DLExpReminderDays,
            };

            const response = await saveExpirySettings(payload);

            if (response.success) {
                toast.success(response.message);
                refetchAll();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    const handleCancel = () => {
        window.location.reload();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                <InputText
                    label='Vehicle Tax Expiry Duration'
                    type='number'
                    min={0}
                    {...register('TRC_TaxExpDays')}
                    error={errors.TRC_TaxExpDays?.message}
                />
                <InputText
                    label='Vehicle Fitness Expiry Duration'
                    type='number'
                    min={0}
                    {...register('TRC_FitnessExpDays')}
                    error={errors.TRC_FitnessExpDays?.message}
                />
                <InputText
                    label='Vehicle Permit Expiry Duration'
                    type='number'
                    min={0}
                    {...register('TRC_PermitDays')}
                    error={errors.TRC_PermitDays?.message}
                />
                <InputText
                    label='Vehicle Insurance Expiry Duration'
                    type='number'
                    min={0}
                    {...register('TRC_InsuranceDays')}
                    error={errors.TRC_InsuranceDays?.message}
                />
                <InputText
                    label='Vehicle Emission Test Expiry Duration'
                    type='number'
                    min={0}
                    {...register('TRC_EmmisionExpDays')}
                    error={errors.TRC_EmmisionExpDays?.message}
                />
                <InputText
                    label='Vehicle Speed Control Expiry Duration'
                    type='number'
                    min={0}
                    {...register('TRC_SpeedControlDays')}
                    error={errors.TRC_SpeedControlDays?.message}
                />
                <InputText
                    label='Vehicle Cease Fire Expiry Duration'
                    type='number'
                    min={0}
                    {...register('TRC_CeaseFireDays')}
                    error={errors.TRC_CeaseFireDays?.message}
                />
                <InputText
                    label='Vehicle Green Tax Expiry Duration'
                    type='number'
                    min={0}
                    {...register('TRC_GreenTaxDays')}
                    error={errors.TRC_GreenTaxDays?.message}
                />
                <InputText
                    label='Driver DL Expiry Duration'
                    type='number'
                    min={0}
                    {...register('TRC_DLExpReminderDays')}
                    error={errors.TRC_DLExpReminderDays?.message}
                />
            </div>

            <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                <Button
                    type='button'
                    variant='destructive'
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className='order-3 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                    Cancel
                </Button>
                <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                    isLoading={isSubmitting}
                    loadingText='Saving...'>
                    <div className='flex items-center'>
                        <Save className='mr-2 h-4 w-4' />
                        Save
                    </div>
                </Button>
            </div>
        </form>
    );
}
