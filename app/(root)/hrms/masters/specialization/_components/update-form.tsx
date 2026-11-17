'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterSpecialization } from '@/hooks/hrms/useMasters';
import { hrmsMasterSchemas } from '@/schemas/hrms/masters';
import { addOrUpdateMasterSpecialization } from '@/server/hrms/hrmsConfig/master/specialization';
import type { IMasterSpecializationList } from '@/types/hrms/hrms-config/master';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof hrmsMasterSchemas.specialization.update>;

interface UpdateSpecializationFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterSpecializationList;
}

export default function UpdateSpecializationForm({ onSuccess, className = '', selectedRow: row }: UpdateSpecializationFormProps) {
    const { refetchAll } = useMasterSpecialization();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isDirty }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsMasterSchemas.specialization.update),
        mode: 'onChange'
    });

    useEffect(() => {
        if (row) {
            reset({
                hrmspL_Id: row.hrmspL_Id,
                hrmspL_SpecialisationName: row.hrmspL_SpecialisationName
            });
        }
    }, [row, reset]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                hrmspL_Id: data.hrmspL_Id,
                hrmspL_SpecialisationName: data.hrmspL_SpecialisationName?.trim() || '',
                hrmspL_ActiveFlg: true
            };
            const response = await addOrUpdateMasterSpecialization(payload);

            if (response?.success) {
                toast.success(response?.message || 'Specialization updated successfully');
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response?.message || 'Failed to update specialization');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to update specialization');
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
                            label='Specialization Name'
                            required
                            id='hrmspL_SpecialisationName'
                            placeholder='Enter specialization name'
                            maxLength={50}
                            {...register('hrmspL_SpecialisationName')}
                            error={errors.hrmspL_SpecialisationName?.message}
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
                            Save Specialization
                        </div>
                    </Button>
                    {!isDirty && <span className='flex items-center text-muted-foreground text-sm'>No changes made</span>}
                </div>
            </form>
        </div>
    );
}
