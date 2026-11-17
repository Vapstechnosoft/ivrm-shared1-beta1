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
import type { IMasterReligionCategoryMappingList } from '@/types/hrms/hrms-config/master';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof hrmsMasterSchemas.religionCategoryMapping.addOrUpdate>;

interface UpdateReligionCategoryMappingFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterReligionCategoryMappingList;
}

export default function UpdateReligionCategoryMappingForm({
    onSuccess,
    className = '',
    selectedRow: row
}: UpdateReligionCategoryMappingFormProps) {
    const { saveMutation } = useReligionCategoryMapping();
    const { mutate: saveMapping, isPending } = saveMutation;

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
        watch,
        formState: { errors, isSubmitting, isDirty }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsMasterSchemas.religionCategoryMapping.addOrUpdate),
        mode: 'onChange'
    });

    useEffect(() => {
        if (row) {
            const categoryids = row.imcC_Id ? [row.imcC_Id] : [];
            reset({
                IMRCC_Id: row.ircC_Id,
                IVRMMR_Id: row.ivrmmR_Id,
                IMCC_Id: row.imcC_Id || 0,
                categoryids: categoryids
            });
        }
    }, [row, reset]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const originalCategoryIds = row.imcC_Id ? [row.imcC_Id] : [];
            const currentCategoryIds = (data.categoryids || []).sort((a, b) => a - b);
            const hasChanges =
                row.ivrmmR_Id !== data.IVRMMR_Id ||
                originalCategoryIds.length !== currentCategoryIds.length ||
                !originalCategoryIds.every((id, index) => id === currentCategoryIds[index]);
            if (!hasChanges) {
                toast.info('No changes detected. Nothing to update.');
                onSuccess?.();
                return;
            }
            const payload = {
                ircC_Id: row.ircC_Id,
                ivrmmR_Id: data.IVRMMR_Id,
                imcC_Ids: currentCategoryIds.join(',') // Comma-separated string of IDs
            };
            console.log('🟠 [RELIGION CATEGORY MAPPING] Request payload:', JSON.stringify(payload, null, 2));
            saveMapping(payload, {
                onSuccess: (response) => {
                    if (response?.success) {
                        toast.success(response?.message || 'Mapping updated successfully');
                        onSuccess?.();
                    } else {
                        toast.error(response?.message || 'Failed to update mapping');
                    }
                },
                onError: (error: any) => {
                    toast.error(error?.message || 'Failed to update mapping');
                }
            });
        } catch (error: any) {
            toast.error(error?.message || 'Failed to update mapping');
        }
    };
    const handleReset = () => {
        reset();
    };

    // Transform caste category dropdown for MultiSelect component
    const categoryOptions = useMemo(() => {
        return casteCategoryDropdown
            .filter((category: any) => {
                return category.key != null && category.key !== undefined && category.key !== 0;
            })
            .map((category: any) => ({
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
                                    // Use watch to get reactive value that updates immediately when reset() is called
                                    const categoryIds = watch('categoryids') || [];
                                    const uniqueValues = Array.from(new Set(categoryIds));
                                    const stringValues = uniqueValues.map((id) => id.toString());
                                    // Use row ID in key to force re-render when row changes
                                    const multiSelectKey = `category-${row.ircC_Id}`;
                                    return (
                                        <MultiSelect
                                            key={multiSelectKey}
                                            options={categoryOptions}
                                            defaultValue={stringValues}
                                            onValueChange={(values) => {
                                                const uniqueNumbers = Array.from(new Set(values.map((v) => Number(v))));
                                                const currentUnique = Array.from(new Set(categoryIds)).sort((a, b) => a - b);
                                                const newUnique = uniqueNumbers.sort((a, b) => a - b);
                                                if (
                                                    currentUnique.length !== newUnique.length ||
                                                    !currentUnique.every((val, idx) => val === newUnique[idx])
                                                ) {
                                                    field.onChange(uniqueNumbers);
                                                }
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
                        disabled={isSubmitting || !isDirty}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Save Mapping
                        </div>
                    </Button>
                    {!isDirty && <span className='flex items-center text-muted-foreground text-sm'>No changes made</span>}
                </div>
            </form>
        </div>
    );
}
