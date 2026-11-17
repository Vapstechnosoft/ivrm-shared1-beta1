'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterFuelType } from '@/hooks/transport/transportmodule/usemasters';
import { masterFuelTypeSchema } from '@/schemas/transport/masters';
import { saveMasterFuelType } from '@/server/transport/transport-module/masters/fuel-type';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterFuelTypeSchema.addOrUpdate>;

interface AddMasterFuelTypeFormProps {
    onSuccess?: () => void;
    onClose?: () => void;
    className?: string;
}

export default function AddMasterFuelTypeForm({ onSuccess, onClose, className = '' }: AddMasterFuelTypeFormProps) {
    const { refetchAll } = useMasterFuelType();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterFuelTypeSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            trmfT_FuelType: ''
        }
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                ...data,
                trmfT_Id: 0
            };

            const response = await saveMasterFuelType(payload);

            if (response.success) {
                toast.success(response.message);
                reset();
                refetchAll();
                onSuccess?.();
                onClose?.();
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
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Fuel Type'
                            required
                            id='trmfT_FuelType'
                            {...register('trmfT_FuelType')}
                            error={errors.trmfT_FuelType?.message}
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
