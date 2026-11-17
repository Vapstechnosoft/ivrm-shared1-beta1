'use client';
import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useMasterCasteCategoryDropdown,
    useMasterReligionDropdown,
    useReligionCategoryMapping
} from '@/hooks/hrms/useMasters';
import { hrmsMasterSchemas } from '@/schemas/hrms/masters';
import type { ICasteCategoryDropdown, IReligionDropdown } from '@/types/hrms/hrms-config/employee';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useMemo } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof hrmsMasterSchemas.religionCategoryMapping.addOrUpdate>;

interface AddReligionCategoryMappingFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddReligionCategoryMappingForm({ onSuccess, className = '' }: AddReligionCategoryMappingFormProps) {
    const { saveMutation } = useReligionCategoryMapping();

    // Religion dropdown
    const { data: religionDropdownResponse } = useMasterReligionDropdown();
    const religionDropdown = useMemo(() => {
        const data = Array.isArray(religionDropdownResponse)
            ? religionDropdownResponse
            : (religionDropdownResponse as any)?.data || [];
        return data.map((item: any) => ({
            key: item.ivrmmR_Id,
            value: item.ivrmmR_Name
        }));
    }, [religionDropdownResponse]);

    // Caste Category dropdown
    const { data: casteCategoryDropdownResponse } = useMasterCasteCategoryDropdown();
    const casteCategoryDropdown = useMemo(() => {
        const data = Array.isArray(casteCategoryDropdownResponse)
            ? casteCategoryDropdownResponse
            : (casteCategoryDropdownResponse as any)?.data || [];
        return data.map((item: any) => ({
            key: item.imcC_Id,
            value: item.imcC_CategoryName
        }));
    }, [casteCategoryDropdownResponse]);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsMasterSchemas.religionCategoryMapping.addOrUpdate),
        mode: 'onChange'
    });

    const { mutate: saveMapping, isPending } = saveMutation;

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            // Validate required fields
            if (!data.IVRMMR_Id || data.IVRMMR_Id <= 0) {
                toast.error('Please select a religion');
                return;
            }
            if (!data.categoryids || data.categoryids.length === 0) {
                toast.error('Please select at least one category');
                return;
            }

            const payload = {
                ircC_Id: 0, // 0 for add
                ivrmmR_Id: data.IVRMMR_Id,
                imcC_Ids: (data.categoryids || []).join(',') // Comma-separated string of IDs
            };

            saveMapping(payload, {
                onSuccess: (response) => {
                    if (response?.success) {
                        toast.success(response?.message || 'Mapping saved successfully');
                        reset();
                        onSuccess?.();
                    } else {
                        toast.error(response?.message || 'Failed to save mapping');
                    }
                },
                onError: (error: any) => {
                    toast.error(error?.message || 'Failed to save mapping');
                }
            });
        } catch (error: any) {
            toast.error(error?.message || 'Failed to save mapping');
        }
    };
    const handleReset = () => {
        reset();
    };

    // Transform caste category dropdown for MultiSelect component
    const categoryOptions = useMemo(() => {
        return casteCategoryDropdown
            .filter((category: ICasteCategoryDropdown) => {
                return category.key != null && category.key !== undefined && category.key !== 0;
            })
            .map((category: ICasteCategoryDropdown) => ({
                label: category.value || String(category.key),
                value: category.key?.toString().trim() || '',
                _index: 0
            }))
            .filter((opt: { value: string }) => opt.value !== '');
    }, [casteCategoryDropdown]);
    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='IVRMMR_Id'>
                                Religion <span className='text-destructive'>*</span>
                            </Label>
                            <Controller
                                name='IVRMMR_Id'
                                control={control}
                                render={({ field }) => {
                                    const selectValue = field.value && field.value > 0 ? field.value.toString() : '';
                                    return (
                                        <Select
                                            value={selectValue}
                                            onValueChange={(value) => {
                                                const numValue = Number(value);
                                                if (numValue > 0) {
                                                    field.onChange(numValue);
                                                }
                                            }}>
                                            <SelectTrigger id='IVRMMR_Id' className='transition-colors focus:ring-2 focus:ring-primary/20'>
                                                <SelectValue placeholder='Select religion' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {religionDropdown
                                                    .filter((religion: IReligionDropdown) => {
                                                        return religion.key != null && religion.key !== undefined && religion.key !== 0;
                                                    })
                                                    .map((religion: IReligionDropdown) => {
                                                        const key = religion.key?.toString().trim();
                                                        if (!key || key === '') return null;
                                                        const value = religion.value || String(religion.key);
                                                        return (
                                                            <SelectItem key={religion.key} value={key}>
                                                                {value}
                                                            </SelectItem>
                                                        );
                                                    })
                                                    .filter(Boolean)}
                                            </SelectContent>
                                        </Select>
                                    );
                                }}
                            />
                            {errors.IVRMMR_Id && <FormError>{errors.IVRMMR_Id.message}</FormError>}
                        </div>
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='categoryids'>
                                Category <span className='text-destructive'>*</span>
                            </Label>
                            <Controller
                                name='categoryids'
                                control={control}
                                render={({ field }) => {
                                    const uniqueValues = Array.from(new Set(field.value || []));
                                    const stringValues = uniqueValues.map((id) => id.toString());
                                    return (
                                        <MultiSelect
                                            options={categoryOptions}
                                            defaultValue={stringValues}
                                            onValueChange={(values) => {
                                                const uniqueNumbers = Array.from(new Set(values.map((v) => Number(v))));
                                                field.onChange(uniqueNumbers);
                                            }}
                                            placeholder='Select categories'
                                            maxCount={3}
                                            maxHeight={300}
                                            className='w-full'
                                        />
                                    );
                                }}
                            />
                            {errors.categoryids && <FormError>{errors.categoryids.message}</FormError>}
                        </div>
                    </div>
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
                        disabled={isSubmitting || isPending}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting || isPending}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Save Mapping
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
