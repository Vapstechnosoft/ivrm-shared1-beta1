'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCoScholasticActivityAreaMapping } from '@/hooks/exam/exammodule/exam-mapping';
import {
    useCoScholasticActivityAreaDropDown,
    useCoScholasticActivityDropDown,
    useMasterGradeDropdownList
} from '@/hooks/exam/exammodule/usemasters';
// dropdown hooks
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { CoScholasticActivityAreaMappingSchema } from '@/schemas/exam/exam-module/exam-mapping';
import { addOrUpdateCoScholasticActivityAreaMapping } from '@/server/exam/exam-module/exam-mapping/co-scholastic-activitiy-area-mapping';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof CoScholasticActivityAreaMappingSchema.addOrUpdate>;
interface CoScholasticActivityAreaMappingFormProps {
    onSuccess?: () => void;
    className?: string;
    editData?: Partial<FormFields>;
}
export default function AddCoScholasticActivityAreaMapping({ onSuccess }: CoScholasticActivityAreaMappingFormProps) {
    const orgId = 30;
    const { refetchAll } = useCoScholasticActivityAreaMapping();
    const [grades, setGrades] = useState<{ emgR_Id: number; emgR_GradeName: string }[]>([]);
    const [activity, setActivity] = useState<{ ecacT_Id: number; ecacT_SkillName: string }[]>([]);
    const [activityArea, setActivityArea] = useState<{ ecactA_Id: number; ecactA_SkillArea: string }[]>([]);

    const { data: academicYear, isLoading: academicYearLoading, error: academicYearError } = useAcademicYearDropdown();
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    const { data: gradesData, isLoading: loadingGrades, error: gradesError } = useMasterGradeDropdownList();
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    const { data: areaData, isLoading: loadingArea, error: activityAreaError } = useCoScholasticActivityAreaDropDown();
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    const { data: activityData, isLoading: loadingActivity, error: activityError } = useCoScholasticActivityDropDown();

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
    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting }
    } = methods;

    const onSubmit = async (data: FormFields) => {
        try {
            const payload = {
                mI_Id: data.mI_Id,
                asmaY_Id: data.asmaY_Id,
                ecacT_Id: data.ecacT_Id, // ✅ add this
                ecactA_Id: data.ecactA_Id,
                ecactAAM_Id: data.ecactAAM_Id ?? 0,
                emgR_Id: data.emgR_Id,
                ecactaM_IndicatorDescription: data.ecactaM_IndicatorDescription ?? '',
                ecactaM_ActiveFlag: data.ecactaM_ActiveFlag
            };
            console.info('Submitting payload:', payload);
            const res = await addOrUpdateCoScholasticActivityAreaMapping(payload);

            if (res?.success) {
                toast.success(res?.message ?? 'Mapping saved successfully');
                reset();
                onSuccess?.();
                refetchAll?.();
            } else {
                toast.error(res?.message ?? 'Save failed');
            }
        } catch (err: any) {
            console.error('Submit error:', err);
            toast.error(err?.message ?? 'Failed to save');
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
                                        key={field.value}
                                        value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                        onValueChange={(val) => field.onChange(Number(val))}>
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
                                        key={field.value}
                                        value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                        onValueChange={(val) => field.onChange(Number(val))}>
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
                                        key={field.value}
                                        value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                        onValueChange={(val) => field.onChange(Number(val))}>
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
                        <Button type='submit' disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={() =>
                                reset({
                                    mI_Id: orgId,
                                    asmaY_Id: 0,
                                    ecacT_Id: 0,
                                    ecactA_Id: 0,
                                    ecactAAM_Id: 0,
                                    emgR_Id: 0,
                                    ecactaM_IndicatorDescription: '',
                                    ecactaM_ActiveFlag: true
                                })
                            }>
                            {' '}
                            Reset{' '}
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}
