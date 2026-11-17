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
    getCategoryDropDownByAcademicYearlist,
    getExamGroupsByCategory,
    getExamSubjectGroupMappingDetails,
    getSubjectsForIndividualExam,
    getSubjectsForPromotionalExam
} from '@/server/exam/exam-module/exam-mapping/exam-subject-group-mapping';
import type { IESubject, IExamSubjectGroupMapping, IExamSubjectGroupingDetails } from '@/types/exam/exam-module/exam-mapping';
import type { ICategory } from '@/types/exam/exam-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof ExamSubjectGroupSchema.addOrUpdate>;

interface EditExamSubjectGroupProps {
    mI_Id?: number;
    selectedRow: IExamSubjectGroupMapping;
    onSuccess?: () => void;
}

export default function UpdateExamSubjectGroup({ mI_Id = 30, selectedRow, onSuccess }: EditExamSubjectGroupProps) {
    const methods = useForm<FormFields>({
        resolver: zodResolver(ExamSubjectGroupSchema.addOrUpdate),
        mode: 'all',
        defaultValues: {
            esG_Id: 0,
            mI_Id: mI_Id,
            asmaY_Id: 0,
            emcA_Id: 0,
            esG_SubjectGroupName: '',
            esG_ExamPromotionFlag: selectedRow.esG_ExamPromotionFlag ?? 'IE',
            emE_Id: 0,
            esG_GroupMinMarks: 0,
            esG_GroupMaxMarks: 0,
            esG_CompulsoryFlag: 'N',
            esG_ActiveFlag: true,
            subjects_list: []
        }
    });

    const { control, handleSubmit, reset, setValue, trigger, formState } = methods;
    const { isSubmitting } = formState;
    const { refetchAll } = useExamSubjectGroupMapping();
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [exams, setExams] = useState<{ emE_Id: number; emE_ExamName: string }[]>([]);
    const [subjects, setSubjects] = useState<IESubject[]>([]);
    const [detail, setDetail] = useState<IExamSubjectGroupingDetails | null>(null);

    const { data: academicYear, isLoading: academicYearLoading, error: academicYearError } = useAcademicYearDropdown();

    const esG_ExamPromotionFlag = useWatch({ control, name: 'esG_ExamPromotionFlag' });
    const asmaY_Id = useWatch({ control, name: 'asmaY_Id' });
    const emcA_Id = useWatch({ control, name: 'emcA_Id' });
    const emE_Id = useWatch({ control, name: 'emE_Id' });

    // Step 2: Load Mapping Details + Pre-fill
    useEffect(() => {
        if (!selectedRow) return;
        const loadDetails = async () => {
            try {
                const res = await getExamSubjectGroupMappingDetails(
                    selectedRow.esG_CompulsoryFlag,
                    selectedRow.asmaY_Id,
                    selectedRow.esG_Id
                );

                const list = Array.isArray(res?.data) ? res.data : [];
                if (list.length === 0) return;

                const first = list[0];
                setDetail(first);
                // Set all known values
                setValue('asmaY_Id', first.asmaY_Id);
                setValue('emcA_Id', first.emcA_Id);
                setValue('emE_Id', first.emE_Id);
                setValue('esG_SubjectGroupName', first.esG_SubjectGroupName);
                setValue('esG_GroupMinMarks', first.esG_GroupMinMarks);
                setValue('esG_GroupMaxMarks', first.esG_GroupMaxMarks);
                setValue('esG_CompulsoryFlag', first.esG_CompulsoryFlag);
                setValue('esG_ExamPromotionFlag', selectedRow.esG_ExamPromotionFlag);

                // Subjects
                const mappedSubjects = list.map((s: any) => ({ ismS_Id: s.ismS_Id }));
                setValue('subjects_list', mappedSubjects);
                // Trigger re-render for Selects
                setTimeout(() => {
                    trigger(['asmaY_Id', 'emcA_Id', 'emE_Id']);
                }, 0);
            } catch (err: any) {
                toast.error('Failed to load group details');
            }
        };

        loadDetails();
    }, [selectedRow, mI_Id, setValue, trigger]);

    // Step 3: Load Categories when Academic Year is set
    useEffect(() => {
        if (!asmaY_Id || !detail) return;

        const loadCategories = async () => {
            try {
                const { data } = await getCategoryDropDownByAcademicYearlist(asmaY_Id);
                const cats = Array.isArray(data) ? data : [];
                setCategories(cats);

                // Re-select category after loading
                const matched = cats.find((c: any) => c.emcA_Id === detail.emcA_Id);
                if (matched) {
                    setValue('emcA_Id', matched.emcA_Id, {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true
                    });
                    setTimeout(() => trigger('emcA_Id'), 0);
                }
            } catch (err: any) {
                toast.error('Failed to load categories');
            }
        };

        loadCategories();
    }, [asmaY_Id, detail, mI_Id, setValue, trigger]);

    // Step 4: Load Exams (Individual Exam only)
    useEffect(() => {
        if (!emcA_Id || esG_ExamPromotionFlag !== 'IE' || !detail) return;

        const loadExams = async () => {
            try {
                const { data } = await getExamGroupsByCategory(asmaY_Id, emcA_Id);
                const examList = Array.isArray(data) ? data : [];
                setExams(examList);
                setValue('emcA_Id', detail.emcA_Id, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true
                });

                const matched = examList.find((e: any) => e.emE_Id === detail.emE_Id);
                if (matched) {
                    setValue('emE_Id', matched.emE_Id, {
                        shouldTouch: true,
                        shouldDirty: true
                    });
                    setTimeout(() => trigger('emE_Id'), 0);
                }
            } catch (err: any) {
                toast.error('Failed to load exams');
            }
        };

        loadExams();
    }, [emcA_Id, esG_ExamPromotionFlag, asmaY_Id, detail, setValue, trigger]);

    // Step 5: Load Subjects
    useEffect(() => {
        if (!emcA_Id || !asmaY_Id) return;

        const loadSubjects = async () => {
            if (asmaY_Id === 0 || emcA_Id === 0) return;
            try {
                if (esG_ExamPromotionFlag === 'IE') {
                    if (!emE_Id) return;
                    const response = await getSubjectsForIndividualExam(emE_Id, asmaY_Id, emcA_Id);
                    setSubjects((response?.data || []) as IESubject[]);
                } else {
                    const response_ = await getSubjectsForPromotionalExam(asmaY_Id, emcA_Id);
                    setSubjects((response_?.data || []) as IESubject[]);
                }
            } catch (err: any) {
                toast.error('Failed to load subjects');
            }
        };

        loadSubjects();
    }, [emE_Id, emcA_Id, asmaY_Id, esG_ExamPromotionFlag, mI_Id]);

    const onSubmit = async (data: FormFields) => {
        try {
            const payload = { ...data, mI_Id, esG_Id: selectedRow.esG_Id || 0 };
            const res = await addOrUpdateYearlyCategoryDatesMapping(payload);
            if (res?.success) {
                toast.success('Updated successfully');
                onSuccess?.();
                refetchAll();
            } else {
                toast.error(res?.message || 'Update failed');
            }
        } catch (err: any) {
            toast.error(err?.message || 'Something went wrong');
        }
    };

    return (
        <div className='flex w-full flex-col gap-6'>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-md' noValidate>
                    <Tabs value={esG_ExamPromotionFlag} onValueChange={(v) => setValue('esG_ExamPromotionFlag', v as 'IE' | 'PE')}>
                        <TabsList className='mb-8 grid w-full max-w-md grid-cols-2'>
                            <TabsTrigger value='IE'>Individual Exam</TabsTrigger>
                            <TabsTrigger value='PE'>Promotional Exam</TabsTrigger>
                        </TabsList>

                        <TabsContent value='IE' className='mt-6'>
                            <div className='grid grid-cols-2 gap-8'>
                                <div className='space-y-5'>
                                    <Controller
                                        name='asmaY_Id'
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Label>
                                                    Academic Year <span className='text-red-500'>*</span>
                                                </Label>
                                                <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select Year' />
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
                                        name='emcA_Id'
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Label>
                                                    Exam Category <span className='text-red-500'>*</span>
                                                </Label>
                                                <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
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
                                        name='emE_Id'
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Label>
                                                    Exam <span className='text-red-500'>*</span>
                                                </Label>
                                                <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
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

                                    <Controller
                                        name='esG_SubjectGroupName'
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Label>
                                                    Group Name <span className='text-red-500'>*</span>
                                                </Label>
                                                <input {...field} className='w-full rounded-md border px-3 py-2' placeholder='Enter name' />
                                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </div>
                                        )}
                                    />

                                    <Controller
                                        name='esG_GroupMinMarks'
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Label>
                                                    Min Marks <span className='text-red-500'>*</span>
                                                </Label>
                                                <input
                                                    type='number'
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                    className='w-full rounded-md border px-3 py-2'
                                                />
                                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </div>
                                        )}
                                    />

                                    <Controller
                                        name='esG_GroupMaxMarks'
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Label>
                                                    Max Marks <span className='text-red-500'>*</span>
                                                </Label>
                                                <input
                                                    type='number'
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                    className='w-full rounded-md border px-3 py-2'
                                                />
                                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </div>
                                        )}
                                    />
                                </div>

                                <div className='space-y-5'>
                                    <Controller
                                        name='subjects_list'
                                        render={({ field, fieldState }) => (
                                            <CustomMultiSelectBox
                                                label='Subjects'
                                                options={subjects.map((s) => ({ label: s.ismS_SubjectName, value: String(s.ismS_Id) }))}
                                                value={field.value?.map((s: { ismS_Id: any }) => String(s.ismS_Id)) || []}
                                                onChange={(vals) => field.onChange(vals.map((id) => ({ ismS_Id: Number(id) })))}
                                                isSearchRequired
                                                height='220px'
                                                error={fieldState.error?.message}
                                                isRequired={true}
                                            />
                                        )}
                                    />

                                    <Controller
                                        name='esG_CompulsoryFlag'
                                        render={({ field }) => (
                                            <div className='flex items-center gap-3'>
                                                <Checkbox
                                                    checked={field.value === 'Y'}
                                                    onCheckedChange={(c) => field.onChange(c ? 'Y' : 'N')}
                                                />
                                                <Label>Compulsory Group</Label>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value='PE'>
                            <div className='grid grid-cols-2 gap-8'>
                                <div className='space-y-5'>
                                    <Controller
                                        name='asmaY_Id'
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Label>
                                                    Academic Year <span className='text-red-500'>*</span>
                                                </Label>
                                                <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select Year' />
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
                                        name='emcA_Id'
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Label>
                                                    Exam Category <span className='text-red-500'>*</span>
                                                </Label>
                                                <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
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
                                        name='esG_SubjectGroupName'
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Label>
                                                    Group Name <span className='text-red-500'>*</span>
                                                </Label>
                                                <input {...field} className='w-full rounded-md border px-3 py-2' placeholder='Enter name' />
                                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </div>
                                        )}
                                    />

                                    <Controller
                                        name='esG_GroupMinMarks'
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Label>
                                                    Min Marks <span className='text-red-500'>*</span>
                                                </Label>
                                                <input
                                                    type='number'
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                    className='w-full rounded-md border px-3 py-2'
                                                />
                                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </div>
                                        )}
                                    />

                                    <Controller
                                        name='esG_GroupMaxMarks'
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Label>
                                                    Max Marks <span className='text-red-500'>*</span>
                                                </Label>
                                                <input
                                                    type='number'
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                    className='w-full rounded-md border px-3 py-2'
                                                />
                                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </div>
                                        )}
                                    />
                                </div>

                                <div className='space-y-5'>
                                    <Controller
                                        name='subjects_list'
                                        render={({ field, fieldState }) => (
                                            <CustomMultiSelectBox
                                                label='Subjects'
                                                options={subjects.map((s) => ({ label: s.ismS_SubjectName, value: String(s.ismS_Id) }))}
                                                value={field.value?.map((s: { ismS_Id: any }) => String(s.ismS_Id)) || []}
                                                onChange={(vals) => field.onChange(vals.map((id) => ({ ismS_Id: Number(id) })))}
                                                isSearchRequired
                                                height='220px'
                                                error={fieldState.error?.message}
                                            />
                                        )}
                                    />

                                    <Controller
                                        name='esG_CompulsoryFlag'
                                        render={({ field }) => (
                                            <div className='flex items-center gap-3'>
                                                <Checkbox
                                                    checked={field.value === 'Y'}
                                                    onCheckedChange={(c) => field.onChange(c ? 'Y' : 'N')}
                                                />
                                                <Label>Compulsory Group</Label>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className='mt-6 flex gap-3'>
                        <Button type='submit' disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Update Group'}
                        </Button>
                        <Button type='button' variant='outline' onClick={() => reset()}>
                            Reset
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}
