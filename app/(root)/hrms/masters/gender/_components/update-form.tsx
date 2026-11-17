'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterGender } from '@/hooks/hrms/useMasters';
import { hrmsMasterSchemas } from '@/schemas/hrms/masters';
import { addOrUpdateMasterGender } from '@/server/hrms/hrmsConfig/master/gender';
import type { IMasterGenderList } from '@/types/hrms/hrms-config/master';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof hrmsMasterSchemas.gender.update>;

interface UpdateGenderFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterGenderList;
}

export default function UpdateGenderForm({ onSuccess, className = '', selectedRow: row }: UpdateGenderFormProps) {
    const { refetchAll } = useMasterGender();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isDirty }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsMasterSchemas.gender.update),
        mode: 'onChange'
    });

    useEffect(() => {
        if (row) {
            reset({
                ivrmmG_Id: row.ivrmmG_Id,
                ivrmmG_GenderName: row.ivrmmG_GenderName
            });
        }
    }, [row, reset]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                ivrmmG_Id: data.ivrmmG_Id,
                ivrmmG_GenderName: data.ivrmmG_GenderName?.trim() || '',
                ivrmmG_IsActive: true
            };
            const response = await addOrUpdateMasterGender(payload);

            if (response?.success) {
                toast.success(response?.message || 'Gender updated successfully');
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response?.message || 'Failed to update gender');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to update gender');
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
                        <input type='hidden' {...register('ivrmmG_Id', { valueAsNumber: true })} />
                        <InputText
                            label='Gender Name'
                            required
                            id='ivrmmG_GenderName'
                            placeholder='Enter gender name'
                            maxLength={50}
                            defaultValue={row.ivrmmG_GenderName}
                            {...register('ivrmmG_GenderName')}
                            error={errors.ivrmmG_GenderName?.message}
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
                            Save Gender
                        </div>
                    </Button>
                    {!isDirty && <span className='flex items-center text-muted-foreground text-sm'>No changes made</span>}
                </div>
            </form>
        </div>
    );
}
