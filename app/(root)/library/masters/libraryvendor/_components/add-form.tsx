'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterVendor } from '@/hooks/library/useMasters';
import { masterVendorSchema } from '@/schemas/library/masters';
import { addOrUpdateMasterVendor } from '@/server/library/masters/library_vendor';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterVendorSchema.addOrUpdate>;

interface AddMasterVendorFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddMasterVendorForm({ onSuccess, className = '' }: AddMasterVendorFormProps) {
    const { refetchAll } = useMasterVendor();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterVendorSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            lmV_MobileNo: '',
            lmV_VendorName: '',
            lmV_Address: '',
            lmV_EMailId: ''
        }
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const { lmV_MobileNo, lmV_VendorName, lmV_Address, lmV_EMailId } = data;

            const payload = {
                IMCC_ID: 0,
                lmV_MobileNo,
                lmV_VendorName,
                lmV_Address,
                lmV_EMailId,
                lmV_ActiveFlag: true
            };

            // const js = JSON.stringify(payload);
            //console.log('Payload JSON:', js);

            const response = await addOrUpdateMasterVendor(payload);

            if (response.success) {
                toast.success(response.message || 'Class Category saved successfully');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message || 'Failed to save Class Category');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Something went wrong');
        }
    };

    const handleReset = () => reset();

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                {/* Row 1 */}
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <InputText
                        label='Vendor Name'
                        required
                        id='lmV_VendorName'
                        {...register('lmV_VendorName')}
                        error={errors.lmV_VendorName?.message}
                    />

                    <InputText
                     label='Email Id'
                     id='lmV_EMailId'
                      {...register('lmV_EMailId')}
                       error={errors.lmV_EMailId?.message} />


                </div>

                {/* Row 2 */}
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <InputText
                        label='Mobile No'
                        required
                        id='lmV_MobileNo'
                        {...register('lmV_MobileNo')}
                        error={errors.lmV_MobileNo?.message}
                    />

                    <InputText label='Vendor Address' id='lmV_Address' {...register('lmV_Address')} error={errors.lmV_Address?.message} />
                </div>

                {/* Row 3 */}
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <InputText label='Phone No' id='lmV_PhoneNo' {...register('lmV_PhoneNo')} error={errors.lmV_PhoneNo?.message} />
                </div>

                {errors.root && <FormError>{errors.root.message}</FormError>}

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
                            Save Master Library
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
