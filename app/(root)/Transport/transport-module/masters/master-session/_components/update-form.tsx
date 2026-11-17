'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useMasterSession } from '@/hooks/transport/transportmodule/usemasters';
import { masterSessionSchema } from '@/schemas/transport/masters';
import { saveMasterSession } from '@/server/transport/transport-module/masters/master-session';
import type { IMasterSession } from '@/types/transport/transport-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterSessionSchema.addOrUpdate>;

interface UpdateSessionFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterSession;
}

export default function UpdateSessionForm({ onSuccess, className = '', selectedRow: row }: UpdateSessionFormProps) {
    const { refetchAll } = useMasterSession();

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterSessionSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            TRMS_Id: 0,
            TRMS_SessionName: '',
            TRMS_SessionDesc: '',
            TRMS_Flag: 'Pick Up'
        }
    });

    // ✅ Prefill data when editing
    useEffect(() => {
        if (row) {
            reset({
                TRMS_Id: row.trmS_Id,
                TRMS_SessionName: row.trmS_SessionName,
                TRMS_SessionDesc: row.trmS_SessionDesc,
                TRMS_Flag: row.trmS_Flag as 'Pick Up' | 'Drop'
            });
        }
    }, [row, reset]);

    // ✅ Submit handler
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const response = await saveMasterSession(data);

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
                TRMS_Id: row.trmS_Id,
                TRMS_SessionName: row.trmS_SessionName,
                TRMS_SessionDesc: row.trmS_SessionDesc,
                TRMS_Flag: row.trmS_Flag as 'Pick Up' | 'Drop'
            });
        }
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <InputText
                        label='Session Name'
                        required
                        id='TRMS_SessionName'
                        {...register('TRMS_SessionName')}
                        error={errors.TRMS_SessionName?.message}
                    />
                    <InputText
                        label='Session Description'
                        required
                        id='TRMS_SessionDesc'
                        {...register('TRMS_SessionDesc')}
                        error={errors.TRMS_SessionDesc?.message}
                    />
                    <div className='group flex flex-col gap-1.5 md:col-span-2'>
                        <Label htmlFor='TRMS_Flag'>
                            Pick Up / Drop <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                            name='TRMS_Flag'
                            control={control}
                            render={({ field }) => (
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className='flex gap-4 pt-2'
                                >
                                    <div className='flex items-center space-x-2'>
                                        <RadioGroupItem value='Pick Up' id='pickup' />
                                        <Label htmlFor='pickup' className='font-normal cursor-pointer text-sm'>
                                            Pick Up
                                        </Label>
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        <RadioGroupItem value='Drop' id='drop' />
                                        <Label htmlFor='drop' className='font-normal cursor-pointer text-sm'>
                                            Drop
                                        </Label>
                                    </div>
                                </RadioGroup>
                            )}
                        />
                        {errors.TRMS_Flag && <FormError>{errors.TRMS_Flag.message}</FormError>}
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
