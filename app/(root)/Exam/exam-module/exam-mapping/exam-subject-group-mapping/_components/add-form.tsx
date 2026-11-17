'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CustomMultiSelectBox } from '@/components/ui/custom-multiselect';
import { FormError, Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useExamSubjectGroupMapping } from '@/hooks/exam/exammodule/exam-mapping';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { ExamSubjectGroupSchema } from '@/schemas/exam/exam-module/exam-mapping';
import {
    addOrUpdateYearlyCategoryDatesMapping,
    getCategoryDropDowByExamYearCategoryList,
    getExamGroupsByCategory,
    getSubjectsForIndividualExam,
    getSubjectsForPromotionalExam
} from '@/server/exam/exam-module/exam-mapping/exam-subject-group-mapping';
import type { IESubject } from '@/types/exam/exam-module/exam-mapping';
import type { ICategory } from '@/types/exam/exam-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof ExamSubjectGroupSchema.addOrUpdate>;

export default function AddExamSubjectGroup({ mI_Id = 30, onSuccess }: { mI_Id?: number; onSuccess?: () => void }) {
    const methods = useForm<FormFields>({
        resolver: zodResolver(ExamSubjectGroupSchema.addOrUpdate),
        mode: 'all',
        defaultValues: {
            esG_Id: 0,
            mI_Id: mI_Id,
            asmaY_Id: 0,
            emcA_Id: 0,
            esG_SubjectGroupName: '',
            esG_ExamPromotionFlag: 'IE',
            emE_Id: 0,
            esG_GroupMinMarks: 0,
            esG_GroupMaxMarks: 0,
            esG_CompulsoryFlag: 'N',
            esG_ActiveFlag: true,
            subjects_list: []
        }
    });

    const { control, handleSubmit, reset, setValue, watch, formState } = methods;
    const { isSubmitting } = formState;
    const { refetchAll } = useExamSubjectGroupMapping();

    const [categories, setCategories] = useState<ICategory[]>([]);
    const [exams, setExams] = useState<{ emE_Id: number; emE_ExamName: string }[]>([]);
    const [subjects, setSubjects] = useState<IESubject[]>([]);
    const { data: academicYear, isLoading: academicYearLoading, error: academicYearError } = useAcademicYearDropdown();
    const esG_ExamPromotionFlag = useWatch({ control, name: 'esG_ExamPromotionFlag' });
    const asmaY_Id = useWatch({ control, name: 'asmaY_Id' });
    const emcA_Id = useWatch({ control, name: 'emcA_Id' });
    const emE_Id = useWatch({ control, name: 'emE_Id' });

    // Fetch Categories
    useEffect(() => {
        if (!asmaY_Id) return;
        async function fetchCategories() {
            try {
                const { data: response } = await getCategoryDropDowByExamYearCategoryList(asmaY_Id);
                setCategories((response ?? []) as ICategory[]);
                setValue('emcA_Id', 0);
            } catch (err: any) {
                toast.error(err?.message ?? 'Failed to load categories');
            }
        }
        fetchCategories();
    }, [asmaY_Id]);

    // Fetch Exams (for Individual Exam)
    useEffect(() => {
        if (!emcA_Id) return;
        async function fetchExams() {
            if (esG_ExamPromotionFlag === 'IE') {
                try {
                    const { data } = await getExamGroupsByCategory(asmaY_Id, emcA_Id);
                    setExams(data ?? []);
                    if (data && data.length === 0) toast.info('No exams found for this category');
                    setValue('emE_Id', 0);
                } catch (err: any) {
                    toast.error(err?.message ?? 'Failed to load exams');
                }
            }
        }
        fetchExams();
    }, [emcA_Id, esG_ExamPromotionFlag]);

    // Fetch Subjects
    useEffect(() => {
        async function fetchSubjects() {
            if (!emcA_Id || !asmaY_Id) return;
            try {
                if (esG_ExamPromotionFlag === 'IE') {
                    if (!emE_Id) return;
                    const { data: response } = await getSubjectsForIndividualExam(emE_Id, asmaY_Id, emcA_Id);
                    setSubjects((response ?? []) as IESubject[]);
                } else {
                    const { data } = await getSubjectsForPromotionalExam(asmaY_Id, emcA_Id);
                    setSubjects((data ?? []) as IESubject[]);
                    setValue('emE_Id', 0);
                }
            } catch (err: any) {
                toast.error(err?.message ?? 'Failed to load subjects');
            }
        }
        fetchSubjects();
    }, [emE_Id, emcA_Id, asmaY_Id, esG_ExamPromotionFlag]);

    const onSubmit = async (data: FormFields) => {
        try {
            // Ensure payload has mI_Id and esG_Id
            const payload = { ...data, mI_Id, esG_Id: data.esG_Id || 0 };
            const res = await addOrUpdateYearlyCategoryDatesMapping(payload);
            if (res?.success) {
                toast.success('Exam subject group saved successfully');
                reset();
                onSuccess?.();
                refetchAll();
            } else {
                toast.error(res?.message ?? 'Save failed');
            }
        } catch (err: any) {
            toast.error(err?.message ?? 'Failed to save');
        }
    };
    const handleReset = () => {
        reset();
        setSubjects([]);
        setExams([]);
        setCategories([]);
    };

    return (
        <div className='flex w-full flex-col gap-6'>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-md' noValidate>
                    <Tabs value={esG_ExamPromotionFlag} onValueChange={(val) => setValue('esG_ExamPromotionFlag', val as 'IE' | 'PE')}>
                        <TabsList className='mb-8 grid w-full max-w-md grid-cols-2'>
                            <TabsTrigger value='IE' className='data-[state=active]:bg-[#a937f0] data-[state=active]:text-white'>
                                Individual Exam
                            </TabsTrigger>
                            <TabsTrigger value='PE' className='data-[state=active]:bg-[#ae44f0] data-[state=active]:text-white'>
                                Promotional Exam
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value='IE'>
                            <div className='grid grid-cols-2 gap-6'>
                                <div className='space-y-4'>
                                    {/* Academic Year */}
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

                                    {/* Category */}
                                    <Controller
                                        control={control}
                                        name='emcA_Id'
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Label>
                                                    Exam Category <span className='text-red-500'>*</span>
                                                </Label>
                                                <Select
                                                    key={field.value}
                                                    value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                                    onValueChange={(val) => field.onChange(Number(val))}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select Category' />
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

                                    {/* Exam */}
                                    <Controller
                                        control={control}
                                        name='emE_Id'
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Label>
                                                    Exam <span className='text-red-500'>*</span>
                                                </Label>
                                                <Select
                                                    key={field.value} // <— forces remount when value changes
                                                    value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                                    onValueChange={(val) => field.onChange(Number(val))}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select Exam' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {exams.map((e) => (
                                                            <SelectItem key={e.emE_Id} value={String(e.emE_Id)}>
                                                                {e.emE_ExamName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </div>
                                        )}
                                    />

                                    {/* Group Name */}
                                    <Controller
                                        control={control}
                                        name='esG_SubjectGroupName'
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Label>
                                                    Group Name <span className='text-red-500'>*</span>
                                                </Label>
                                                <input
                                                    {...field}
                                                    className='w-full rounded-md border px-3 py-2'
                                                    placeholder='Enter Group Name'
                                                />
                                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </div>
                                        )}
                                    />
                                    {/* Min Marks */}
                                    <Controller
                                        control={control}
                                        name='esG_GroupMinMarks'
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Label>
                                                    Percentage <span className='text-red-500'>*</span>
                                                </Label>
                                                <input
                                                    type='number'
                                                    className='w-full rounded-md border px-3 py-2'
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        let val = e.target.value;

                                                        // Remove all leading zeros except for "0"
                                                        if (val.length > 1) {
                                                            val = val.replace(/^0+/, '');
                                                        }

                                                        // Update UI immediately
                                                        e.target.value = val;
                                                        field.onChange(val === '' ? 0 : Number(val));
                                                    }}
                                                />
                                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </div>
                                        )}
                                    />

                                    {/* Max Marks */}
                                    <Controller
                                        control={control}
                                        name='esG_GroupMaxMarks'
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Label>
                                                    Max Marks <span className='text-red-500'>*</span>
                                                </Label>
                                                <input
                                                    type='number'
                                                    className='w-full rounded-md border px-3 py-2'
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        let val = e.target.value;

                                                        if (val.length > 1) {
                                                            val = val.replace(/^0+/, '');
                                                        }

                                                        e.target.value = val;
                                                        field.onChange(val === '' ? 0 : Number(val));
                                                    }}
                                                />
                                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </div>
                                        )}
                                    />
                                </div>

                                {/* Right Side */}
                                <div className='space-y-4'>
                                    {/* Subjects */}
                                    <Controller
                                        control={control}
                                        name='subjects_list'
                                        render={({ field, fieldState }) => (
                                            <CustomMultiSelectBox
                                                label='Subjects'
                                                options={subjects.map((s) => ({ label: s.ismS_SubjectName, value: String(s.ismS_Id) }))}
                                                value={field.value?.map((v) => String(v.ismS_Id)) || []}
                                                onChange={(vals) => field.onChange(vals.map((id) => ({ ismS_Id: Number(id) })))}
                                                isSearchRequired
                                                height='220px'
                                                error={fieldState.error?.message}
                                                isRequired={true}
                                            />
                                        )}
                                    />

                                    {/* Compulsory */}
                                    <Controller
                                        control={control}
                                        name='esG_CompulsoryFlag'
                                        render={({ field }) => (
                                            <div className='flex items-center space-x-2'>
                                                <Checkbox
                                                    checked={field.value === 'Y'}
                                                    onCheckedChange={(checked) => field.onChange(checked ? 'Y' : 'N')}
                                                />
                                                <Label>Compulsory</Label>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        {/* Promotional Exam Tab */}
                        <TabsContent value='PE'>
                            <div className='grid grid-cols-2 gap-6'>
                                <div className='space-y-4'>
                                    <Controller
                                        control={control}
                                        name='asmaY_Id'
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Label>
                                                    Academic Year <span className='text-red-500'>*</span>
                                                </Label>
                                                <Select onValueChange={(val) => field.onChange(Number(val))}>
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

                                    {/* Exam Category */}
                                    <Controller
                                        control={control}
                                        name='emcA_Id'
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Label>
                                                    Exam Category <span className='text-red-500'>*</span>
                                                </Label>
                                                <Select onValueChange={(val) => field.onChange(Number(val))}>
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

                                    {/* Group Name */}
                                    <Controller
                                        control={control}
                                        name='esG_SubjectGroupName'
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Label>
                                                    Group Name <span className='text-red-500'>*</span>
                                                </Label>
                                                <input
                                                    {...field}
                                                    className='w-full rounded-md border px-3 py-2'
                                                    placeholder='Enter Group Name'
                                                />
                                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </div>
                                        )}
                                    />

                                    {/* Min Marks */}
                                    <Controller
                                        control={control}
                                        name='esG_GroupMinMarks'
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Label>
                                                    Min Marks <span className='text-red-500'>*</span>
                                                </Label>
                                                <input
                                                    type='number'
                                                    className='w-full rounded-md border px-3 py-2'
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        let val = e.target.value;

                                                        // Remove all leading zeros except for "0"
                                                        if (val.length > 1) {
                                                            val = val.replace(/^0+/, '');
                                                        }

                                                        // Update UI immediately
                                                        e.target.value = val;
                                                        field.onChange(val === '' ? 0 : Number(val));
                                                    }}
                                                />
                                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </div>
                                        )}
                                    />

                                    {/* Max Marks */}
                                    <Controller
                                        control={control}
                                        name='esG_GroupMaxMarks'
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Label>
                                                    Max Marks <span className='text-red-500'>*</span>
                                                </Label>
                                                <input
                                                    type='number'
                                                    className='w-full rounded-md border px-3 py-2'
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        let val = e.target.value;

                                                        // Remove all leading zeros except for "0"
                                                        if (val.length > 1) {
                                                            val = val.replace(/^0+/, '');
                                                        }

                                                        // Update UI immediately
                                                        e.target.value = val;
                                                        field.onChange(val === '' ? 0 : Number(val));
                                                    }}
                                                />
                                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </div>
                                        )}
                                    />
                                </div>

                                {/* Right Side */}
                                <div className='space-y-4'>
                                    {/* Subjects */}
                                    <Controller
                                        control={control}
                                        name='subjects_list'
                                        render={({ field, fieldState }) => (
                                            <CustomMultiSelectBox
                                                label='Subjects'
                                                options={subjects.map((s) => ({ label: s.ismS_SubjectName, value: String(s.ismS_Id) }))}
                                                value={field.value?.map((v) => String(v.ismS_Id)) || []}
                                                onChange={(vals) => field.onChange(vals.map((id) => ({ ismS_Id: Number(id) })))}
                                                isSearchRequired
                                                height='220px'
                                                error={fieldState.error?.message}
                                            />
                                        )}
                                    />

                                    {/* Compulsory */}
                                    <Controller
                                        control={control}
                                        name='esG_CompulsoryFlag'
                                        render={({ field }) => (
                                            <div className='flex items-center space-x-2'>
                                                <Checkbox
                                                    checked={field.value === 'Y'}
                                                    onCheckedChange={(checked) => field.onChange(checked ? 'Y' : 'N')}
                                                />
                                                <Label>Compulsory</Label>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className='mt-4 flex w-fit justify-start gap-4'>
                        <Button type='submit' disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                        <Button type='button' variant='outline' onClick={() => handleReset()}>
                            Reset
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}
