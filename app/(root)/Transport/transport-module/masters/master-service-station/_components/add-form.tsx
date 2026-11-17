'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Textarea } from '@/components/ui/textarea';
import { useMasterServiceStation } from '@/hooks/transport/transportmodule/usemasters';
import { masterServiceStationSchema } from '@/schemas/transport/masters';
import { saveMasterServiceStation } from '@/server/transport/transport-module/masters/service-station';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterServiceStationSchema.addOrUpdate>;

interface AddServiceStationFormProps {
    onSuccess?: () => void;
    onClose?: () => void;
    className?: string; // Consistent with other forms
}

export default function AddServiceStationForm({ onSuccess, onClose, className = '' }: AddServiceStationFormProps) {
    const { refetchAll } = useMasterServiceStation();

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterServiceStationSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            TRMSST_ServiceStationName: '',
            TRMSST_ContactNo: '',
            TRMSST_EmailId: '',
            TRMSST_Address: ''
        }
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                ...data,
                TRMSST_Id: 0
            };

            const response = await saveMasterServiceStation(payload);

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
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Service Station'
                            required
                            id='TRMSST_ServiceStationName'
                            {...register('TRMSST_ServiceStationName')}
                            error={errors.TRMSST_ServiceStationName?.message}
                        />
                        <InputText
                            label='Mobile No'
                            required
                            maxLength={10}
                            id='TRMSST_ContactNo'
                            {...register('TRMSST_ContactNo')}
                            error={errors.TRMSST_ContactNo?.message}
                        />
                    </div>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Email Id'
                            required
                            id='TRMSST_EmailId'
                            {...register('TRMSST_EmailId')}
                            error={errors.TRMSST_EmailId?.message}
                        />
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='TRMSST_Address'>
                                Address <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='TRMSST_Address'
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        placeholder='Enter Address'
                                        maxLength={250}
                                        className={errors.TRMSST_Address ? 'border-destructive' : ''}
                                    />
                                )}
                            />
                            {errors.TRMSST_Address && <FormError>{errors.TRMSST_Address.message}</FormError>}
                        </div>
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
