'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterEmployeeType } from '@/hooks/hrms/useMasters';
import { hrmsMasterSchemas } from '@/schemas/hrms/masters';
import { addOrUpdateMasterEmployeeType } from '@/server/hrms/hrmsConfig/master/employee-type';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof hrmsMasterSchemas.employeeType.add>;

interface AddEmployeeTypeFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddEmployeeTypeForm({ onSuccess, className = '' }: AddEmployeeTypeFormProps) {
    const { refetchAll } = useMasterEmployeeType();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsMasterSchemas.employeeType.add),
        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                hrmeT_Id: 0,
                hrmeT_EmployeeType: data.hrmeT_EmployeeType?.trim() || '',
                hrmeT_ActiveFlag: true
            };
            const response = await addOrUpdateMasterEmployeeType(payload);

            if (response?.success) {
                toast.success(response?.message || 'Employee type saved successfully');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response?.message || 'Failed to save employee type');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to save employee type');
        }
    };

    const handleReset = () => {
        reset();
    };

    return (
        <div className={`${className}`}>
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
                        disabled={isSubmitting}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Save Employee Type
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
