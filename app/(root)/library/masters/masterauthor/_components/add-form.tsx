'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { useLibraryMasterAuthor } from '@/hooks/library/useMasters';
import { masterAuthorSchema } from '@/schemas/library/masters';
import { addOrUpdateMasterAuthor } from '@/server/library/masters/master_author';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterAuthorSchema.addOrUpdate>;

interface AddMasterAuthorFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddMasterAuthorForm({ onSuccess, className = '' }: AddMasterAuthorFormProps) {
    const { refetchAll } = useLibraryMasterAuthor();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<z.infer<typeof masterAuthorSchema.addOrUpdate>>({
        resolver: zodResolver(masterAuthorSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            lmaU_Id: undefined,
            lmaU_AuthorFirstName: '',
            lmaU_AuthorMiddleName: '',
            lmaU_AuthorLastName: '',
            lmaU_MobileNo: '',
            lmaU_Address: '',
            lmaU_EmailId: '',
            lmaU_PhoneNo: '',
            lmaU_ActiveFlg: false
        }
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const { lmaU_MobileNo, lmaU_AuthorFirstName, lmaU_Address, lmaU_EmailId, lmaU_PhoneNo } = data;

            const payload = {
                IMCC_ID: 0,
                lmaU_MobileNo,
                lmaU_AuthorFirstName,
                lmaU_Address,
                lmaU_EmailId,
                lmaU_ActiveFlag: true,
                lmaU_PhoneNo
            };

            // const js = JSON.stringify(payload);
            //console.log('Payload JSON:', js);

            const response = await addOrUpdateMasterAuthor(payload);

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
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Author Name'
                            required
                            id='lmaU_AuthorFirstName'
                            {...register('lmaU_AuthorFirstName')}
                            error={errors.lmaU_AuthorFirstName?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />

                        <InputText
                            label='Email Id'
                            id='lmaU_EmailId'
                            {...register('lmaU_EmailId')}
                            error={errors.lmaU_EmailId?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                    </div>

                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Mobile No'
                            id='lmaU_MobileNo'
                            {...register('lmaU_MobileNo')}
                            error={errors.lmaU_MobileNo?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />

                        <InputText
                            label='Author Address'
                            id='lmaU_Address'
                            {...register('lmaU_Address')}
                            error={errors.lmaU_Address?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                    </div>

                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Phone No'
                            id='lmaU_PhoneNo'
                            {...register('lmaU_PhoneNo')}
                            error={errors.lmaU_PhoneNo?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                    </div>

                    {errors.root && <FormError>{errors.root.message}</FormError>}
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
