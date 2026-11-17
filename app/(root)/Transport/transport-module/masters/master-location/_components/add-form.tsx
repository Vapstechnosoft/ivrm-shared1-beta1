'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterLocation } from '@/hooks/transport/transportmodule/usemasters';
import { masterLocationSchema } from '@/schemas/transport/masters';
import { saveMasterLocation } from '@/server/transport/transport-module/masters/location';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterLocationSchema.addOrUpdate>;

interface AddMasterLocationFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddMasterLocationForm({ onSuccess, className = '' }: AddMasterLocationFormProps) {
    const { refetchAll } = useMasterLocation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterLocationSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            trmL_LocationName: '',
            trmL_Latitude: '',
            trmL_Longitude: ''
        }
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const response = await saveMasterLocation(data);

            if (response.success) {
                toast.success(response.message);
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleReset = () => reset();

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Location Name'
                            required
                            id='trmL_LocationName'
                            {...register('trmL_LocationName')}
                            error={errors.trmL_LocationName?.message}
                        />
                        <InputText
                            label='Latitude'
                            required
                            id='trmL_Latitude'
                            {...register('trmL_Latitude')}
                            error={errors.trmL_Latitude?.message}
                        />
                        <InputText
                            label='Longitude'
                            required
                            id='trmL_Longitude'
                            {...register('trmL_Longitude')}
                            error={errors.trmL_Longitude?.message}
                        />
                    </div>
                </div>

                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className='order-3 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
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
                            Save
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
