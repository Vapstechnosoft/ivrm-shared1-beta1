'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMasterCasteCategory, useMasterCasteCategoryCodeDropdown } from '@/hooks/admission/preadmission/useMasters';
import { masterCasteCategorySchema } from '@/schemas/admission/preadmission/masters';
import { addOrUpdateMasterCasteCategory } from '@/server/admission/preadmission/masters/caste_category';
import type { IMasterCasteCategoryList } from '@/types/admission/preadmission/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterCasteCategorySchema.addOrUpdate>;

interface UpdateMasterCasteCategoryFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterCasteCategoryList;
}

export default function UpdateMasterCasteCategoryForm({ onSuccess, className = '', selectedRow: row }: UpdateMasterCasteCategoryFormProps) {
    const {
        data: masterCasteCategoryCode,
        isLoading: masterCasteCategoryCodeLoading,
        error: masterCasteCategoryCodeError,
        refetchAll: refechMasterCasteCategoryCode
    } = useMasterCasteCategoryCodeDropdown();

    const { refetchAll } = useMasterCasteCategory();

    const {
        control,
        setValue,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterCasteCategorySchema.addOrUpdate),
        mode: 'onChange'
    });

    useEffect(() => {
        if (row) {
            reset({
                imcC_Id: row.imcC_Id,
                imcC_CategoryCode: row.imcC_CategoryCode,
                imcC_CategoryName: row.imcC_CategoryName,
                imcC_CategoryDesc: row.imcC_CategoryDesc
            });
        }
    }, [row, reset, setValue]);

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const { imcC_CategoryCode, imcC_CategoryName, imcC_CategoryDesc } = data;
            const payload = {
                IMCC_ID: row.imcC_Id,
                IMCC_CategoryCode: imcC_CategoryCode,
                IMCC_CategoryName: imcC_CategoryName,
                IMCC_CategoryDesc: imcC_CategoryDesc
            };

            const response = await addOrUpdateMasterCasteCategory(payload);

            if (response.success) {
                toast.success(response.message);
                reset();
                refechMasterCasteCategoryCode();
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
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                        <div className='group flex flex-col gap-1.5'>
                            <Label aria-label='Category' htmlFor='imcC_CategoryCode'>
                                Category Code <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='imcC_CategoryCode'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                        }}
                                        value={field.value?.toString() || row.imcC_CategoryCode}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select a Category' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {masterCasteCategoryCodeLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading Category...
                                                </SelectItem>
                                            ) : masterCasteCategoryCodeError ? (
                                                <SelectItem value='error' disabled>
                                                    Error loading Category
                                                </SelectItem>
                                            ) : (
                                                masterCasteCategoryCode?.data?.map((item) => (
                                                    <SelectItem key={item.id} value={item.id.toString()}>
                                                        {item.name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.imcC_CategoryCode && <FormError>{errors.imcC_CategoryCode.message}</FormError>}
                        </div>
                        <InputText
                            label='Caste Category Name'
                            required
                            id='imcC_CategoryName'
                            placeholder='Enter Caste Category Name'
                            {...register('imcC_CategoryName')}
                            defaultValue={row.imcC_CategoryName}
                            error={errors.imcC_CategoryName?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                        <InputTextarea
                            label='Caste Category Description'
                            required
                            id='imcC_CategoryDesc'
                            placeholder='Enter Caste Category Description'
                            {...register('imcC_CategoryDesc')}
                            defaultValue={row.imcC_CategoryDesc}
                            error={errors.imcC_CategoryDesc?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                            minHeight={20}
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
                            Save Master Caste Category
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
