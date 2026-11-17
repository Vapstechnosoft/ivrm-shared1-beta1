'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterLibrary } from '@/hooks/library/useMasters';
import { masterCategorySchema } from '@/schemas/library/masters';
import { addOrUpdateMasterLibrary } from '@/server/library/masters/master_library';
import type { IMasterCategoryList } from '@/types/library/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterCategorySchema.addOrUpdate>;

interface UpdateMasterClassFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterCategoryList;
}

export default function UpdateMasterClassForm({ onSuccess, className = '', selectedRow: row }: UpdateMasterClassFormProps) {
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

    useEffect(() => {
        if (row) {
            reset({
                lmC_Id: row.lmC_Id,
                lmC_CategoryName: row.lmC_CategoryName
            });
        }
    }, [row, reset]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const { lmC_CategoryName } = data;

            const payload = {
                mI_Id: 30,
                lmC_Id: row.lmC_Id,
                lmC_CategoryName: lmC_CategoryName
            };

            const response = await addOrUpdateMasterLibrary(payload);

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
                        {/* <InputText
                            label='Class Category Code'
                            required
                            id='fmcC_ClassCategoryCode'
                            {...register('fmcC_ClassCategoryCode')}
                            error={errors.fmcC_ClassCategoryCode?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                        <InputText
                            label='Class Category Name'
                            required
                            id='fmcC_ClassCategoryName'
                            {...register('fmcC_ClassCategoryName')}
                            error={errors.fmcC_ClassCategoryName?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        /> */}

                        <InputText
                            label='Class Category Name'
                            required
                            id='fmcC_ClassCategoryName'
                            onKeyDown={(e) => {
                                const allowed = /^[A-Za-z]$/;

                                if (e.key.length === 1 && !allowed.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            {...register('lmC_CategoryName', {
                                required: 'Category Name is required',
                                pattern: {
                                    value: /^[A-Za-z]+$/,
                                    message: 'Only letters allowed'
                                }
                            })}
                            error={errors.lmC_CategoryName?.message}
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
                            Update Class Category
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
