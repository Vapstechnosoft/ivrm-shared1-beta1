'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterClassCategory } from '@/hooks/fees/useMasters';
import { masterClassCategorySchema } from '@/schemas/fees/masters';
import { addOrUpdateMasterClassCategory } from '@/server/fees/masters/class_category';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterClassCategorySchema.addOrUpdate>;

interface AddMasterClassCategoryFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddMasterClassCategoryForm({ onSuccess, className = '' }: AddMasterClassCategoryFormProps) {
    const { refetchAll } = useMasterClassCategory();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterClassCategorySchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            fmcC_ClassCategoryName: '',
            fmcC_ClassCategoryCode: ''
        }
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const { fmcC_ClassCategoryName, fmcC_ClassCategoryCode } = data;

            const payload = {
                // mI_Id: 30,
                fmcC_Id: 0,
                fmcC_ClassCategoryName,
                fmcC_ClassCategoryCode,
                fmcC_ActiveFlag: true
            };

            const js = JSON.stringify(payload);
            console.log('Payload JSON:', js);

            const response = await addOrUpdateMasterClassCategory(payload);

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
                            label='Class Category Name'
                            required
                            id='fmcC_ClassCategoryName'
                            {...register('fmcC_ClassCategoryName')}
                            error={errors.fmcC_ClassCategoryName?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />

                        <InputText
                            label='Class Category Code'
                            required
                            id='fmcC_ClassCategoryCode'
                            {...register('fmcC_ClassCategoryCode')}
                            error={errors.fmcC_ClassCategoryCode?.message}
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
                            Save Class Category
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
