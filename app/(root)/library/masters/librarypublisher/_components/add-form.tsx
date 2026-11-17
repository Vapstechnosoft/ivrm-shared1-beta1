'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';

import { useMasterLibrary } from '@/hooks/library/useMasters';

import { masterPublisherSchema } from '@/schemas/library/masters';
import { addOrUpdateMasterPublisher } from '@/server/library/masters/master_publisher';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterPublisherSchema.addOrUpdate>;

interface AddMasterPublisherFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddMasterPublisherForm({ onSuccess, className = '' }: AddMasterPublisherFormProps) {
    //const { refetchAll: refetchMasterCasteCategoryCode } = useMasterLibrary();

    const { refetchAll } = useMasterLibrary();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterPublisherSchema.addOrUpdate),
        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const { lmP_PublisherName } = data;
            const payload = {
                lmP_Id: 0,
                lmP_PublisherName: lmP_PublisherName
            };

            const response = await addOrUpdateMasterPublisher(payload);

            if (response.success) {
                toast.success(response.message);
                reset();
                //refetchMasterCasteCategoryCode();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleReset = () => {
        reset();
    };

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Publisher Name'
                            required
                            id='lmP_PublisherName'
                            placeholder='Enter publisher name'
                            {...register('lmP_PublisherName')}
                            error={errors.lmP_PublisherName?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                        <InputText
                            label='Email Id :'
                            id='lmP_EMailId'
                            placeholder='Enter publisher email'
                            {...register('lmP_EMailId')}
                            error={errors.lmP_EMailId?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                    </div>

                    {/* Root Error */}
                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Mobile No'
                            id='lmP_MobileNo'
                            placeholder='Enter mobile number'
                            {...register('lmP_MobileNo')}
                            error={errors.lmP_MobileNo?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                        <InputTextarea
                            label='Address'
                            id='lmP_Address'
                            placeholder='Enter address'
                            {...register('lmP_Address')}
                            error={errors.lmP_Address?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                    </div>

                    {/* Root Error */}
                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Phone No:'
                            id='lmP_PhoneNo'
                            placeholder='Enter phone number'
                            {...register('lmP_PhoneNo')}
                            error={errors.lmP_PhoneNo?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                    </div>

                    {/* Root Error */}
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
                            Save Master Publisher
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
