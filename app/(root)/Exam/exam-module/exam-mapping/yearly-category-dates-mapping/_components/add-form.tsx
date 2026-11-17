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
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof yearlyCategoryDatesMappingSchema.addOrUpdate>;

export default function AddYearlyCategoryDatesMapping({ onSuccess }: { onSuccess?: () => void }) {
    const orgId = 30;

    const methods = useForm<FormFields>({
        resolver: zodResolver(yearlyCategoryDatesMappingSchema.addOrUpdate),
        mode: 'all',
        defaultValues: {
            eyC_Id: 0,
            mI_Id: orgId,
            asmaY_Id: 0,
            emcA_Id: 0,
            eyC_ExamStartDate: '',
            eyC_ExamEndDate: '',
            eyC_MarksEntryLastDate: '',
            eyC_MarksProcessLastDate: '',
            eyC_MarksPublishDate: ''
        }
    });
    const { refetchAll } = useYearlyCategoryDateMapping();
    const { control, handleSubmit, reset, setValue, formState } = methods;
    const { isSubmitting } = formState;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [categories, setCategories] = useState<{ emcA_Id: number; emcA_CategoryName: string }[]>([]);
    const { data: academicYear, isLoading: academicYearLoading, error: academicYearError } = useAcademicYearDropdown();

    // Fetch academic years on mount
    useEffect(() => {
        // Academic Years
        if (academicYearError) {
            toast.error(academicYearError.message || 'Error fetching academic years');
        } else if (academicYear?.data && Array.isArray(academicYear.data)) {
            setValue('asmaY_Id', methods.watch('asmaY_Id') || 0);
        }
    }, [academicYear, academicYearError, setValue, methods.watch('asmaY_Id')]);
    // Watch selected Academic Year
    const selectedYearId = useWatch({
        control,
        name: 'asmaY_Id'
    });

    // Fetch categories whenever Academic Year changes
    useEffect(() => {
        if (!selectedYearId || Number(selectedYearId) === 0) {
            setCategories([]);
            return;
        }
        async function fetchCategories() {
            try {
                const { data: cats } = await getCategoryDropDownByAcademicYearlist(selectedYearId);
                setCategories(Array.isArray(cats) ? cats : []);
                setValue('emcA_Id', 0);
            } catch (err: any) {
                toast.error(err?.message);
            }
        }
        fetchCategories();
    }, [selectedYearId]);

    const onSubmit = async (data: FormFields) => {
        try {
            const res = await addOrUpdateYearlyCategoryDatesMapping(data);
            if (res?.success) {
                toast.success('Yearly category dates mapping saved successfully');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(res?.message ?? 'Save failed');
            }
        } catch (err: any) {
            toast.error(err?.message ?? 'Failed to save');
        }
    };
    const handleReset = () => {
        reset({
            asmaY_Id: 0,
            emcA_Id: 0,
            eyC_ExamStartDate: '',
            eyC_ExamEndDate: '',
            eyC_MarksEntryLastDate: '',
            eyC_MarksProcessLastDate: '',
            eyC_MarksPublishDate: ''
        });

        setCategories([]);
    };

    // Reusable DateField component

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
                                            key={field.value} // <— forces remount when value changes
                                            value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                            onValueChange={(val) => field.onChange(Number(val))}>
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
                                        //fromDate={today}
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
                                        fromDate={
                                            methods.watch('eyC_ExamEndDate') === '' ? today : new Date(methods.watch('eyC_ExamEndDate'))
                                        }
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
                                        fromDate={
                                            methods.watch('eyC_MarksProcessLastDate') === ''
                                                ? today
                                                : new Date(methods.watch('eyC_MarksProcessLastDate'))
                                        }
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
                                        <Select
                                            key={field.value} // <— forces remount when value changes
                                            value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                            onValueChange={(val) => field.onChange(Number(val))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Category' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cats) => (
                                                    <SelectItem key={cats.emcA_Id} value={String(cats.emcA_Id)}>
                                                        {cats.emcA_CategoryName}
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
                                        fromDate={
                                            methods.watch('eyC_ExamStartDate') === '' ? today : new Date(methods.watch('eyC_ExamStartDate'))
                                        }
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
                                        fromDate={
                                            methods.watch('eyC_MarksEntryLastDate') === ''
                                                ? today
                                                : new Date(methods.watch('eyC_MarksEntryLastDate'))
                                        }
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className='mt-4 flex justify-start gap-4'>
                        <Button type='submit' className='w-fit' disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                        <Button type='button' variant='outline' className='w-fit' onClick={handleReset}>
                            Reset
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}
