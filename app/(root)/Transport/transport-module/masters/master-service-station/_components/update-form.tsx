'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Textarea } from '@/components/ui/textarea';
import { useMasterServiceStation } from '@/hooks/transport/transportmodule/usemasters';
import { masterServiceStationSchema } from '@/schemas/transport/masters';
import { saveMasterServiceStation } from '@/server/transport/transport-module/masters/service-station';
import type { IMasterServiceStation } from '@/types/transport/transport-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterServiceStationSchema.addOrUpdate>;

interface UpdateServiceStationFormProps {
    rowData: IMasterServiceStation;
    onSuccess: () => void;
    className?: string;
}

export default function UpdateServiceStationForm({
    rowData,
    onSuccess,
    className = ''
}: UpdateServiceStationFormProps) {
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
            TRMSST_Id: rowData.trmssT_Id,
            TRMSST_ServiceStationName: rowData.trmssT_ServiceStationName,
            TRMSST_ContactNo: rowData.trmssT_ContactNo,
            TRMSST_EmailId: rowData.trmssT_EmailId,
            TRMSST_Address: rowData.trmssT_Address
        }
    });

    useEffect(() => {
        if (rowData) {
            reset({
                TRMSST_Id: rowData.trmssT_Id,
                TRMSST_ServiceStationName: rowData.trmssT_ServiceStationName,
                TRMSST_ContactNo: rowData.trmssT_ContactNo,
                TRMSST_EmailId: rowData.trmssT_EmailId,
                TRMSST_Address: rowData.trmssT_Address
            });
        }
    }, [rowData, reset]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                ...data,
                TRMSST_Id: rowData.trmssT_Id
            };

            const response = await saveMasterServiceStation(data);

            if (response.success) {
                toast.success(response.message);
                reset(data);
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
        if (rowData) {
            reset({
                TRMSST_Id: rowData.trmssT_Id,
                TRMSST_ServiceStationName: rowData.trmssT_ServiceStationName,
                TRMSST_ContactNo: rowData.trmssT_ContactNo,
                TRMSST_EmailId: rowData.trmssT_EmailId,
                TRMSST_Address: rowData.trmssT_Address
            });
        }
    };

    return (
        <div className={className}>
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
