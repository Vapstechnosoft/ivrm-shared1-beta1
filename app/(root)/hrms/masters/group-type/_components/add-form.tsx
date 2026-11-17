'use client';

import { Button } from '@/components/ui/button';
import { InputNumber } from '@/components/ui/extension/input-number';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterGroupType } from '@/hooks/hrms/useMasters';
import { hrmsMasterSchemas } from '@/schemas/hrms/masters';
import { addOrUpdateMasterGroupType } from '@/server/hrms/hrmsConfig/master/group-type';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof hrmsMasterSchemas.groupType.add>;

interface AddGroupTypeFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddGroupTypeForm({ onSuccess, className = '' }: AddGroupTypeFormProps) {
    const { refetchAll } = useMasterGroupType();

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsMasterSchemas.groupType.add),
        mode: 'onChange',
        defaultValues: {
            hrmgT_Order: 0
        }
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                hrmgT_Id: 0,
                hrmgT_EmployeeGroupType: data.hrmgT_EmployeeGroupType?.trim() || '',
                hrmgT_Code: data.hrmgT_Code?.trim() || '',
                hrmgT_Order: data.hrmgT_Order || 0,
                hrmgT_ActiveFlag: true
            };
            const response = await addOrUpdateMasterGroupType(payload);

            if (response?.success) {
                toast.success(response?.message || 'Group type saved successfully');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response?.message || 'Failed to save group type');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to save group type');
        }
    };

    const handleReset = () => {
        reset();
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        <InputText
                            label='Employee Group Type'
                            required
                            id='hrmgT_EmployeeGroupType'
                            placeholder='Enter employee group type'
                            maxLength={50}
                            {...register('hrmgT_EmployeeGroupType')}
                            error={errors.hrmgT_EmployeeGroupType?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />

                        <InputText
                            label='Code'
                            required
                            id='hrmgT_Code'
                            placeholder='Enter code'
                            maxLength={20}
                            {...register('hrmgT_Code')}
                            error={errors.hrmgT_Code?.message}
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
                            Save Group Type
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
