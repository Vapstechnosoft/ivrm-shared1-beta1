'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterLocation } from '@/hooks/transport/transportmodule/usemasters';
import { masterLocationSchema } from '@/schemas/transport/masters';
import { saveMasterLocation } from '@/server/transport/transport-module/masters/location';
import type { IMasterLocation } from '@/types/transport/transport-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterLocationSchema.addOrUpdate>;

interface UpdateMasterLocationFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterLocation;
}

export default function UpdateMasterLocationForm({ onSuccess, className = '', selectedRow: row }: UpdateMasterLocationFormProps) {
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
            trmL_Id: 0,
            trmL_LocationName: '',
            trmL_Latitude: '',
            trmL_Longitude: ''
        }
    });

    // ✅ Prefill data when editing
    useEffect(() => {
        if (row) {
            reset({
                trmL_Id: row.trmL_Id,
                trmL_LocationName: row.trmL_LocationName,
                trmL_Latitude: row.trmL_Latitude,
                trmL_Longitude: row.trmL_Longitude
            });
        }
    }, [row, reset]);

    // ✅ Submit handler
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const response = await saveMasterLocation(data);

            if (response.success) {
                toast.success(response.message);
                reset(data); // Keep the form values after successful update
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    // ✅ Reset form to selected row values
    const handleReset = () => {
        if (row) {
            reset({
                trmL_Id: row.trmL_Id,
                trmL_LocationName: row.trmL_LocationName,
                trmL_Latitude: row.trmL_Latitude,
                trmL_Longitude: row.trmL_Longitude
            });
        }
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
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
                        loadingText='Updating...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Update
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
