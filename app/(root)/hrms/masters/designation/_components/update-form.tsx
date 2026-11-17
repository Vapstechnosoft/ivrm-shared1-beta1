'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { InputNumber } from '@/components/ui/extension/input-number';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterDesignation } from '@/hooks/hrms/useMasters';
import { hrmsMasterSchemas } from '@/schemas/hrms/masters';
import { addOrUpdateMasterDesignation } from '@/server/hrms/hrmsConfig/master/designation';
import type { IMasterDesignationList } from '@/types/hrms/hrms-config/master';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof hrmsMasterSchemas.designation.update>;

interface UpdateDesignationFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterDesignationList;
}

export default function UpdateDesignationForm({ onSuccess, className = '', selectedRow: row }: UpdateDesignationFormProps) {
    const { refetchAll } = useMasterDesignation();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting, isDirty }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsMasterSchemas.designation.update),
        mode: 'onChange'
    });

    useEffect(() => {
        if (row) {
            reset({
                hrmdeS_Id: row.hrmdeS_Id,
                hrmdeS_DesignationName: row.hrmdeS_DesignationName,
                hrmdeS_BasicAmount: row.hrmdeS_BasicAmount,
                hrmdeS_SanctionedSeats: row.hrmdeS_SanctionedSeats,
                hrmdeS_DisplaySanctionedSeatsFlag: row.hrmdeS_DisplaySanctionedSeatsFlag,
                hrmdeS_Order: row.hrmdeS_Order
            });
        }
    }, [row, reset]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                hrmdeS_Id: data.hrmdeS_Id,
                hrmdeS_DesignationName: data.hrmdeS_DesignationName?.trim() || '',
                hrmdeS_BasicAmount: data.hrmdeS_BasicAmount || 0,
                hrmdeS_SanctionedSeats: data.hrmdeS_SanctionedSeats || 0,
                hrmdeS_DisplaySanctionedSeatsFlag: data.hrmdeS_DisplaySanctionedSeatsFlag || false,
                hrmdeS_Order: data.hrmdeS_Order || 0,
                hrmdeS_ActiveFlag: true
            };
            const response = await addOrUpdateMasterDesignation(payload);

            if (response?.success) {
                toast.success(response?.message || 'Designation updated successfully');
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response?.message || 'Failed to update designation');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to update designation');
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
                        <input type='hidden' {...register('hrmdeS_Id', { valueAsNumber: true })} />
                        <InputText
                            label='Designation Name'
                            required
                            id='hrmdeS_DesignationName'
                            placeholder='Enter designation name'
                            maxLength={50}
                            defaultValue={row.hrmdeS_DesignationName}
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
                        disabled={isSubmitting || !isDirty}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Save Designation
                        </div>
                    </Button>
                    {!isDirty && <span className='flex items-center text-muted-foreground text-sm'>No changes made</span>}
                </div>
            </form>
        </div>
    );
}
