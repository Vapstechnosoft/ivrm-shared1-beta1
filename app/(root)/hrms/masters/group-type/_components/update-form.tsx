'use client';

import { Button } from '@/components/ui/button';
import { InputNumber } from '@/components/ui/extension/input-number';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterGroupType } from '@/hooks/hrms/useMasters';
import { hrmsMasterSchemas } from '@/schemas/hrms/masters';
import { addOrUpdateMasterGroupType } from '@/server/hrms/hrmsConfig/master/group-type';
import type { IMasterGroupTypeList } from '@/types/hrms/hrms-config/master';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof hrmsMasterSchemas.groupType.update>;

interface UpdateGroupTypeFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterGroupTypeList;
}

export default function UpdateGroupTypeForm({ onSuccess, className = '', selectedRow: row }: UpdateGroupTypeFormProps) {
    const { refetchAll } = useMasterGroupType();

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isDirty }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsMasterSchemas.groupType.update),
        mode: 'onChange'
    });

    useEffect(() => {
        if (row) {
            reset({
                hrmgT_Id: row.hrmgT_Id,
                hrmgT_EmployeeGroupType: row.hrmgT_EmployeeGroupType,
                hrmgT_Code: row.hrmgT_Code,
                hrmgT_Order: row.hrmgT_Order
            });
        }
    }, [row, reset]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                hrmgT_Id: data.hrmgT_Id,
                hrmgT_EmployeeGroupType: data.hrmgT_EmployeeGroupType?.trim() || '',
                hrmgT_Code: data.hrmgT_Code?.trim() || '',
                hrmgT_Order: data.hrmgT_Order || 0,
                hrmgT_ActiveFlag: true
            };
            const response = await addOrUpdateMasterGroupType(payload);

            if (response?.success) {
                toast.success(response?.message || 'Group type updated successfully');
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response?.message || 'Failed to update group type');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to update group type');
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
                        <input type='hidden' {...register('hrmgT_Id', { valueAsNumber: true })} />
                        <InputText
                            label='Employee Group Type'
                            required
                            id='hrmgT_EmployeeGroupType'
                            placeholder='Enter employee group type'
                            maxLength={50}
                            defaultValue={row.hrmgT_EmployeeGroupType}
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
                            defaultValue={row.hrmgT_Code}
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
                        disabled={isSubmitting || !isDirty}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Save Group Type
                        </div>
                    </Button>
                    {!isDirty && <span className='flex items-center text-muted-foreground text-sm'>No changes made</span>}
                </div>
            </form>
        </div>
    );
}
