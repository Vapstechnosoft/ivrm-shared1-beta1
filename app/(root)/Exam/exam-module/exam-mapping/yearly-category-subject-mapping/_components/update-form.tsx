'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CustomMultiSelectBox } from '@/components/ui/custom-multiselect';
import { FormError, Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useYearlyCategorySubjectMapping } from '@/hooks/exam/exammodule/exam-mapping';
import { useMasterSubjectGroupDropdownList } from '@/hooks/exam/exammodule/usemasters';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { categorySubjectMappingSchema } from '@/schemas/exam/exam-module/exam-mapping';
import { getCategoryDropDownByAcademicYearlist } from '@/server/exam/exam-module/exam-mapping/yearly-category-dates-mapping';
import {
    addOrUpdateYearlyCategorySubjectMapping,
    getYearlyCategorySubjectMappingDetails
} from '@/server/exam/exam-module/exam-mapping/yearly-category-subject-mapping';
import { getMasterSubjectGroupDetails } from '@/server/exam/exam-module/masters/subject-group';
import type { IYearlyCategorySubjectMapping, IYearlyCategorySubjectMappingViewDetails } from '@/types/exam/exam-module/exam-mapping';
import { zodResolver } from '@hookform/resolvers/zod';
import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof categorySubjectMappingSchema.addOrUpdate>;

interface Props {
    rowData?: IYearlyCategorySubjectMapping; // contains existing record for edit
    onSuccess?: () => void;
}

