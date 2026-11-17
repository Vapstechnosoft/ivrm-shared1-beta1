'use client';

import { Button } from '@/components/ui/button';
import { DateField } from '@/components/ui/dateField';
import { FormError, Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useYearlyCategoryDateMapping } from '@/hooks/exam/exammodule/exam-mapping';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { yearlyCategoryDatesMappingSchema } from '@/schemas/exam/exam-module/exam-mapping';
import {
    addOrUpdateYearlyCategoryDatesMapping,
    getCategoryDropDownByAcademicYearlist
} from '@/server/exam/exam-module/exam-mapping/yearly-category-dates-mapping';
import type { IYearlyCategoryDatesMapping } from '@/types/exam/exam-module/exam-mapping';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof yearlyCategoryDatesMappingSchema.addOrUpdate>;

interface UpdateFormProps {
    selectedRow: IYearlyCategoryDatesMapping;
    onSuccess?: () => void;
}

export default function UpdateYearlyCategoryDatesMapping({ selectedRow, onSuccess }: UpdateFormProps) {
    const orgId = 30;

    const methods = useForm<FormFields>({
        resolver: zodResolver(yearlyCategoryDatesMappingSchema.addOrUpdate),
        mode: 'all',
        defaultValues: {
            eyC_Id: selectedRow.eyC_Id,
            // mI_Id: 30,
            asmaY_Id: selectedRow.asmaY_Id,
            emcA_Id: selectedRow.emcA_Id,
            eyC_ExamStartDate: selectedRow.eyC_ExamStartDate?.split('T')[0],
            eyC_ExamEndDate: selectedRow.eyC_ExamEndDate?.split('T')[0],
            eyC_MarksEntryLastDate: selectedRow.eyC_MarksEntryLastDate?.split('T')[0],
            eyC_MarksProcessLastDate: selectedRow.eyC_MarksProcessLastDate?.split('T')[0],
            eyC_MarksPublishDate: selectedRow.eyC_MarksPublishDate?.split('T')[0]
        }
    });

    useEffect(() => {
        if (selectedRow) {
            methods.reset({
                eyC_Id: selectedRow.eyC_Id,
                // mI_Id: 30,
                asmaY_Id: selectedRow.asmaY_Id,
                emcA_Id: selectedRow.emcA_Id,
                eyC_ExamStartDate: selectedRow.eyC_ExamStartDate?.split('T')[0],
                eyC_ExamEndDate: selectedRow.eyC_ExamEndDate?.split('T')[0],
                eyC_MarksEntryLastDate: selectedRow.eyC_MarksEntryLastDate?.split('T')[0],
                eyC_MarksProcessLastDate: selectedRow.eyC_MarksProcessLastDate?.split('T')[0],
                eyC_MarksPublishDate: selectedRow.eyC_MarksPublishDate?.split('T')[0]
            });
        }
    }, [selectedRow, methods]);

    const { control, handleSubmit, formState } = methods;
    const { isSubmitting } = formState;
    const { refetchAll } = useYearlyCategoryDateMapping();

    const [categories, setCategories] = useState<{ emcA_Id: number; emcA_CategoryName: string }[]>([]);
    const { data: academicYear, isLoading: academicYearLoading, error: academicYearError } = useAcademicYearDropdown();

    // Watch selected Academic Year
    const selectedYearId = useWatch({ control, name: 'asmaY_Id' });

    // Fetch categories whenever Academic Year changes
    useEffect(() => {
        if (!selectedYearId) return;
        async function fetchCategories() {
            try {
                const { data: cats } = await getCategoryDropDownByAcademicYearlist(selectedYearId);
                setCategories(Array.isArray(cats) ? cats : []);
            } catch (err: any) {
                toast.error(err?.message ?? 'Failed to load categories');
            }
        }
        fetchCategories();
    }, [selectedYearId]);

    const onSubmit = async (data: FormFields) => {
        try {
            const res = await addOrUpdateYearlyCategoryDatesMapping(data);
            if (res?.success) {
                toast.success('Yearly category dates mapping updated successfully');
                methods.reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(res?.message ?? 'Update failed');
            }
        } catch (err: any) {
            toast.error(err?.message ?? 'Failed to update');
        }
    };

    return (
        <div className='flex w-full flex-col gap-6'>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-md' noValidate>
                    <div className='grid grid-cols-2 gap-6'>
                        {/* Left Column */}
                        <div>
                            <Controller
                                control={control}
                                name='asmaY_Id'
                                render={({ field, fieldState }) => (
                                    <div>
                                        <Label>
                                            Academic Year <span className='text-red-500'>*</span>
                                        </Label>
                                        <Select
                                            onValueChange={(val) => field.onChange(Number(val))}
                                            value={field.value ? String(field.value) : undefined}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Academic Year' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {academicYearLoading ? (
                                                    <SelectItem value='loading' disabled>
                                                        Loading Academic Year...
                                                    </SelectItem>
                                                ) : academicYearError ? (
                                                    <SelectItem value='error' disabled>
                                                        Error loading Academic Year
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
                                        {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                    </div>
                                )}
                            />

                            <Controller
                                control={control}
                                name='eyC_ExamStartDate'
                                render={({ field, fieldState }) => (
                                    <DateField
                                        field={field}
                                        fieldState={fieldState}
                                        label='Exam Start Date'
                                        placeholder='Select Exam Start Date'
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name='eyC_MarksEntryLastDate'
                                render={({ field, fieldState }) => (
                                    <DateField
                                        field={field}
                                        fieldState={fieldState}
                                        label='Marks Entry Last Date'
                                        placeholder='Select Marks Entry Last Date'
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name='eyC_MarksPublishDate'
                                render={({ field, fieldState }) => (
                                    <DateField
                                        field={field}
                                        fieldState={fieldState}
                                        label='Marks Publish Date'
                                        placeholder='Select Marks Publish Date'
                                    />
                                )}
                            />
                        </div>

                        {/* Right Column */}
                        <div>
                            <Controller
                                control={control}
                                name='emcA_Id'
                                render={({ field, fieldState }) => (
                                    <div>
                                        <Label>
                                            Category <span className='text-red-500'>*</span>
                                        </Label>
                                        <Select onValueChange={(val) => field.onChange(Number(val))} value={String(field.value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Category' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((c) => (
                                                    <SelectItem key={c.emcA_Id} value={String(c.emcA_Id)}>
                                                        {c.emcA_CategoryName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                    </div>
                                )}
                            />

                            <Controller
                                control={control}
                                name='eyC_ExamEndDate'
                                render={({ field, fieldState }) => (
                                    <DateField
                                        field={field}
                                        fieldState={fieldState}
                                        label='Exam End Date'
                                        placeholder='Select Exam End Date'
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name='eyC_MarksProcessLastDate'
                                render={({ field, fieldState }) => (
                                    <DateField
                                        field={field}
                                        fieldState={fieldState}
                                        label='Marks Process Last Date'
                                        placeholder='Select Marks Process Last Date'
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className='mt-4 flex justify-start gap-4'>
                        <Button type='submit' className='w-fit' disabled={isSubmitting}>
                            {isSubmitting ? 'Updating...' : 'Update'}
                        </Button>
                        <Button type='button' variant='outline' className='w-fit' onClick={() => methods.reset(selectedRow)}>
                            Reset
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}
