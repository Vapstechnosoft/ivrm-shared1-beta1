'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { useMasterSource } from '@/hooks/admission/preadmission/useMasters';
import { masterSourceSchema } from '@/schemas/admission/preadmission/masters';
import { addOrUpdateMasterSource } from '@/server/admission/preadmission/masters/source';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterSourceSchema.addOrUpdate>;

interface AddMasterSourceFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddMasterSourceForm({ onSuccess, className = '' }: AddMasterSourceFormProps) {
    const { refetchAll } = useMasterSource();

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterSourceSchema.addOrUpdate),

        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                pamS_SourceName: data?.pamS_SourceName,
                pamS_SourceDesc: data?.pamS_SourceDesc
            };

            const response = await addOrUpdateMasterSource(payload);

            if (response.success) {
                toast.success(response.message);
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
                            label='Source Name'
                            required
                            id='pamS_SourceName'
                            {...register('pamS_SourceName')}
                            error={errors.pamS_SourceName?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />

                        <InputTextarea
                            label='Description'
                            required
                            id='pamS_SourceDesc'
                            placeholder='Enter description'
                            {...register('pamS_SourceDesc')}
                            error={errors.pamS_SourceDesc?.message}
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
                            Save Source
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
