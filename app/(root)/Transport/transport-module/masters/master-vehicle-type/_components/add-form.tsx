'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterVehicleType } from '@/hooks/transport/transportmodule/usemasters';
import { masterVehicleTypeSchema } from '@/schemas/transport/masters';
import { saveMasterVehicleType } from '@/server/transport/transport-module/masters/vehicle-type';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterVehicleTypeSchema.addOrUpdate>;

interface AddVehicleTypeFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddVehicleTypeForm({ onSuccess, className = '' }: AddVehicleTypeFormProps) {
    const { refetchAll } = useMasterVehicleType();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterVehicleTypeSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            TRMVT_VehicleType: '',
            TRMVT_VehicleDesc: ''
        }
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const response = await saveMasterVehicleType(data);

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

    const handleReset = () => reset();

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <InputText
                        label='Vehicle Type'
                        required
                        id='TRMVT_VehicleType'
                        {...register('TRMVT_VehicleType')}
                        error={errors.TRMVT_VehicleType?.message}
                    />
                    <InputText
                        label='Vehicle Description'
                        required
                        id='TRMVT_VehicleDesc'
                        {...register('TRMVT_VehicleDesc')}
                        error={errors.TRMVT_VehicleDesc?.message}
                    />
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
