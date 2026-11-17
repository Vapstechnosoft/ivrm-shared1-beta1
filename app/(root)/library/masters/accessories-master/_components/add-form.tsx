'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterAccessories } from '@/hooks/library/useMasters';
import { masterAccessoriesSchema } from '@/schemas/library/masters';
import { addOrUpdateMasterAccessories } from '@/server/library/masters/accessories';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterAccessoriesSchema.addOrUpdate>;

interface AddMasterAccessoriesFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddMasterAccessoriesForm({ onSuccess, className = '' }: AddMasterAccessoriesFormProps) {
    const { refetchAll } = useMasterAccessories();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterAccessoriesSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            lmaC_Id: 0,
            lmaC_AccessoriesName: '',
            lmaC_AccessoriesDesc: ''
        }
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                ...data,
                lmaC_ActiveFlg: true,
                lmaC_Id: 0
            };

            const response = await addOrUpdateMasterAccessories(payload);

            if (response.success) {
                toast.success(response.message || 'Record Inserted Successfully!!!');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message || 'Record Not Inserted Successfully!!!');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    const handleReset = () => reset();

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Accessories Name'
                            required
                            {...register('lmaC_AccessoriesName')}
                            error={errors.lmaC_AccessoriesName?.message}
                        />
                        <InputText
                            label='Accessories Description'
                            required
                            {...register('lmaC_AccessoriesDesc')}
                            error={errors.lmaC_AccessoriesDesc?.message}
                        />
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
