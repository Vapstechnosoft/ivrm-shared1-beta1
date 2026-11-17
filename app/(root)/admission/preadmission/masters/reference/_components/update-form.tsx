'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { useMasterReference } from '@/hooks/admission/preadmission/useMasters';
import { masterReferenceSchema } from '@/schemas/admission/preadmission/masters';
import { addOrUpdateMasterReference } from '@/server/admission/preadmission/masters/reference';
import type { IMasterReferenceList } from '@/types/admission/preadmission/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterReferenceSchema.addOrUpdate>;

interface UpdateMasterClassFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterReferenceList;
}

export default function UpdateMasterReferenceForm({ onSuccess, className = '', selectedRow: row }: UpdateMasterClassFormProps) {
    const { refetchAll } = useMasterReference();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterReferenceSchema.addOrUpdate),
        mode: 'onChange'
    });

    useEffect(() => {
        if (row) {
            reset({
                pamR_ReferenceName: row.pamR_ReferenceName || '',
                pamR_ReferenceDesc: row.pamR_ReferenceDesc || ''
            });
        }
    }, [row, reset]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                pamR_Id: row.pamR_Id,
                pamR_ReferenceDesc: data.pamR_ReferenceDesc,
                pamR_ReferenceName: data.pamR_ReferenceName
            };

            const response = await addOrUpdateMasterReference(payload);

            if (response?.success) {
                toast.success('Reference updated successfully!');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
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
                            label='Reference Name'
                            required
                            id='pamR_ReferenceName'
                            {...register('pamR_ReferenceName')}
                            error={errors.pamR_ReferenceName?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />

                        <InputTextarea
                            label='Description'
                            required
                            id='pamR_ReferenceDesc'
                            placeholder='Enter description'
                            {...register('pamR_ReferenceDesc')}
                            error={errors.pamR_ReferenceDesc?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                            minHeight={20}
                        />
                    </div>
                </div>

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
                            Save Reference
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
