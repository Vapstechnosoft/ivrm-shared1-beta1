'use client';

import { Button } from '@/components/ui/button';
import { DateField } from '@/components/ui/dateField';
import { FormError, Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { examMarksProcessConditionSchema } from '@/schemas/exam/exam-module/exam-mapping';
import { addOrUpdateExamMarksProcessCondition } from '@/server/exam/exam-module/exam-mapping/exam-marks-process-condition';
import { getCategoryDropDowByExamYearCategoryList } from '@/server/exam/exam-module/exam-mapping/exam-subject-group-mapping';
import { getExamsByCategoryandAcademicYear } from '@/server/exam/exam-module/masters/exam';
import type { ICategory } from '@/types/exam/exam-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof examMarksProcessConditionSchema.addOrUpdate>;

export default function AddExamMarksProcessCondition({ onSuccess }: { onSuccess?: () => void }) {
    const orgId = 30;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const methods = useForm<FormFields>({
        resolver: zodResolver(examMarksProcessConditionSchema.addOrUpdate),
        mode: 'all',
        defaultValues: {
            mI_Id: orgId,
            asmaY_Id: 0,
            emE_Id: 0,
            eyC_Id: 1,
            eycE_Id: 1,
            eycE_ExamStartDate: '',
            eycE_ExamEndDate: '',
            eycE_MarksEntryLastDate: '',
            eycE_MarksProcessLastDate: '',
            eycE_MarksPublishDate: '',
            emcA_Id: 0
        }
    });

    const { control, handleSubmit, reset, setValue, formState } = methods;
    const { isSubmitting } = formState;

    const { data: academicYear, isLoading: academicYearLoading, error: academicYearError } = useAcademicYearDropdown();

    // categories and exams
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [exams, setExams] = useState<{ emE_Id: number; emE_ExamName: string }[]>([]);

    // When academic year changes -> load categories
    const selectedYearId = useWatch({ control, name: 'asmaY_Id' });
    useEffect(() => {
        if (!selectedYearId || Number(selectedYearId) === 0) {
            setCategories([]);
            setValue('emcA_Id', 0);
            setExams([]);
            setValue('emE_Id', 0);
            return;
        }

        (async () => {
            try {
                const { data: cats } = await getCategoryDropDowByExamYearCategoryList(Number(selectedYearId));
                setCategories(Array.isArray(cats) ? cats : []);
                // reset selected category & exams
                setValue('emcA_Id', 0);
                setExams([]);
                setValue('emE_Id', 0);
            } catch (err: any) {
                toast.error(err?.message ?? 'Failed to load categories');
                setCategories([]);
            }
        })();
    }, [selectedYearId, setValue]);

    // When category (eyC_Id or emcA_Id) changes -> load exams
    const selectedCategoryId = useWatch({ control, name: 'emcA_Id' });
    useEffect(() => {
        if (!selectedCategoryId || Number(selectedCategoryId) === 0) {
            setExams([]);
            setValue('emE_Id', 0);
            return;
        }

        (async () => {
            try {
                // server helper to fetch exam list for category (I added this helper in server file)
                const { data: ex } = await getExamsByCategoryandAcademicYear(Number(selectedYearId), Number(selectedCategoryId));
                setExams(Array.isArray(ex) ? ex : []);
                setValue('emE_Id', 0);
            } catch (err: any) {
                toast.error(err?.message ?? 'Failed to load exams');
                setExams([]);
            }
        })();
    }, [selectedCategoryId, setValue]);

    const onSubmit = async (payload: FormFields) => {
        try {
            const res = await addOrUpdateExamMarksProcessCondition(payload);
            if (res?.success) {
                toast.success(res.message ?? 'Saved successfully');
                reset(); // reset shows placeholders and empty selects
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
            mI_Id: orgId,
            asmaY_Id: 0,
            emE_Id: 0,
            eycE_ExamStartDate: '',
            eycE_ExamEndDate: '',
            eycE_MarksEntryLastDate: '',
            eycE_MarksProcessLastDate: '',
            eycE_MarksPublishDate: '',
            emcA_Id: 0
        });
        setCategories([]);
        setExams([]);
    };

    // Render
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
                                            key={field.value}
                                            value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                            onValueChange={(val) => field.onChange(Number(val))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='--Select--' />
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
                                name='eycE_ExamStartDate'
                                render={({ field, fieldState }) => (
                                    <DateField
                                        field={field}
                                        fieldState={fieldState}
                                        label='Exam Start Date'
                                        placeholder='Select Exam Start Date'
                                        fromDate={today}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name='eycE_MarksEntryLastDate'
                                render={({ field, fieldState }) => (
                                    <DateField
                                        field={field}
                                        fieldState={fieldState}
                                        label='Marks Entry Last Date'
                                        placeholder='Select Marks Entry Last Date'
                                        fromDate={
                                            methods.watch('eycE_ExamEndDate') === '' ? today : new Date(methods.watch('eycE_ExamEndDate'))
                                        }
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name='eycE_MarksPublishDate'
                                render={({ field, fieldState }) => (
                                    <DateField
                                        field={field}
                                        fieldState={fieldState}
                                        label='Marks Publish Date'
                                        placeholder='Select Marks Publish Date'
                                        fromDate={
                                            methods.watch('eycE_MarksProcessLastDate') === ''
                                                ? today
                                                : new Date(methods.watch('eycE_MarksProcessLastDate'))
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
                                            key={field.value}
                                            value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                            onValueChange={(val) => {
                                                const selectedCategoryId = Number(val);
                                                const selectedCategory = categories.find((c) => c.emcA_Id === selectedCategoryId);
                                                if (selectedCategory) {
                                                    setValue('eyC_Id', selectedCategory.eyC_Id);
                                                }
                                                field.onChange(selectedCategoryId);
                                            }}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='--Select--' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((c) => (
                                                    <SelectItem key={c.eyC_Id} value={String(c.emcA_Id)}>
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
                                name='eycE_ExamEndDate'
                                render={({ field, fieldState }) => (
                                    <DateField
                                        field={field}
                                        fieldState={fieldState}
                                        label='Exam End Date'
                                        placeholder='Select Exam End Date'
                                        fromDate={
                                            methods.watch('eycE_ExamStartDate') === ''
                                                ? today
                                                : new Date(methods.watch('eycE_ExamStartDate'))
                                        }
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name='eycE_MarksProcessLastDate'
                                render={({ field, fieldState }) => (
                                    <DateField
                                        field={field}
                                        fieldState={fieldState}
                                        label='Marks Process Last Date'
                                        placeholder='Select Marks Process Last Date'
                                        fromDate={
                                            methods.watch('eycE_MarksEntryLastDate') === ''
                                                ? today
                                                : new Date(methods.watch('eycE_MarksEntryLastDate'))
                                        }
                                    />
                                )}
                            />

                            {/* Exam select - populated when category selected */}
                            <Controller
                                control={control}
                                name='emE_Id'
                                render={({ field, fieldState }) => (
                                    <div className='mt-4'>
                                        <Label>
                                            Exam <span className='text-red-500'>*</span>
                                        </Label>
                                        <Select
                                            key={field.value}
                                            value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                            onValueChange={(val) => field.onChange(Number(val))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='--Select--' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {exams.length === 0 ? (
                                                    <SelectItem value='0' disabled>
                                                        No exams found
                                                    </SelectItem>
                                                ) : (
                                                    exams.map((e) => (
                                                        <SelectItem key={e.emE_Id} value={String(e.emE_Id)}>
                                                            {e.emE_ExamName}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                    </div>
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
