'use client';

import { Button } from '@/components/ui/button';
import { InputNumber } from '@/components/ui/extension/input-number';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterDepartment } from '@/hooks/hrms/useMasters';
import { hrmsMasterSchemas } from '@/schemas/hrms/masters';
import { addOrUpdateMasterDepartment } from '@/server/hrms/hrmsConfig/master/department';
import type { IMasterDepartmentList } from '@/types/hrms/hrms-config/master';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof hrmsMasterSchemas.department.update>;

interface UpdateDepartmentFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterDepartmentList;
}

export default function UpdateDepartmentForm({ onSuccess, className = '', selectedRow: row }: UpdateDepartmentFormProps) {
    const { refetchAll } = useMasterDepartment();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting, isDirty }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsMasterSchemas.department.update),
        mode: 'onChange'
    });

    useEffect(() => {
        if (row) {
            reset({
                hrmD_Id: row.hrmD_Id,
                hrmD_DepartmentName: row.hrmD_DepartmentName,
                hrmD_Order: row.hrmD_Order,
                hrmD_InternalTrainingMinimumHrs: row.hrmD_InternalTrainingMinimumHrs
            });
        }
    }, [row, reset]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                hrmD_Id: data.hrmD_Id,
                hrmD_DepartmentName: data.hrmD_DepartmentName?.trim() || '',
                hrmD_Order: Number(data.hrmD_Order) || 0,
                hrmD_InternalTrainingMinimumHrs: data.hrmD_InternalTrainingMinimumHrs || 0,
                hrmD_ActiveFlag: true
            };
            const response = await addOrUpdateMasterDepartment(payload);

            if (response?.success) {
                toast.success(response?.message || 'Department updated successfully');
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response?.message || 'Failed to update department');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to update department');
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
                        <input type='hidden' {...register('hrmD_Id', { valueAsNumber: true })} />
                        <InputText
                            label='Department Name'
                            required
                            id='hrmD_DepartmentName'
                            placeholder='Enter department name'
                            maxLength={50}
                            defaultValue={row.hrmD_DepartmentName}
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
                        disabled={isSubmitting || !isDirty}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Save Department
                        </div>
                    </Button>
                    {!isDirty && <span className='flex items-center text-muted-foreground text-sm'>No changes made</span>}
                </div>
            </form>
        </div>
    );
}
