'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';

import { useMasterLibrary } from '@/hooks/library/useMasters';
import { masterCategorySchema } from '@/schemas/library/masters';

import { addOrUpdateMasterLibrary } from '@/server/library/masters/master_library';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterCategorySchema.addOrUpdate>;

interface AddMasterCategoryFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddMasterCategoryForm({ onSuccess, className = '' }: AddMasterCategoryFormProps) {
    //const { refetchAll: refetchMasterCasteCategoryCode } = useMasterLibrary();

    const { refetchAll } = useMasterLibrary();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterCategorySchema.addOrUpdate),
        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const { lmC_CategoryName, lmC_CategoryCode, lmC_BNBFlg } = data;
            const payload = {
                IMCC_ID: 0,
                lmC_CategoryName: lmC_CategoryName,
                lmC_CategoryCode: lmC_CategoryCode,
                lmC_BNBFlg: lmC_BNBFlg
            };

            const response = await addOrUpdateMasterLibrary(payload);

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
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        <InputText
                            label='Category Name'
                            required
                            id='lmC_CategoryName'
                            placeholder='Enter Category name'
                            {...register('lmC_CategoryName')}
                            error={errors.lmC_CategoryName?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />

                        <InputText
                            label='Category Code'
                            required
                            id='lmC_CategoryCode'
                            placeholder='Enter Category code'
                            {...register('lmC_CategoryCode')}
                            error={errors.lmC_CategoryCode?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                        <InputText
                            label='Category Type '
                            required
                            id='lmC_BNBFlg'
                            placeholder='Enter Category name'
                            {...register('lmC_BNBFlg')}
                            error={errors.lmC_BNBFlg?.message}
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
                            Save Master Category
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
