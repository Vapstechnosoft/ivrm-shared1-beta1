'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useAcademicYearDropdown,
    useMasterCategoryDropdown,
    useMasterClassCategory,
    useMasterSectionDropdown,
    useMasterUnMappedClassDropdown
} from '@/hooks/admission/preadmission/useMasters';
import { masterClassCategorySchema } from '@/schemas/admission/preadmission/masters';
import { addMasterClassCategory } from '@/server/admission/preadmission/masters/class_category';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterClassCategorySchema.add>;

interface AddMasterClassCategoryFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddMasterClassCategoryForm({ onSuccess, className = '' }: AddMasterClassCategoryFormProps) {
    const { refetchAll } = useMasterClassCategory();
    const [selectedClassItems, setSelectedClassItems] = useState<{ asmcL_Id: string; asmcL_ClassName: string }[]>([]);
    const [selectedSectionItems, setSelectedSectionItems] = useState<{ asmS_Id: string; asmcL_SectionName: string }[]>([]);

    const {
        data: academicYear,
        isLoading: academicYearLoading,
        error: academicYearError,
        refetchAll: refetchAcademicYear
    } = useAcademicYearDropdown();

    const {
        data: masterCategory,
        isLoading: masterCategoryLoading,
        error: masterCategoryError,
        refetchAll: refetchMasterCategory
    } = useMasterCategoryDropdown();

    const { data: masterSection, isLoading: masterSectionLoading, refetchAll: refetchMasterSection } = useMasterSectionDropdown();

    const {
        control,
        handleSubmit,
        reset,
        clearErrors,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterClassCategorySchema.add),
        mode: 'onChange'
    });
    const watchedAsmaY_Id = watch('asmaY_Id');
    const watchedAmC_Id = watch('amC_Id');
    const {
        data: masterUnmappedClass,
        isLoading: masterUnmappedClassLoading,
        refetchAll: refetchMasterUnmappedClass
    } = useMasterUnMappedClassDropdown(watchedAsmaY_Id, watchedAmC_Id);

    function OnReset() {
        reset({
            asmaY_Id: undefined,
            amC_Id: undefined,
            category_classes: [],
            category_class_sections: []
        });

        setSelectedClassItems([]);
        setSelectedSectionItems([]);

        setValue('category_classes', []);

        setTimeout(() => {
            clearErrors();
        }, 0);

        refetchAll();
        // also trigger immediate refetch of dropdowns when reset/add completed
        refetchAcademicYear();
        refetchMasterCategory();
        refetchMasterUnmappedClass();
        refetchMasterSection();
    }

    // When the Add/Edit form mounts, ensure dropdowns are freshly fetched
    useEffect(() => {
        // call the hooks' refetchAll functions to refresh dropdown data when form opens
        refetchAcademicYear?.();
        refetchMasterCategory?.();
        refetchMasterUnmappedClass?.();
        refetchMasterSection?.();
    }, []);

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const { asmaY_Id, amC_Id } = data;
            const payload = {
                asmcC_Id: 0,
                asmaY_Id: asmaY_Id,
                amC_Id: amC_Id,
                category_classes: selectedClassItems.map((item) => {
                    return { asmcL_Id: item.asmcL_Id };
                }),
                category_class_sections: selectedSectionItems.map((item) => {
                    return { asmS_Id: item.asmS_Id };
                })
            };

            const response = await addMasterClassCategory(payload);

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
        const selectedClasses = selectedValues.map((value) => {
            return { asmcL_Id: value.toString(), asmcL_ClassName: '' };
        });

        setSelectedClassItems(selectedClasses);
    };
    const handleSectionSelection = (selectedValues: string[]) => {
        const selectedSections = selectedValues.map((value) => {
            return { asmS_Id: value.toString(), asmcL_SectionName: '' };
        });

        setSelectedSectionItems(selectedSections);
    };

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                        <div className='group flex flex-col gap-1.5'>
                            <Label aria-label='Academic Year' htmlFor='asmaY_Id'>
                                Academic Year <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='asmaY_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        key={field.value || 'empty'}
                                        onValueChange={(value) => {
                                            field.onChange(Number(value));
                                        }}
                                        value={field.value?.toString() || ''}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select a AcademicYear' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {academicYearLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading academicYear...
                                                </SelectItem>
                                            ) : academicYearError ? (
                                                <SelectItem value='error' disabled>
                                                    Error loading academicYear
                                                </SelectItem>
                                            ) : (
                                                academicYear?.data?.map((item) => (
                                                    <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                        {item.asmaY_Year}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.asmaY_Id && <FormError>{errors.asmaY_Id.message}</FormError>}
                        </div>
                        <div className='group flex flex-col gap-1.5'>
                            <Label aria-label='Category' htmlFor='amC_Id'>
                                Category <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='amC_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        key={field.value || 'empty'}
                                        onValueChange={(value) => {
                                            field.onChange(Number(value));
                                        }}
                                        value={field.value?.toString() || ''}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select a category' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {masterCategoryLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading category...
                                                </SelectItem>
                                            ) : masterCategoryError ? (
                                                <SelectItem value='error' disabled>
                                                    Error loading category
                                                </SelectItem>
                                            ) : (
                                                masterCategory?.data?.map((item) => (
                                                    <SelectItem key={item.amC_Id} value={item.amC_Id.toString()}>
                                                        {item.amC_Name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.amC_Id && <FormError>{errors.amC_Id.message}</FormError>}
                        </div>
                        <div className='group flex flex-col gap-1.5'>
                            <Label aria-label='Class' htmlFor='category_classes'>
                                Class <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='category_classes'
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        options={
                                            masterUnmappedClass?.data?.map((data) => ({
                                                label: data.asmcL_ClassName,
                                                value: data.asmcL_Id.toString()
                                            })) || []
                                        }
                                        onValueChange={(selectedValues) => {
                                            field.onChange(selectedValues);
                                            handleClassSelection(selectedValues);
                                        }}
                                        defaultValue={selectedClassItems.map((data) => data.asmcL_Id)}
                                        value={selectedClassItems.map((data) => data.asmcL_Id)}
                                        placeholder='Select Classes'
                                        variant='inverted'
                                        disabled={!watchedAsmaY_Id || !watchedAmC_Id || masterUnmappedClassLoading}
                                    />
                                )}
                            />

                            {errors.category_classes && <FormError>{errors.category_classes.message}</FormError>}
                        </div>
                        <div className='group flex flex-col gap-1.5'>
                            <Label aria-label='Section' htmlFor='category_class_sections'>
                                Section <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='category_class_sections'
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        options={
                                            masterSection?.data?.map((data) => ({
                                                label: data.asmC_SectionName,
                                                value: data.asmS_Id.toString()
                                            })) || []
                                        }
                                        onValueChange={(selectedValues) => {
                                            field.onChange(selectedValues);
                                            handleSectionSelection(selectedValues);
                                        }}
                                        defaultValue={selectedSectionItems.map((data) => data.asmS_Id)}
                                        value={selectedSectionItems.map((data) => data.asmS_Id)}
                                        placeholder='Select Classes'
                                        variant='inverted'
                                        disabled={masterSectionLoading}
                                    />
                                )}
                            />

                            {errors.category_class_sections && <FormError>{errors.category_class_sections.message}</FormError>}
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
