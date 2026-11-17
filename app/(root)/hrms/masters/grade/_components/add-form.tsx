'use client';

import { Button } from '@/components/ui/button';
import { InputNumber } from '@/components/ui/extension/input-number';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterGrade } from '@/hooks/hrms/useMasters';
import { hrmsMasterSchemas } from '@/schemas/hrms/masters';
import { addOrUpdateMasterGrade } from '@/server/hrms/hrmsConfig/master/grade';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Controller, type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof hrmsMasterSchemas.grade.add>;

interface PayScaleRangeDisplayProps {
    control: any;
}

const PayScaleRangeDisplay = ({ control }: PayScaleRangeDisplayProps) => {
    const from = useWatch({ control, name: 'hrmG_PayScaleFrom' });
    const inc = useWatch({ control, name: 'hrmG_IncrementOf' });
    const to = useWatch({ control, name: 'hrmG_PayScaleTo' });

    // Only show values, if undefined show nothing or placeholder. 
    // If user wants to see nothing when fields are empty:
    return <>{`${from ?? 0} - ${inc ?? 0} - ${to ?? 0}`}</>;
};

interface AddGradeFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddGradeForm({ onSuccess, className = '' }: AddGradeFormProps) {
    const { refetchAll } = useMasterGrade();

    const {
        register,
        handleSubmit,
        control,
        reset,
        trigger,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsMasterSchemas.grade.add),
        mode: 'onChange',
        defaultValues: {
            // @ts-ignore
            hrmG_PayScaleFrom: undefined,
            // @ts-ignore
            hrmG_IncrementOf: undefined,
            // @ts-ignore
            hrmG_PayScaleTo: undefined,
            hrmG_Order: 0
        }
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                hrmG_Id: 0,
                hrmG_GradeName: data.hrmG_GradeName?.trim() || '',
                hrmG_GradeDisplayName: data.hrmG_GradeDisplayName?.trim() || '',
                hrmG_PayScaleFrom: data.hrmG_PayScaleFrom || 0,
                hrmG_IncrementOf: data.hrmG_IncrementOf || 0,
                hrmG_PayScaleTo: data.hrmG_PayScaleTo || 0,
                hrmG_Order: data.hrmG_Order || 0,
                HRMG_PayScaleRange: `${data.hrmG_PayScaleFrom || 0} - ${data.hrmG_IncrementOf || 0} - ${data.hrmG_PayScaleTo || 0}`,
                hrmG_ActiveFlag: true
            };
            const response = await addOrUpdateMasterGrade(payload);

            if (response?.success) {
                toast.success(response?.message || 'Grade saved successfully');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response?.message || 'Failed to save grade');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to save grade');
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
                            label='Grade Name'
                            required
                            id='hrmG_GradeName'
                            placeholder='Enter grade name'
                            maxLength={50}
                            {...register('hrmG_GradeName')}
                            error={errors.hrmG_GradeName?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />

                        <InputText
                            label='Grade Display Name'
                            required
                            id='hrmG_GradeDisplayName'
                            placeholder='Enter grade display name'
                            maxLength={50}
                            {...register('hrmG_GradeDisplayName')}
                            error={errors.hrmG_GradeDisplayName?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />

                        <Controller
                            name='hrmG_PayScaleFrom'
                            control={control}
                            render={({ field }) => (
                                <InputNumber
                                    label='Pay Scale From'
                                    required
                                    id='hrmG_PayScaleFrom'
                                    value={field.value ?? Number.NaN}
                                    maxDigits={6}
                                    onChange={(value) => {
                                        const numValue = Number.isNaN(value) ? undefined : value;
                                        // @ts-ignore
                                        field.onChange(numValue);
                                        trigger(['hrmG_PayScaleFrom', 'hrmG_PayScaleTo']);
                                    }}
                                    onBlur={() => {
                                        field.onBlur();
                                        trigger(['hrmG_PayScaleFrom', 'hrmG_PayScaleTo']);
                                    }}
                                    error={errors.hrmG_PayScaleFrom?.message}
                                    className='transition-colors focus:ring-2 focus:ring-primary/20'
                                />
                            )}
                        />

                        <Controller
                            name='hrmG_IncrementOf'
                            control={control}
                            render={({ field }) => (
                                <InputNumber
                                    label='Increment Of'
                                    required
                                    id='hrmG_IncrementOf'
                                    value={field.value ?? Number.NaN}
                                    maxDigits={6}
                                    onChange={(value) => {
                                        const numValue = Number.isNaN(value) ? undefined : value;
                                        // @ts-ignore
                                        field.onChange(numValue);
                                    }}
                                    onBlur={field.onBlur}
                                    error={errors.hrmG_IncrementOf?.message as string}
                                    className='transition-colors focus:ring-2 focus:ring-primary/20'
                                />
                            )}
                        />

                        <Controller
                            name='hrmG_PayScaleTo'
                            control={control}
                            render={({ field }) => (
                                <InputNumber
                                    label='Pay Scale To'
                                    required
                                    id='hrmG_PayScaleTo'
                                    value={field.value ?? Number.NaN}
                                    maxDigits={6}
                                    onChange={(value) => {
                                        const numValue = Number.isNaN(value) ? undefined : value;
                                        // @ts-ignore
                                        field.onChange(numValue);
                                        trigger(['hrmG_PayScaleFrom', 'hrmG_PayScaleTo']);
                                    }}
                                    onBlur={() => {
                                        field.onBlur();
                                        trigger(['hrmG_PayScaleFrom', 'hrmG_PayScaleTo']);
                                    }}
                                    error={errors.hrmG_PayScaleTo?.message}
                                    className='transition-colors focus:ring-2 focus:ring-primary/20'
                                />
                            )}
                        />

                        <div className='flex flex-col gap-2'>
                            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                            <label className='font-medium text-sm'>Pay Scale Range</label>
                            <div className='flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50'>
                                <PayScaleRangeDisplay control={control} />
                            </div>
                            {errors.hrmG_PayScaleTo && <p className='text-[0.8rem] font-medium text-destructive'>{errors.hrmG_PayScaleTo.message}</p>}
                        </div>

                        {/* Order field removed as per request */}
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
                            Save Grade
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
