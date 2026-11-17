'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterMaritalStatus } from '@/hooks/hrms/useMasters';
import { hrmsMasterSchemas } from '@/schemas/hrms/masters';
import { addOrUpdateMasterMaritalStatus } from '@/server/hrms/hrmsConfig/master/marital-status';
import type { IMasterMaritalStatusList } from '@/types/hrms/hrms-config/master';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof hrmsMasterSchemas.maritalStatus.update>;

interface UpdateMaritalStatusFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterMaritalStatusList;
}

export default function UpdateMaritalStatusForm({ onSuccess, className = '', selectedRow: row }: UpdateMaritalStatusFormProps) {
    const { refetchAll } = useMasterMaritalStatus();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isDirty }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsMasterSchemas.maritalStatus.update),
        mode: 'onChange'
    });

    useEffect(() => {
        if (row) {
            reset({
                ivrmmmS_Id: row.ivrmmmS_Id,
                ivrmmmS_MaritalStatus: row.ivrmmmS_MaritalStatus
            });
        }
    }, [row, reset]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                ivrmmmS_Id: data.ivrmmmS_Id,
                ivrmmmS_MaritalStatus: data.ivrmmmS_MaritalStatus?.trim() || '',
                ivrmmmS_ActiveFlag: true
            };
            const response = await addOrUpdateMasterMaritalStatus(payload);

            if (response?.success) {
                toast.success(response?.message || 'Marital status updated successfully');
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response?.message || 'Failed to update marital status');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to update marital status');
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
                        <input type='hidden' {...register('ivrmmmS_Id', { valueAsNumber: true })} />
                        <InputText
                            label='Marital Status'
                            required
                            id='ivrmmmS_MaritalStatus'
                            placeholder='Enter marital status'
                            maxLength={50}
                            defaultValue={row.ivrmmmS_MaritalStatus}
                            {...register('ivrmmmS_MaritalStatus')}
                            error={errors.ivrmmmS_MaritalStatus?.message}
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
                            Save Marital Status
                        </div>
                    </Button>
                    {!isDirty && <span className='flex items-center text-muted-foreground text-sm'>No changes made</span>}
                </div>
            </form>
        </div>
    );
}
