'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useMasterCategory } from '@/hooks/exam/exammodule/usemasters';
import { masterCategorySchema } from '@/schemas/exam/exam-module/masters';
import { addOrUpdateExamMasterCategory } from '@/server/exam/exam-module/masters/category';
import type { IMasterCategory } from '@/types/exam/exam-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { RefreshCw, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterCategorySchema.addOrUpdate>;

interface UpdateMasterCategoryFormProps {
    initialData: IMasterCategory;
    onSuccess?: () => void;
    className?: string;
}

export default function UpdateMasterCategoryForm({ initialData, onSuccess, className = '' }: UpdateMasterCategoryFormProps) {
    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterCategorySchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            emcA_Id: initialData?.emcA_Id ?? 0,
            emcA_CategoryName: initialData?.emcA_CategoryName ?? '',
            emcA_CCECheckingFlg: initialData?.emcA_CCECheckingFlg ?? true
        }
    });
    const { refetchAll } = useMasterCategory();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        if (initialData) {
            reset({
                emcA_Id: initialData?.emcA_Id ?? 0,
                emcA_CategoryName: initialData?.emcA_CategoryName ?? '',
                emcA_CCECheckingFlg: initialData?.emcA_CCECheckingFlg ?? true
            });
        }
    }, [initialData, reset]);

    // ✅ Handle form submission
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                emcA_Id: data.emcA_Id ?? 0,
                emcA_CategoryName: data.emcA_CategoryName.trim(),
                emcA_CCECheckingFlg: data.emcA_CCECheckingFlg
            };

            const response = await addOrUpdateExamMasterCategory(payload);

            if (response.success) {
                toast.success('Category updated successfully');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message || 'Failed to update category');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    // ✅ Reset to original values
    const handleReset = () => {
        reset({
            emcA_Id: initialData?.emcA_Id ?? 0,
            emcA_CategoryName: initialData?.emcA_CategoryName ?? '',
            emcA_CCECheckingFlg: initialData?.emcA_CCECheckingFlg ?? true
        });
    };

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500)
        return () => clearTimeout(timer);
    }, [initialData]);

    if (isLoading) {
        return (
            <div className='flex flex-col items-center justify-center space-y-4 py-12'>
                <RefreshCw className='h-8 w-8 animate-spin text-secondary' />
                <p className='text-muted-foreground text-sm'>Loading data...</p>
            </div>
        );
    }

    return (
        <div className={`${className} flex items-center justify-center`}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex w-full flex-col space-y-6'>
                <div className='w-full space-y-4'>
                    {/* Category Name */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Category Name'
                            required
                            id='emcA_CategoryName'
                            {...register('emcA_CategoryName')}
                            error={errors.emcA_CategoryName?.message}
                        />
                    </div>

                    {/* CCE Checking Flag */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        <div className='group flex flex-col gap-2'>
                            <Label htmlFor='emcA_CCECheckingFlg'>
                                Applicable CCE Promotion <span className='ml-1 text-red-500'>*</span>
                            </Label>

                            <Controller
                                name='emcA_CCECheckingFlg'
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup
                                        value={field.value ? 'true' : 'false'}
                                        onValueChange={(value) => field.onChange(value === 'true')}
                                        className='flex gap-6'>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='true' id='cce-yes' />
                                            <Label htmlFor='cce-yes'>Yes</Label>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='false' id='cce-no' />
                                            <Label htmlFor='cce-no'>No</Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />

                            {errors.emcA_CCECheckingFlg && <FormError>{errors.emcA_CCECheckingFlg.message}</FormError>}
                        </div>
                    </div>

                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                {/* Buttons */}
                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                        <RefreshCw className='mr-2 h-4 w-4' />
                        Reset
                    </Button>

                    <Button
                        type='submit'
                        disabled={isSubmitting}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Updating...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Update Category
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