export default function UpdateCategorySubjectMappingForm({ rowData, onSuccess }: Props) {
    const methods = useForm<FormFields>({
        resolver: zodResolver(categorySubjectMappingSchema.addOrUpdate),
        mode: 'all',
        defaultValues: {
            userId: 0,
            eycG_Id: rowData?.eycG_Id || 0,
            // mI_Id: 30,
            asmaY_Id: rowData?.asmaY_Id || 0,
            emcA_Id: rowData?.emcA_Id || 0,
            emG_Id: rowData?.emG_Id || 0,
            subjects_list: [],
            eyC_BasedOnPaperTypeFlg: rowData?.eyC_BasedOnPaperTypeFlg || false
        }
    });

    const { refetchAll } = useYearlyCategorySubjectMapping();
    const { control, handleSubmit, reset, setValue, formState } = methods;
    const { errors, isSubmitting } = formState;

    const [categories, setCategories] = useState<{ emcA_Id: number; emcA_CategoryName: string }[]>([]);
    const [subjectGroups, setSubjectGroups] = useState<{ emG_Id: number; emG_GroupName: string }[]>([]);
    const [subjects, setSubjects] = useState<{ ismS_Id: number; ismS_SubjectName: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingSubjects, setIsFetchingSubjects] = useState(false);

    const { data: academicYear, isLoading: academicYearLoading, error: academicYearError } = useAcademicYearDropdown();
    const { data: subjectGroupList, error: subjectGroupError } = useMasterSubjectGroupDropdownList();
    const academicYears = academicYear?.data ? academicYear.data : [];

    useEffect(() => {
        if (subjectGroupError) {
            toast.error(subjectGroupError.message || 'Error fetching subject groups');
            setSubjectGroups([]);
        } else if (subjectGroupList?.data && Array.isArray(subjectGroupList.data)) {
            setSubjectGroups(subjectGroupList.data);
        } else {
            setSubjectGroups([]);
        }
    }, [subjectGroupList, subjectGroupError]);

    // Watch Academic Year and Subject Group changes
    const selectedYearId = useWatch({ control, name: 'asmaY_Id' });
    const selectedGroupSubjectId = useWatch({ control, name: 'emG_Id' });

    // Fetch categories when academic year changes
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

    // Fetch subjects when group changes
    useEffect(() => {
        if (!selectedGroupSubjectId) return;
        async function fetchSubjects() {
            setIsFetchingSubjects(true);
            try {
                const { data: subj } = await getMasterSubjectGroupDetails(selectedGroupSubjectId);
                setSubjects(Array.isArray(subj) ? subj : []);
            } catch (err: any) {
                toast.error(err?.message ?? 'Failed to load subjects');
            } finally {
                setIsFetchingSubjects(false);
            }
        }
        fetchSubjects();
    }, [selectedGroupSubjectId]);

    // Prefill form when rowData is passed (update mode)
    useEffect(() => {
        if (!rowData) return;

        reset({
            userId: 1,
            eycG_Id: rowData.eycG_Id ?? 0,
            // mI_Id: 30,
            asmaY_Id: rowData.asmaY_Id ?? 0,
            emcA_Id: rowData.emcA_Id ?? 0,
            emG_Id: rowData.emG_Id ?? 0,
            eyC_BasedOnPaperTypeFlg: rowData.eyC_BasedOnPaperTypeFlg ?? false
        });

        // Fetch subjects for the selected group on load
        if (rowData.emG_Id) {
            (async () => {
                setIsLoading(true);
                try {
                    const response = await getYearlyCategorySubjectMappingDetails(rowData.eyC_Id, rowData.eycG_Id, rowData.asmaY_Id);

                    const apiResponse = response as unknown as {
                        success: boolean;
                        message: string;
                        data: IYearlyCategorySubjectMappingViewDetails[];
                    };

                    const data = apiResponse?.data || [];
                    setValue('subjects_list', data);
                } catch (error) {
                    console.error('Failed to fetch subjects:', error);
                    toast.error('Failed to load subjects details');
                } finally {
                    setIsLoading(false);
                }
            })();
        }
    }, [rowData, categories]);

    useEffect(() => {
        if (!rowData || !rowData.asmaY_Id || academicYears.length === 0) return;

        const matchingYear = academicYears.find((y) => y.asmaY_Id === rowData.asmaY_Id);

        if (matchingYear) {
            setValue('asmaY_Id', matchingYear.asmaY_Id, {
                shouldValidate: true,
                shouldDirty: false,
                shouldTouch: false
            });
        }
    }, [academicYears, rowData, setValue]);

    useEffect(() => {
        if (!rowData || !rowData.emG_Id || subjectGroups.length === 0) return;

        const matchingSubGroup = subjectGroups.find((y) => y.emG_Id === rowData.emG_Id);
        if (matchingSubGroup) {
            setValue('emG_Id', matchingSubGroup.emG_Id, {
                shouldValidate: true,
                shouldDirty: false,
                shouldTouch: false
            });
        }
    }, [academicYears, rowData, setValue]);

    const onSubmit = async (data: FormFields) => {
        try {
            const res = await addOrUpdateYearlyCategorySubjectMapping(data);
            if (res?.success) {
                toast.success('Mapping saved successfully');
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
    const handlereset = () => {
        if (!rowData) return;
        reset({
            userId: 1,
            eycG_Id: rowData.eycG_Id ?? 0,
            // mI_Id: 30,
            asmaY_Id: rowData.asmaY_Id ?? 0,
            emcA_Id: rowData.emcA_Id ?? 0,
            emG_Id: rowData.emG_Id ?? 0,
            eyC_BasedOnPaperTypeFlg: rowData.eyC_BasedOnPaperTypeFlg ?? false,
            subjects_list: []
        });
        // Fetch subjects for the selected group on load
        if (rowData.emG_Id && rowData.asmaY_Id && rowData.eycG_Id) {
            (async () => {
                setIsLoading(true);
                try {
                    const response = await getYearlyCategorySubjectMappingDetails(rowData.eyC_Id, rowData.eycG_Id, rowData.asmaY_Id);

                    const apiResponse = response as unknown as {
                        success: boolean;
                        message: string;
                        data: IYearlyCategorySubjectMappingViewDetails[];
                    };

                    const data = apiResponse?.data || [];
                    setValue('subjects_list', data);
                } finally {
                    setIsLoading(false);
                }
            })();
        }
    };

    return (
        isLoading || isFetchingSubjects ? (
            <div className='flex h-64 items-center justify-center'>
                <div className='text-center'>
                    <RefreshCw className='mx-auto h-8 w-8 animate-spin text-secondary' />
                    <p className='mt-2 text-gray-600 text-sm'>Loading data...</p>
                </div>
            </div>
        ) : (
            <div className='flex w-full flex-col gap-6'>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-md' noValidate>
                        <div className='grid grid-cols-2 gap-6'>
                            <div className='grid grid-rows-2 gap-3'>
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

                                {/* Category */}
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
                                                    {categories.map((cat) => (
                                                        <SelectItem key={cat.emcA_Id} value={String(cat.emcA_Id)}>
                                                            {cat.emcA_CategoryName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </div>
                                    )}
                                />

                                {/* Subject Group */}
                                <Controller
                                    control={control}
                                    name='emG_Id'
                                    render={({ field, fieldState }) => (
                                        <div>
                                            <Label>
                                                Subject Group <span className='text-red-500'>*</span>
                                            </Label>
                                            <Select
                                                key={field.value} // <— forces remount when value changes
                                                value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                                onValueChange={(val) => field.onChange(Number(val))}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select Subject Group' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {subjectGroups.map((g) => (
                                                        <SelectItem key={g.emG_Id} value={String(g.emG_Id)}>
                                                            {g.emG_GroupName}
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
                                    name='eyC_BasedOnPaperTypeFlg'
                                    render={({ field }) => {
                                        const checkboxId = 'eyc_based_on_paper_type_flag';

                                        return (
                                            <div className='flex items-center space-x-2'>
                                                <Checkbox
                                                    id={checkboxId}
                                                    checked={field.value}
                                                    onCheckedChange={(checked) => field.onChange(!!checked)}
                                                />

                                                <label htmlFor={checkboxId} className='cursor-pointer font-medium text-sm leading-none'>
                                                    Based on Paper Type
                                                </label>
                                            </div>
                                        );
                                    }}
                                />
                            </div>

                            {/* Subject List */}
                            <div>
                                <Controller
                                    control={control}
                                    name='subjects_list'
                                    render={({ field }) => (
                                        <CustomMultiSelectBox
                                            options={subjects.map((subj) => ({
                                                label: subj.ismS_SubjectName,
                                                value: subj.ismS_Id.toString()
                                            }))}
                                            onChange={(selectedValues) => {
                                                const selected = subjects.filter((s) => selectedValues.includes(s.ismS_Id.toString()));
                                                field.onChange(selected);
                                            }}
                                            value={field.value.map((s: any) => s.ismS_Id.toString())}
                                            label='Subjects'
                                            height='200px'
                                            isSearchRequired={true}
                                            error={errors.subjects_list?.message}
                                            isRequired={true}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className='mt-4 flex justify-start gap-4'>
                            <Button type='submit' className='w-fit' disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : rowData ? 'Update' : 'Save'}
                            </Button>
                            <Button type='button' variant='outline' className='w-fit' onClick={handlereset}>
                                Reset
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        )
    );
}
