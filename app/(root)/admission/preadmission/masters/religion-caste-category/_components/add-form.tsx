'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMasterReligionCasteCategory, useUnmappedCasteCategoryDropdown } from '@/hooks/admission/preadmission/useMasters';
import { useReligionDropdown } from '@/hooks/admission/preadmission/useTransactions';
import { masterReligionCasteCategorySchema } from '@/schemas/admission/preadmission/masters';
import { addMasterReligionCasteCategory } from '@/server/admission/preadmission/masters/religion_caste_category';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterReligionCasteCategorySchema.add>;

interface AddMasterReligionCasteCategoryFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddMasterReligionCasteCategoryForm({ onSuccess, className = '' }: AddMasterReligionCasteCategoryFormProps) {
    const { refetchAll } = useMasterReligionCasteCategory();
    const [selectedCasteCategoryItems, setSelectedCasteCategoryItems] = useState<{ imcC_Id: string; imcC_CategoryName: string }[]>([]);

    const { data: religion, isLoading: religionLoading, error: religionError, refetchAll: refetchReligion } = useReligionDropdown();

    const {
        data: unmappedCasteCategory,
        isLoading: unmappedCasteCategoryLoading,
        refetchAll: refetchUnmappedCasteCategory
    } = useUnmappedCasteCategoryDropdown();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterReligionCasteCategorySchema.add),
        mode: 'onChange'
    });

    function OnReset() {
        reset();
        setSelectedCasteCategoryItems([]);
        refetchAll();
        refetchReligion();
        refetchUnmappedCasteCategory();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const { ivrmmR_Id } = data;
            const payload = {
                ivrmmR_Id: ivrmmR_Id,
                caste_categories: selectedCasteCategoryItems.map((item) => {
                    return { imcC_Id: item.imcC_Id };
                })
            };

            const response = await addMasterReligionCasteCategory(payload);

            if (response.success) {
                toast.success(response.message);
                OnReset();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleReset = () => {
        OnReset();
    };

    const handleClassSelection = (selectedValues: string[]) => {
        const selectedCasteCategoryes = selectedValues.map((value) => {
            return { imcC_Id: value.toString(), imcC_CategoryName: '' };
        });

        setSelectedCasteCategoryItems(selectedCasteCategoryes);
    };

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                        <div className='group flex flex-col gap-1.5'>
                            <Label aria-label='Religion' htmlFor='ivrmmR_Id'>
                                Religion <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='ivrmmR_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        key={field.value || 'empty'}
                                        onValueChange={(value) => {
                                            field.onChange(Number(value));
                                        }}
                                        value={field.value?.toString() || ''}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select a Religion' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {religionLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading religion...
                                                </SelectItem>
                                            ) : religionError ? (
                                                <SelectItem value='error' disabled>
                                                    Error loading religion
                                                </SelectItem>
                                            ) : (
                                                religion?.data?.map((item) => (
                                                    <SelectItem key={item.ivrmmR_Id} value={item.ivrmmR_Id.toString()}>
                                                        {item.ivrmmR_Name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.ivrmmR_Id && <FormError>{errors.ivrmmR_Id.message}</FormError>}
                        </div>
                        <div className='group flex flex-col gap-1.5'>
                            <Label aria-label='Caste Category' htmlFor='caste_category_ids'>
                                Caste Category <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='caste_category_ids'
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        options={
                                            unmappedCasteCategory?.data?.map((data) => ({
                                                label: data.imcC_CategoryName,
                                                value: data.imcC_Id.toString()
                                            })) || []
                                        }
                                        onValueChange={(selectedValues) => {
                                            field.onChange(selectedValues);
                                            handleClassSelection(selectedValues);
                                        }}
                                        defaultValue={selectedCasteCategoryItems.map((data) => data.imcC_Id)}
                                        value={selectedCasteCategoryItems.map((data) => data.imcC_Id)}
                                        placeholder='Select Classes'
                                        variant='inverted'
                                        disabled={unmappedCasteCategoryLoading}
                                    />
                                )}
                            />

                            {errors.caste_category_ids && <FormError>{errors.caste_category_ids.message}</FormError>}
                        </div>
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
                            Save
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
