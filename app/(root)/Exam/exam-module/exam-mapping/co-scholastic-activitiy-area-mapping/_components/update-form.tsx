'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown } from '@/hooks/admission/preadmission/useMasters';
import { useCoScholasticActivityAreaMapping } from '@/hooks/exam/exammodule/exam-mapping';
import {
    useCoScholasticActivityAreaDropDown,
    useCoScholasticActivityDropDown,
    useMasterGradeDropdownList
} from '@/hooks/exam/exammodule/usemasters';
import { CoScholasticActivityAreaMappingSchema } from '@/schemas/exam/exam-module/exam-mapping';
import { addOrUpdateCoScholasticActivityAreaMapping } from '@/server/exam/exam-module/exam-mapping/co-scholastic-activitiy-area-mapping';
import type { ICoScholasticActivityAreaMapping } from '@/types/exam/exam-module/exam-mapping';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof CoScholasticActivityAreaMappingSchema.addOrUpdate>;

interface UpdateCoScholasticActivityAreaMappingProps {
    rowData: ICoScholasticActivityAreaMapping;
    onSuccess?: () => void;
    onClose?: () => void;
}

export default function UpdateCoScholasticActivityAreaMapping({ rowData, onSuccess, onClose }: UpdateCoScholasticActivityAreaMappingProps) {
    const orgId = 30;

    // initialize form with schema but we'll reset with rowData once loaded
    const methods = useForm<FormFields>({
        resolver: zodResolver(CoScholasticActivityAreaMappingSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            mI_Id: orgId,
            asmaY_Id: 0,
            ecacT_Id: 0,
            ecactA_Id: 0,
            ecactAAM_Id: 0,
            emgR_Id: 0,
            ecactaM_IndicatorDescription: '',
            ecactaM_ActiveFlag: true
        }
    });

    const { refetchAll } = useCoScholasticActivityAreaMapping();
    const { control, handleSubmit, reset, formState } = methods;
    const { isSubmitting, errors } = formState;

    const { data: academicYear, isLoading: academicYearLoading, error: academicYearError } = useAcademicYearDropdown();
    const [grades, setGrades] = useState<{ emgR_Id: number; emgR_GradeName: string }[]>([]);
    const [activity, setActivity] = useState<{ ecacT_Id: number; ecacT_SkillName: string }[]>([]);
    const [activityArea, setActivityArea] = useState<{ ecactA_Id: number; ecactA_SkillArea: string }[]>([]);

    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    const { data: academicData, isLoading: loadingAcademic, error: academicError } = useAcademicYearDropdown();
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    const { data: gradesData, isLoading: loadingGrades, error: gradesError } = useMasterGradeDropdownList();
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    const { data: areaData, isLoading: loadingArea, error: activityAreaError } = useCoScholasticActivityAreaDropDown();
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    const { data: activityData, isLoading: loadingActivity, error: activityError } = useCoScholasticActivityDropDown();

    // Grades
    useEffect(() => {
        if (gradesError) {
            toast.error(gradesError.message || 'Error fetching grades');
            setGrades([]);
        } else if (gradesData?.data && Array.isArray(gradesData.data)) {
            const formattedGrades = gradesData.data.map((item: any) => ({
                emgR_Id: Number(item?.emgR_Id) || 0,
                emgR_GradeName: item?.emgR_GradeName?.toString() || ''
            }));
            setGrades(formattedGrades);
        } else {
            setGrades([]);
        }
    }, [gradesData, gradesError]);
    // Activity Area
    useEffect(() => {
        if (activityAreaError) {
            toast.error(activityAreaError.message || 'Error fetching Activity Areas');
            setActivityArea([]);
        } else if (areaData?.data && Array.isArray(areaData.data)) {
            const formattedActivityArea = areaData.data.map((item: any) => ({
                ecactA_Id: Number(item?.ecactA_Id) || 0,
                ecactA_SkillArea: item?.ecactA_SkillArea?.toString() || ''
            }));
            setActivityArea(formattedActivityArea);
        } else {
            setActivityArea([]);
        }
    }, [areaData, activityAreaError]);
    // Activity
    useEffect(() => {
        if (activityError) {
            toast.error(activityError.message || 'Error fetching Activities');
            setActivity([]);
        } else if (activityData?.data && Array.isArray(activityData.data)) {
            const formattedActivity = activityData.data.map((item: any) => ({
                ecacT_Id: Number(item?.ecacT_Id) || 0,
                ecacT_SkillName: item?.ecacT_SkillName?.toString() || ''
            }));
            setActivity(formattedActivity);
        } else {
            setActivity([]);
        }
    }, [activityData, activityError]);
    // --- NEW for Update: fetch existing exam-term rows using details hook and populate addedRows ---
    // This hook returns the rows related to the term (ect/ex rows)
    // --- FIXED: Proper reset trigger ---
    useEffect(() => {
        // Run only if dropdowns have loaded
        const allDropdownsLoaded = academicYear?.data
            ? academicYear.data.length
            : 0 && grades.length > 0 && activity.length > 0 && activityArea.length > 0;

        if (rowData && allDropdownsLoaded) {
            reset({
                ecacT_Id: rowData.ecacT_Id ?? 0,
                mI_Id: orgId,
                asmaY_Id: rowData.asmaY_Id ?? 0,
                ecactA_Id: rowData.ecactA_Id ?? 0,
                ecactaM_Id: rowData.ecactaM_Id ?? 0,
                ecactaM_IndicatorDescription: rowData.ecactaM_IndicatorDescription ?? '',
                emgR_Id: rowData.emgR_Id ?? 0,
                ecactaM_ActiveFlag: rowData.ecactaM_ActiveFlag ?? true
            });
        }
    }, [rowData, academicYear?.data ? academicYear.data.length : 0, grades.length, activity.length, activityArea.length, reset]);

    useEffect(() => {
        if (rowData) {
            reset({
                ecacT_Id: rowData.ecacT_Id ?? 0,
                mI_Id: orgId,
                asmaY_Id: rowData.asmaY_Id ?? 0,
                ecactA_Id: rowData.ecactA_Id ?? 0,
                ecactaM_Id: rowData.ecactaM_Id ?? 0,
                ecactaM_IndicatorDescription: rowData.ecactaM_IndicatorDescription ?? '',
                emgR_Id: rowData.emgR_Id ?? 0
            });
        }
    }, [rowData, reset]);

    const handleReset = () => {
        if (rowData) {
            reset({
                ecacT_Id: rowData.ecacT_Id ?? 0,
                mI_Id: orgId,
                asmaY_Id: rowData.asmaY_Id ?? 0,
                ecactA_Id: rowData.ecactA_Id ?? 0,
                ecactaM_Id: rowData.ecactaM_Id ?? 0,
                ecactaM_IndicatorDescription: rowData.ecactaM_IndicatorDescription ?? '',
                emgR_Id: rowData.emgR_Id ?? 0
            });
        }
    };
    // On final submit - update call (keeps same payload mapping you used in Add)
    const onSubmit = async (data: FormFields) => {
        await new Promise((resolve) => setTimeout(resolve, 0));

        if (Object.keys(errors).length > 0) {
            toast.error('Please fix form errors before submitting');
            return;
        }

        try {
            const payload = {
                ecacT_Id: data.ecacT_Id ?? 0,
                mI_Id: orgId,
                asmaY_Id: data.asmaY_Id ?? 0,
                ecactA_Id: data.ecactA_Id ?? 0,
                ecactaM_Id: data.ecactaM_Id ?? 0,
                ecactaM_IndicatorDescription: data.ecactaM_IndicatorDescription ?? '',
                emgR_Id: data.emgR_Id ?? 0,
                ecactaM_ActiveFlag: rowData.ecactaM_ActiveFlag ?? true
            };

            const res = await addOrUpdateCoScholasticActivityAreaMapping(payload);
            if (res?.success) {
                toast.success('Co-Scholastic Activity Area mapping updated successfully');
                onSuccess?.();
                onClose?.();
                refetchAll?.();
            } else {
                toast.error(res?.message ?? 'Update failed');
            }
        } catch (err: any) {
            console.error('Submit error:', err);
            toast.error(err?.message ?? 'Failed to update');
        }
    };

    return (
        <div className='flex w-full flex-col gap-6'>
            <FormProvider {...methods}>
                <form
                    onSubmit={handleSubmit(onSubmit, (errs) => {
                        const firstError = Object.values(errs)[0] as any;
                        toast.error(firstError?.message ?? 'Please fill all required fields');
                    })}
                    className='flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-md'
                    noValidate>
                    <div className='grid grid-cols-2 gap-6'>
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
                                        value={field.value ? String(field.value) : ''}
                                        onValueChange={(val) => field.onChange(val ? Number.parseInt(val) : undefined)}>
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
                        {/* Master Grade */}
                        <Controller
                            control={control}
                            name='emgR_Id'
                            render={({ field, fieldState }) => (
                                <div>
                                    <Label>
                                        Master Grade <span className='text-red-500'>*</span>
                                    </Label>
                                    <Select
                                        value={field.value ? String(field.value) : ''}
                                        onValueChange={(val) => field.onChange(val ? Number.parseInt(val) : undefined)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Grade' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {grades?.map((g) => (
                                                <SelectItem key={g.emgR_Id} value={String(g.emgR_Id)}>
                                                    {g.emgR_GradeName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                </div>
                            )}
                        />
                        {/* Activities Name */}
                        <Controller
                            control={control}
                            name='ecacT_Id'
                            render={({ field, fieldState }) => (
                                <div>
                                    <Label>
                                        Activities Name <span className='text-red-500'>*</span>
                                    </Label>
                                    <Select
                                        value={field.value ? String(field.value) : ''}
                                        onValueChange={(val) => field.onChange(val ? Number.parseInt(val) : undefined)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Activity' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {activity?.map((a) => (
                                                <SelectItem key={a.ecacT_Id} value={String(a.ecacT_Id)}>
                                                    {a.ecacT_SkillName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                </div>
                            )}
                        />

                        {/* Activities Area */}
                        <Controller
                            control={control}
                            name='ecactA_Id'
                            render={({ field, fieldState }) => (
                                <div>
                                    <Label>
                                        Activities Area <span className='text-red-500'>*</span>
                                    </Label>
                                    <Select
                                        value={field.value ? String(field.value) : ''}
                                        onValueChange={(val) => field.onChange(val ? Number.parseInt(val) : undefined)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Activity Area' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {activityArea?.map((a) => (
                                                <SelectItem key={a.ecactA_Id} value={String(a.ecactA_Id)}>
                                                    {a.ecactA_SkillArea}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                </div>
                            )}
                        />

                        {/* Indicators Description */}
                        <Controller
                            control={control}
                            name='ecactaM_IndicatorDescription'
                            render={({ field, fieldState }) => (
                                <div className='col-span-2'>
                                    <Label>Indicators Description</Label>
                                    <textarea
                                        {...field}
                                        value={field.value ?? ''} // ✅ ensure null becomes ""
                                        rows={4}
                                        className='w-full rounded-md border border-gray-300 bg-white p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                                        placeholder='Enter indicator description'
                                        maxLength={500}
                                    />
                                    {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                </div>
                            )}
                        />
                    </div>

                    <div className='flex w-fit gap-4'>
                        <Button
                            type='submit'
                            disabled={isSubmitting}
                            className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                            isLoading={isSubmitting}
                            loadingText='Saving...'>
                            <div className='flex items-center'>Update</div>
                        </Button>

                        <Button
                            type='button'
                            variant='outline'
                            onClick={handleReset}
                            disabled={isSubmitting}
                            className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                            Reset
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}
