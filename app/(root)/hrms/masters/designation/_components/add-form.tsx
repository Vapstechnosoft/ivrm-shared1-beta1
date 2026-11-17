'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { InputNumber } from '@/components/ui/extension/input-number';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterDesignation } from '@/hooks/hrms/useMasters';
import { hrmsMasterSchemas } from '@/schemas/hrms/masters';
import { addOrUpdateMasterDesignation } from '@/server/hrms/hrmsConfig/master/designation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof hrmsMasterSchemas.designation.add>;

interface AddDesignationFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddDesignationForm({ onSuccess, className = '' }: AddDesignationFormProps) {
    const { refetchAll } = useMasterDesignation();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsMasterSchemas.designation.add),
        mode: 'onChange',
        defaultValues: {
            hrmdeS_Order: 0
        }
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                hrmdeS_Id: 0,
                hrmdeS_DesignationName: data.hrmdeS_DesignationName?.trim() || '',
                hrmdeS_BasicAmount: data.hrmdeS_BasicAmount || 0,
                hrmdeS_SanctionedSeats: data.hrmdeS_SanctionedSeats || 0,
                hrmdeS_DisplaySanctionedSeatsFlag: data.hrmdeS_DisplaySanctionedSeatsFlag || false,
                hrmdeS_Order: data.hrmdeS_Order || 0,
                hrmdeS_ActiveFlag: true
            };
            const response = await addOrUpdateMasterDesignation(payload);

            if (response?.success) {
                toast.success(response?.message || 'Designation saved successfully');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response?.message || 'Failed to save designation');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to save designation');
        }
    };

    const handleReset = () => {
        reset();
    };

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        <InputText
                            label='Designation Name'
                            required
                            id='hrmdeS_DesignationName'
                            placeholder='Enter designation name'
                            maxLength={50}
                            {...register('hrmdeS_DesignationName')}
                            error={errors.hrmdeS_DesignationName?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />

                        <Controller
                            name='hrmdeS_BasicAmount'
                            control={control}
                            render={({ field }) => (
                                <InputNumber
                                    label='Basic Amount'
                                    id='hrmdeS_BasicAmount'
                                    value={field.value}
                                    maxDigits={10}
                                    onChange={(value) => {
                                        const numValue = value !== null && value !== undefined ? Number(value) : 0;
                                        field.onChange(numValue);
                                    }}
                                    onBlur={field.onBlur}
                                    error={errors.hrmdeS_BasicAmount?.message}
                                    className='transition-colors focus:ring-2 focus:ring-primary/20'
                                />
                            )}
                        />

                        <Controller
                            name='hrmdeS_SanctionedSeats'
                            control={control}
                            render={({ field }) => (
                                <InputNumber
                                    label='Sanctioned Seats'
                                    id='hrmdeS_SanctionedSeats'
                                    value={field.value}
                                    maxDigits={3}
                                    onChange={(value) => {
                                        const numValue = value !== null && value !== undefined ? Number(value) : 0;
                                        field.onChange(numValue);
                                    }}
                                    onBlur={field.onBlur}
                                    error={errors.hrmdeS_SanctionedSeats?.message}
                                    className='transition-colors focus:ring-2 focus:ring-primary/20'
                                />
                            )}
                        />


                        <div className='flex items-center gap-2'>
                            <Controller
                                name='hrmdeS_DisplaySanctionedSeatsFlag'
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        id='hrmdeS_DisplaySanctionedSeatsFlag'
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                            <label htmlFor='hrmdeS_DisplaySanctionedSeatsFlag' className='cursor-pointer font-medium text-sm leading-none'>
                                Display Sanctioned Seats
                            </label>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                        Reset
                    </Button>
                    <Button
                        type='submit'
                        disabled={isSubmitting}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Save Designation
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
