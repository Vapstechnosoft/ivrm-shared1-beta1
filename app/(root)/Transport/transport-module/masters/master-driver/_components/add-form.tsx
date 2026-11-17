'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterDriver } from '@/hooks/transport/transportmodule/usemasters';
import { masterDriverSchema } from '@/schemas/transport/masters';
import { saveMasterDriver } from '@/server/transport/transport-module/masters/driver';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterDriverSchema.addOrUpdate>;

interface AddMasterDriverFormProps {
    onSuccess?: () => void;
    onClose?: () => void;
    className?: string; // Consistent with other forms
}

export default function AddMasterDriverForm({ onSuccess, onClose, className = '' }: AddMasterDriverFormProps) {
    const { refetchAll } = useMasterDriver();

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterDriverSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            trmD_DriverName: '',
            trmD_DriverCode: '',
            trmD_DLNo: '',
            trmD_DriverBadgeNo: '',
            trmD_MobileNo: '',
            trmD_EmailId: '',
            trmD_LicenseType: '',
            trmD_RTOName: '',
            trmD_SpareDriverFlg: false
        }
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                ...data,
                trmD_DLExpiryDate: data.trmD_DLExpiryDate instanceof Date ? data.trmD_DLExpiryDate.toISOString() : data.trmD_DLExpiryDate,
                trmD_MTExpiryDate: data.trmD_MTExpiryDate instanceof Date ? data.trmD_MTExpiryDate.toISOString() : data.trmD_MTExpiryDate,
                trmD_SDExpiryDate: data.trmD_SDExpiryDate instanceof Date ? data.trmD_SDExpiryDate.toISOString() : data.trmD_SDExpiryDate
            };

            const response = await saveMasterDriver(payload);

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
                    {/* Row 1 */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Driver Name'
                            required
                            id='trmD_DriverName'
                            {...register('trmD_DriverName')}
                            error={errors.trmD_DriverName?.message}
                        />
                        <InputText
                            label='Driver Code'
                            required
                            id='trmD_DriverCode'
                            {...register('trmD_DriverCode')}
                            error={errors.trmD_DriverCode?.message}
                        />
                    </div>

                    {/* Row 2 */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='DL No.'
                            required
                            id='trmD_DLNo'
                            className='uppercase'
                            {...register('trmD_DLNo')}
                            error={errors.trmD_DLNo?.message}
                        />
                        <InputText
                            label='Driver Badge No.'
                            required
                            id='trmD_DriverBadgeNo'
                            {...register('trmD_DriverBadgeNo')}
                            error={errors.trmD_DriverBadgeNo?.message}
                        />
                    </div>

                    {/* Row 3 */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Contact Mobile No.'
                            required
                            id='trmD_MobileNo'
                            maxLength={10}
                            {...register('trmD_MobileNo')}
                            error={errors.trmD_MobileNo?.message}
                        />
                        <InputText
                            label='Contact Email Id'
                            id='trmD_EmailId'
                            {...register('trmD_EmailId')}
                            error={errors.trmD_EmailId?.message}
                        />
                    </div>

                    {/* Row 4 */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Type of Vehicle Licence'
                            required
                            className='uppercase'
                            id='trmD_LicenseType'
                            {...register('trmD_LicenseType')}
                            error={errors.trmD_LicenseType?.message}
                        />
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='trmD_DLExpiryDate'>
                                DL Expiring Date <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='trmD_DLExpiryDate'
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        date={typeof field.value === 'string' ? new Date(field.value) : field.value}
                                        setDate={field.onChange}
                                    />
                                )}
                            />
                            {errors.trmD_DLExpiryDate && <FormError>{errors.trmD_DLExpiryDate.message}</FormError>}
                        </div>
                    </div>

                    {/* Row 5 */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='RTO Name'
                            required
                            id='trmD_RTOName'
                            {...register('trmD_RTOName')}
                            error={errors.trmD_RTOName?.message}
                        />
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='trmD_MTExpiryDate'>
                                Medical Test Expiring Date
                            </Label>
                            <Controller
                                name='trmD_MTExpiryDate'
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        date={field.value ? (typeof field.value === 'string' ? new Date(field.value) : field.value) : undefined}
                                        setDate={field.onChange}
                                    />
                                )}
                            />
                            {errors.trmD_MTExpiryDate && <FormError>{errors.trmD_MTExpiryDate.message}</FormError>}
                        </div>
                    </div>

                    {/* Row 6 */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='trmD_SDExpiryDate'>
                                Safe Driving Expiring Date <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='trmD_SDExpiryDate'
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        date={typeof field.value === 'string' ? new Date(field.value) : field.value}
                                        setDate={field.onChange}
                                    />
                                )}
                            />
                            {errors.trmD_SDExpiryDate && <FormError>{errors.trmD_SDExpiryDate.message}</FormError>}
                        </div>

                        <div className='group flex flex-col gap-1.5'>
                            <Label>Driver Spare</Label>
                            <Controller
                                name='trmD_SpareDriverFlg'
                                control={control}
                                render={({ field }) => (
                                    <div className='flex items-center space-x-2 pt-2'>
                                        <Checkbox
                                            id='trmD_SpareDriverFlg' // Fixed ID
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                        <Label htmlFor='trmD_SpareDriverFlg' className='font-normal'>
                                            Driver Spare
                                        </Label>
                                    </div>
                                )}
                            />
                            {errors.trmD_SpareDriverFlg && <FormError>{errors.trmD_SpareDriverFlg.message}</FormError>}
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
                        id='save-btn'
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
