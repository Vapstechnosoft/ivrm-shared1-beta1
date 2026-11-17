'use client';

import { Button } from '@/components/ui/button';
import { DateField } from '@/components/ui/dateField';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterLeaveYear } from '@/hooks/hrms/useMasters';
import { hrmsMasterSchemas } from '@/schemas/hrms/masters';
import { addOrUpdateMasterLeaveYear } from '@/server/hrms/hrmsConfig/master/leave-year';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof hrmsMasterSchemas.leaveYear.add>;

interface AddLeaveYearFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddLeaveYearForm({ onSuccess, className = '' }: AddLeaveYearFormProps) {
    const { refetchAll } = useMasterLeaveYear();

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        trigger,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsMasterSchemas.leaveYear.add),
        mode: 'onChange'
    });

    const fromDate = useWatch({
        control,
        name: 'hrmlY_FromDate'
    });

    const toDate = useWatch({
        control,
        name: 'hrmlY_ToDate'
    });

    useEffect(() => {
        if (fromDate) {
            trigger('hrmlY_ToDate');
        }
    }, [fromDate, trigger]);

    useEffect(() => {
        if (toDate) {
            trigger('hrmlY_FromDate');
        }
    }, [toDate, trigger]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                hrmlY_Id: 0,
                hrmlY_LeaveYear: data.hrmlY_LeaveYear?.trim() || '',
                hrmlY_FromDate: data.hrmlY_FromDate,
                hrmlY_ToDate: data.hrmlY_ToDate,
                hrmlY_ActiveFlag: true
            };
            const response = await addOrUpdateMasterLeaveYear(payload);

            if (response?.success) {
                toast.success(response?.message || 'Leave Year saved successfully');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response?.message || 'Failed to save leave year');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to save leave year');
        }
    };

    const handleReset = () => {
        reset();
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <InputText
                        label='Leave Year'
                        required
                        id='hrmlY_LeaveYear'
                        placeholder='2025'
                        maxLength={4}
                        {...register('hrmlY_LeaveYear')}
                        error={errors.hrmlY_LeaveYear?.message}
                        className='transition-colors focus:ring-2 focus:ring-primary/20'
                    />

                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <Controller
                            name='hrmlY_FromDate'
                            control={control}
                            render={({ field, fieldState }) => (
                                <DateField field={field} fieldState={fieldState} label='From Date' placeholder='Pick from date' />
                            )}
                        />

                        <Controller
                            name='hrmlY_ToDate'
                            control={control}
                            render={({ field, fieldState }) => {
                                const fromDateObj = fromDate ? new Date(fromDate) : undefined;
                                return (
                                    <DateField
                                        field={field}
                                        fieldState={fieldState}
                                        label='To Date'
                                        placeholder='Pick to date'
                                        fromDate={fromDateObj}
                                    />
                                );
                            }}
                        />
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
                            Save Leave Year
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
