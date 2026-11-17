'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterLibrary } from '@/hooks/library/useMasters';
import { masterVendorSchema } from '@/schemas/library/masters';
import { addOrUpdateMasterLibrary } from '@/server/library/masters/master_library';
import type { IMasterVendorList } from '@/types/library/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterVendorSchema.addOrUpdate>;

interface UpdateMasterVendorFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterVendorList;
}

export default function UpdateMasterVendorForm({ onSuccess, className = '', selectedRow: row }: UpdateMasterVendorFormProps) {
    const { refetchAll } = useMasterLibrary();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterVendorSchema.addOrUpdate),
        mode: 'onChange'
    });

    useEffect(() => {
        if (row) {
            reset({
                lmV_Id: row.lmV_Id,
                lmV_VendorName: row.lmV_VendorName,
                lmV_EMailId: row.lmV_EMailId,
                lmV_MobileNo: row.lmV_MobileNo,
                lmV_Address: row.lmV_Address,
                lmV_PhoneNo: row.lmV_PhoneNo
            });
        }
    }, [row, reset]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const { lmV_VendorName, lmV_EMailId, lmV_MobileNo, lmV_Address, lmV_PhoneNo } = data;

            const payload = {
                lmV_Id: row.lmV_Id,
                lmV_VendorName: lmV_VendorName,
                lmV_EMailId: lmV_EMailId,
                lmV_MobileNo: lmV_MobileNo,
                lmV_Address: lmV_Address,
                lmV_PhoneNo: lmV_PhoneNo
            };

            const response = await addOrUpdateMasterLibrary(payload);

            if (response.success) {
                toast.success(response.message || 'Master Vendor updated successfully');
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message || 'Failed to update Master Vendor');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Something went wrong');
        }
    };

    const handleReset = () => reset();

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Vendor Name'
                            required
                            id='lmV_VendorName'
                            {...register('lmV_VendorName')}
                            error={errors.lmV_VendorName?.message}
                        />
                        <InputText label='Email Id' id='lmV_EMailId' {...register('lmV_EMailId')} error={errors.lmV_EMailId?.message} />
                    </div>
                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Mobile No'
                            required
                            id='lmV_MobileNo'
                            onKeyDown={(e) => {
                                const allowed = /^[0-9]$/;
                                if (e.key.length === 1 && !allowed.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            {...register('lmV_MobileNo', {
                                required: 'Mobile No is required',
                                pattern: {
                                    value: /^[0-9]+$/,
                                    message: 'Only numbers allowed'
                                }
                            })}
                            error={errors.lmV_MobileNo?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />

                        <InputText
                            label='Vendor Address'
                            id='lmV_Address'
                            {...register('lmV_Address')}
                            error={errors.lmV_Address?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                    </div>
                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Phone No'
                            id='phone_no'
                            onKeyDown={(e) => {
                                const allowed = /^[0-9]$/;

                                if (e.key.length === 1 && !allowed.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            {...register('lmV_PhoneNo', {
                                required: 'Phone No is required',
                                pattern: {
                                    value: /^[0-9]+$/,
                                    message: 'Only numbers allowed'
                                }
                            })}
                            error={errors.lmV_PhoneNo?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                    </div>
                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                {/* Action Buttons */}
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
                            Update Master Vendor
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
