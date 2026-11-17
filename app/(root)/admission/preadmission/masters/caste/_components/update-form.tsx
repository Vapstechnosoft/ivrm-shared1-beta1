'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMasterCaste, useMasterCasteCategoryDropdown } from '@/hooks/admission/preadmission/useMasters';
import { masterCasteSchema } from '@/schemas/admission/preadmission/masters';
import { addOrUpdateMasterCaste } from '@/server/admission/preadmission/masters/caste';
import type { IMasterCasteList } from '@/types/admission/preadmission/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterCasteSchema.addOrUpdate>;

interface UpdateMasterCasteFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterCasteList;
}

export default function UpdateMasterCasteForm({ onSuccess, className = '', selectedRow: row }: UpdateMasterCasteFormProps) {
    const {
        data: masterCasteCategory,
        isLoading: masterCasteCategoryLoading,
        error: masterCasteCategoryError,
        refetchAll: refechMasterCasteCategory
    } = useMasterCasteCategoryDropdown();

    const { refetchAll } = useMasterCaste();

    const {
        control,
        setValue,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterCasteSchema.addOrUpdate),
        mode: 'onChange'
    });

    useEffect(() => {
        if (row) {
            reset({
                imC_Id: row.imC_Id,
                imcC_Id: row.imcC_Id,
                imC_CasteName: row.imC_CasteName,
                imC_CasteDesc: row.imC_CasteDesc
            });
        }
    }, [row, reset, setValue]);

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const { imcC_Id, imC_CasteName, imC_CasteDesc } = data;
            const payload = {
                imC_ID: row.imC_Id,
                imcC_Id,
                imC_CasteName,
                imC_CasteDesc
            };

            const response = await addOrUpdateMasterCaste(payload);

            if (response.success) {
                toast.success(response.message);
                reset();
                refechMasterCasteCategory();
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
                            <Label aria-label='Caste Category' htmlFor='imcC_Id'>
                                Caste Category <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='imcC_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(Number(value));
                                        }}
                                        value={field.value?.toString() || row.imcC_Id.toString()}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select a Category' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {masterCasteCategoryLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading Category...
                                                </SelectItem>
                                            ) : masterCasteCategoryError ? (
                                                <SelectItem value='error' disabled>
                                                    Error loading Category
                                                </SelectItem>
                                            ) : (
                                                masterCasteCategory?.data?.map((item) => (
                                                    <SelectItem key={item.imcC_Id} value={item.imcC_Id.toString()}>
                                                        {item.imcC_CategoryName}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.imcC_Id && <FormError>{errors.imcC_Id.message}</FormError>}
                        </div>
                        <InputText
                            label='Caste Name'
                            required
                            id='imC_CasteName'
                            placeholder='Enter Caste Name'
                            {...register('imC_CasteName')}
                            defaultValue={row.imC_CasteName}
                            error={errors.imC_CasteName?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                        <InputTextarea
                            label='Caste Description'
                            required
                            id='imC_CasteDesc'
                            placeholder='Enter Caste Description'
                            {...register('imC_CasteDesc')}
                            defaultValue={row.imC_CasteDesc}
                            error={errors.imC_CasteDesc?.message}
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
                            Save Master Caste
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
