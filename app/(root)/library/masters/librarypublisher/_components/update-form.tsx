'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterPublisherList } from '@/hooks/library/useMasters';
import { masterPublisherSchema } from '@/schemas/library/masters';
import { addOrUpdateMasterPublisher } from '@/server/library/masters/master_publisher';
import type { IMasterPublisherList } from '@/types/library/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterPublisherSchema.addOrUpdate>;

interface UpdateMasterPublisherFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterPublisherList;
}

export default function UpdateMasterPublisherForm({ onSuccess, className = '', selectedRow: row }: UpdateMasterPublisherFormProps) {
    const { refetchAll } = useMasterPublisherList();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterPublisherSchema.addOrUpdate),
        mode: 'onChange'
    });

    useEffect(() => {
        if (row) {
            reset({
                lmP_Id: row.lmP_Id,
                lmP_PublisherName: row.lmP_PublisherName,
                lmP_EMailId: row.lmP_EMailId,
                lmP_MobileNo: row.lmP_MobileNo,
                lmP_Address: row.lmP_Address,
                lmP_PhoneNo: row.lmP_PhoneNo
            });
        }
    }, [row, reset]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const { lmP_PublisherName } = data;

            const payload = {
                lmP_Id: row.lmP_Id,
                lmP_PublisherName: lmP_PublisherName,
                lmP_EMailId: data.lmP_EMailId,
                lmP_MobileNo: data.lmP_MobileNo,
                lmP_Address: data.lmP_Address,
                lmP_PhoneNo: data.lmP_PhoneNo
            };

            const response = await addOrUpdateMasterPublisher(payload);

            if (response.success) {
                toast.success(response.message || 'Master Library updated successfully');
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message || 'Failed to update Master Library');
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
                            label='Publisher Name'
                            {...register('lmP_PublisherName', {})}
                            error={errors.lmP_PublisherName?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                        <InputText
                            label='Email Id'
                            {...register('lmP_EMailId', {})}
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
                            {...register('lmP_MobileNo', {})}
                            error={errors.lmP_MobileNo?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                        <InputText
                            label='Address'
                            {...register('lmP_Address', {})}
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
                            label='Phone No'
                            {...register('lmP_PhoneNo', {})}
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
                            Update Master Publisher
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
