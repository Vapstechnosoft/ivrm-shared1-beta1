'use client';

import { Button } from '@/components/ui/button';
import { InputNumber } from '@/components/ui/extension/input-number';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterLoan } from '@/hooks/hrms/useMasters';
import { hrmsMasterSchemas } from '@/schemas/hrms/masters';
import { addOrUpdateMasterLoan } from '@/server/hrms/hrmsConfig/master/loan';
import type { IMasterLoanList } from '@/types/hrms/hrms-config/master';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof hrmsMasterSchemas.loan.update>;

interface UpdateLoanFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterLoanList;
}

export default function UpdateLoanForm({ onSuccess, className = '', selectedRow: row }: UpdateLoanFormProps) {
    const { refetchAll } = useMasterLoan();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting, isDirty }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsMasterSchemas.loan.update),
        mode: 'onChange'
    });

    useEffect(() => {
        if (row) {
            reset({
                hrmlN_Id: row.hrmlN_Id,
                hrmL_LoanType: row.hrmL_LoanType,
                hrmL_Max: row.hrmL_Max
            });
        }
    }, [row, reset]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                hrmlN_Id: data.hrmlN_Id,
                hrmL_LoanType: data.hrmL_LoanType?.trim() || '',
                hrmL_Max: Number(data.hrmL_Max) || 0,
                hrmlN_ActiveFlag: true
            };
            const response = await addOrUpdateMasterLoan(payload);

            if (response?.success) {
                toast.success(response?.message || 'Loan type updated successfully');
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response?.message || 'Failed to update loan type');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to update loan type');
        }
    };

    const handleReset = () => {
        reset();
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Loan Type'
                            required
                            id='hrmL_LoanType'
                            placeholder='Enter loan type'
                            maxLength={50}
                            {...register('hrmL_LoanType')}
                            error={errors.hrmL_LoanType?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />

                        <Controller
                            name='hrmL_Max'
                            control={control}
                            render={({ field }) => (
                                <InputNumber
                                    label='Maximum Amount'
                                    required
                                    id='hrmL_Max'
                                    placeholder='Enter maximum amount'
                                    value={field.value ?? undefined}
                                    maxDigits={10}
                                    onChange={(value) => {
                                        const numValue = value !== null && value !== undefined && !Number.isNaN(value) ? Number(value) : undefined;
                                        field.onChange(numValue);
                                    }}
                                    onBlur={field.onBlur}
                                    error={errors.hrmL_Max?.message}
                                    className='transition-colors focus:ring-2 focus:ring-primary/20'
                                />
                            )}
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
                        disabled={isSubmitting || !isDirty}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Save Loan Type
                        </div>
                    </Button>
                    {!isDirty && <span className='flex items-center text-muted-foreground text-sm'>No changes made</span>}
                </div>
            </form>
        </div>
    );
}
