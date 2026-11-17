'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterGender } from '@/hooks/hrms/useMasters';
import { hrmsMasterSchemas } from '@/schemas/hrms/masters';
import { addOrUpdateMasterGender } from '@/server/hrms/hrmsConfig/master/gender';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof hrmsMasterSchemas.gender.add>;

interface AddGenderFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddGenderForm({ onSuccess, className = '' }: AddGenderFormProps) {
    const { refetchAll } = useMasterGender();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsMasterSchemas.gender.add),
        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                ivrmmG_Id: 0,
                ivrmmG_GenderName: data.ivrmmG_GenderName?.trim() || '',
                ivrmmG_IsActive: true
            };
            const response = await addOrUpdateMasterGender(payload);

            if (response?.success) {
                toast.success(response?.message || 'Gender saved successfully');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response?.message || 'Failed to save gender');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to save gender');
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
                            label='Gender Name'
                            required
                            id='ivrmmG_GenderName'
                            placeholder='Enter gender name'
                            maxLength={50}
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
                        disabled={isSubmitting}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Save Gender
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
