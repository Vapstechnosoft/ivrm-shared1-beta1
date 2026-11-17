'use client';

import { Button } from '@/components/ui/button';
import { InputNumber } from '@/components/ui/extension/input-number';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterDepartment } from '@/hooks/hrms/useMasters';
import { hrmsMasterSchemas } from '@/schemas/hrms/masters';
import { addOrUpdateMasterDepartment } from '@/server/hrms/hrmsConfig/master/department';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof hrmsMasterSchemas.department.add>;

interface AddDepartmentFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddDepartmentForm({ onSuccess, className = '' }: AddDepartmentFormProps) {
    const { refetchAll } = useMasterDepartment();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsMasterSchemas.department.add),
        mode: 'onChange',
        defaultValues: {
            hrmD_Order: undefined as any
        }
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                hrmD_Id: 0,
                hrmD_DepartmentName: data.hrmD_DepartmentName?.trim() || '',
                hrmD_Order: Number(data.hrmD_Order) || 0,
                hrmD_InternalTrainingMinimumHrs: data.hrmD_InternalTrainingMinimumHrs || 0,
                hrmD_ActiveFlag: true
            };
            const response = await addOrUpdateMasterDepartment(payload);

            if (response?.success) {
                toast.success(response?.message || 'Department saved successfully');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response?.message || 'Failed to save department');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to save department');
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
                            label='Department Name'
                            required
                            id='hrmD_DepartmentName'
                            placeholder='Enter department name'
                            maxLength={50}
                            {...register('hrmD_DepartmentName')}
                            error={errors.hrmD_DepartmentName?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />

                        <Controller
                            name='hrmD_Order'
                            control={control}
                            render={({ field }) => (
                                <InputNumber
                                    label='Order'
                                    id='hrmD_Order'
                                    placeholder='Enter order'
                                    value={field.value ?? undefined}
                                    onChange={(value) => {
                                        const numValue = value !== null && value !== undefined && !Number.isNaN(value) ? Number(value) : undefined;
                                        field.onChange(numValue);
                                    }}
                                    onBlur={field.onBlur}
                                    error={errors.hrmD_Order?.message}
                                    className='transition-colors focus:ring-2 focus:ring-primary/20'
                                />
                            )}
                        />

                        <Controller
                            name='hrmD_InternalTrainingMinimumHrs'
                            control={control}
                            render={({ field }) => (
                                <InputNumber
                                    label='Internal Training Min. Hours'
                                    id='hrmD_InternalTrainingMinimumHrs'
                                    value={field.value}
                                    maxDigits={3}
                                    onChange={(value) => {
                                        const numValue = value !== null && value !== undefined ? Number(value) : 0;
                                        field.onChange(numValue);
                                    }}
                                    onBlur={field.onBlur}
                                    error={errors.hrmD_InternalTrainingMinimumHrs?.message}
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
                        disabled={isSubmitting}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Save Department
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
