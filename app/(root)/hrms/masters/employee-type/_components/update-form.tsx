'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterEmployeeType } from '@/hooks/hrms/useMasters';
import { hrmsMasterSchemas } from '@/schemas/hrms/masters';
import { addOrUpdateMasterEmployeeType } from '@/server/hrms/hrmsConfig/master/employee-type';
import type { IMasterEmployeeTypeList } from '@/types/hrms/hrms-config/master';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof hrmsMasterSchemas.employeeType.update>;

interface UpdateEmployeeTypeFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterEmployeeTypeList;
}

export default function UpdateEmployeeTypeForm({ onSuccess, className = '', selectedRow: row }: UpdateEmployeeTypeFormProps) {
    const { refetchAll } = useMasterEmployeeType();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isDirty }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsMasterSchemas.employeeType.update),
        mode: 'onChange'
    });

    useEffect(() => {
        if (row) {
            reset({
                hrmeT_Id: row.hrmeT_Id,
                hrmeT_EmployeeType: row.hrmeT_EmployeeType
            });
        }
    }, [row, reset]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                hrmeT_Id: data.hrmeT_Id,
                hrmeT_EmployeeType: data.hrmeT_EmployeeType?.trim() || '',
                hrmeT_ActiveFlag: true
            };
            const response = await addOrUpdateMasterEmployeeType(payload);

            if (response?.success) {
                toast.success(response?.message || 'Employee type updated successfully');
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response?.message || 'Failed to update employee type');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to update employee type');
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
                            label='Employee Type'
                            required
                            id='hrmeT_EmployeeType'
                            placeholder='Enter employee type'
                            maxLength={50}
                            {...register('hrmeT_EmployeeType')}
                            error={errors.hrmeT_EmployeeType?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
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
                            Save Employee Type
                        </div>
                    </Button>
                    {!isDirty && <span className='flex items-center text-muted-foreground text-sm'>No changes made</span>}
                </div>
            </form>
        </div>
    );
}
