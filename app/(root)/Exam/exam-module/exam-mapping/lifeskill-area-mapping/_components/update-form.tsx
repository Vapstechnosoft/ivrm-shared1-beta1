'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useMasterGradeDropdownList,
    useMasterLifeSkillArea,
    useMasterLifeSkillAreaMapping,
    useMasterLifeSkills
} from '@/hooks/exam/exammodule/usemasters';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { lifeSkillAreaMappingSchema } from '@/schemas/exam/exam-module/exam-mapping';
import { addOrUpdateMasterLifeSkillMapping } from '@/server/exam/exam-module/masters/life-skills';
import type { ILifeSkillAreaMapping } from '@/types/exam/exam-module/exam-mapping';
import type { ILifeSkill, ILifeSkillArea, IMasterGrade } from '@/types/exam/exam-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { DataTableSkeleton } from '@/components/ui/view-data-table/view-data-table-skeleton';

type FormFields = z.infer<typeof lifeSkillAreaMappingSchema.addOrUpdate>;

interface UpdateLifeSkillAreaMappingProps {
    rowData: ILifeSkillAreaMapping;
    onSuccess?: () => void;
}

export default function UpdateLifeSkillAreaMapping({ rowData, onSuccess }: UpdateLifeSkillAreaMappingProps) {
    const orgId = 30;
    const { refetchAll } = useMasterLifeSkillAreaMapping();
    const [lifeSkills, setLifeSkills] = useState<ILifeSkill[]>([]);
    const [lifeSkillAreas, setLifeSkillAreas] = useState<ILifeSkillArea[]>([]);
    const [grades, setGrades] = useState<IMasterGrade[]>([]);
    const [isDataBound, setIsDataBound] = useState(false);

    const { data: academicYear, isLoading: academicYearLoading, error: academicYearError } = useAcademicYearDropdown();
    const academicYears = academicYear?.data ? academicYear.data : [];
    const { data: lifeSkillData, error: lifeSkillError } = useMasterLifeSkills();
    const { data: lifeSkillAreaData, error: areaError } = useMasterLifeSkillArea();
    const { data: masterGradeData, error: masterGradeError } = useMasterGradeDropdownList();

    const methods = useForm<FormFields>({
        resolver: zodResolver(lifeSkillAreaMappingSchema.addOrUpdate),
        mode: 'onChange'
    });

    const { control, handleSubmit, reset, formState } = methods;
    const { isSubmitting, errors } = formState;

    // Load dropdown data
    useEffect(() => {
        // Life Skills
        if (lifeSkillData?.data) {
            const skills = Array.isArray(lifeSkillData.data) ? lifeSkillData.data : [lifeSkillData.data];
            setLifeSkills(skills);
        }
        if (lifeSkillError) toast.error('Failed to load Life Skills');

        // Skill Areas
        if (lifeSkillAreaData?.data) {
            const areas = Array.isArray(lifeSkillAreaData.data) ? lifeSkillAreaData.data : [lifeSkillAreaData.data];
            setLifeSkillAreas(areas);
        }
        if (areaError) toast.error('Failed to load Skill Areas');

        // Grades
        if (masterGradeData?.data) {
            const gradeList = Array.isArray(masterGradeData.data) ? masterGradeData.data : [masterGradeData.data];
            setGrades(gradeList);
        }
        if (masterGradeError) toast.error('Failed to load Grades');
    }, [lifeSkillData, lifeSkillAreaData, masterGradeData, academicYearError, lifeSkillError, areaError, masterGradeError]);

    // Reset only after dropdowns loaded
    const dropdownsReady = useMemo(
        () => academicYears.length > 0 && lifeSkills.length > 0 && lifeSkillAreas.length > 0 && grades.length > 0,
        [academicYears, lifeSkills, lifeSkillAreas, grades]
    );

    useEffect(() => {
        if (rowData && dropdownsReady) {
            reset({
                ecS_Id: rowData.ecS_Id ?? 0,
                mI_Id: orgId,
                ecS_SkillName: rowData.ecS_SkillName ?? 'Default Skill Name',
                ecS_SkillCode: 'CODE01',
                subexamDTO: [
                    {
                        ecsA_Id: rowData.ecsA_Id ?? 0,
                        ecsA_SkillOrder: 1,
                        ecsA_SkillArea: rowData.ecsA_SkillArea ?? 'Default Area'
                    }
                ],
                mappingDTO: [
                    {
                        ecsaM_Id: rowData.ecsaM_Id ?? 0,
                        asmaY_Id: rowData.asmaY_Id ?? 0,
                        mI_Id: orgId,
                        ecS_Id: rowData.ecS_Id ?? 0,
                        ecsA_Id: rowData.ecsA_Id ?? 0,
                        ecsaM_IndicatorDescription: rowData.ecsaM_IndicatorDescription ?? '',
                        emgR_Id: rowData.emgR_Id ?? 0,
                        ecsaM_ActiveFlag: rowData.ecsaM_ActiveFlag ?? true
                    }
                ]
            });
            setIsDataBound(true);
        }
    }, [rowData, dropdownsReady, reset]);

    const onSubmit = async (data: FormFields) => {
        if (Object.keys(errors).length > 0) {
            toast.error('Please fill all required fields');
            return;
        }

        const payload = {
            ecS_Id: data.ecS_Id ?? 0,
            mI_Id: orgId,
            ecS_SkillName: data.ecS_SkillName ?? 'Default Skill',
            ecS_SkillCode: data.ecS_SkillCode ?? 'CODE',
            subexamDTO: data.subexamDTO.map((s) => ({
                ecsA_Id: s.ecsA_Id ?? 0,
                ecsA_SkillOrder: s.ecsA_SkillOrder ?? 1,
                ecsA_SkillArea: s.ecsA_SkillArea ?? ''
            })),
            mappingDTO: data.mappingDTO.map((m) => ({
                ecsaM_Id: m.ecsaM_Id ?? 0,
                asmaY_Id: m.asmaY_Id,
                mI_Id: orgId,
                ecS_Id: m.ecS_Id,
                ecsA_Id: m.ecsA_Id,
                ecsaM_IndicatorDescription: m.ecsaM_IndicatorDescription ?? '',
                emgR_Id: m.emgR_Id,
                ecsaM_ActiveFlag: true
            }))
        };

        try {
            const res = await addOrUpdateMasterLifeSkillMapping(payload);
            if (res?.success) {
                toast.success('Updated successfully');
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(res?.message ?? 'Update failed');
            }
        } catch (err: any) {
            toast.error(err?.message ?? 'Unexpected error occurred');
        }
    };

    return (
        <div className='flex w-full flex-col gap-6'>
            {!isDataBound ? (
                <DataTableSkeleton columnCount={5} rowCount={10} showPagination={false} showViewOptions={false} />
            ) : (
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-md' noValidate>
                        <div className='grid grid-cols-2 gap-6'>
                            {/* Academic Year */}
                            <Controller
                                control={control}
                                name='mappingDTO.0.asmaY_Id'
                                render={({ field, fieldState }) => (
                                    <div>
                                        <Label>Academic Year *</Label>
                                        <Select value={String(field.value || '')} onValueChange={(val) => field.onChange(Number(val))}>
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

                            {/* Life Skill */}
                            <Controller
                                control={control}
                                name='mappingDTO.0.ecS_Id'
                                render={({ field, fieldState }) => (
                                    <div>
                                        <Label>Life Skill *</Label>
                                        <Select value={String(field.value || '')} onValueChange={(val) => field.onChange(Number(val))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Life Skill' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {lifeSkills.map((ls) => (
                                                    <SelectItem key={ls.ecS_Id} value={String(ls.ecS_Id)}>
                                                        {ls.ecS_SkillName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                    </div>
                                )}
                            />

                            {/* Skill Area */}
                            <Controller
                                control={control}
                                name='mappingDTO.0.ecsA_Id'
                                render={({ field, fieldState }) => (
                                    <div>
                                        <Label>Skill Area *</Label>
                                        <Select value={String(field.value || '')} onValueChange={(val) => field.onChange(Number(val))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Skill Area' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {lifeSkillAreas.map((area) => (
                                                    <SelectItem key={area.ecsA_Id} value={String(area.ecsA_Id)}>
                                                        {area.ecsA_SkillArea}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                    </div>
                                )}
                            />

                            {/* Master Grade */}
                            <Controller
                                control={control}
                                name='mappingDTO.0.emgR_Id'
                                render={({ field, fieldState }) => (
                                    <div>
                                        <Label>Master Grade *</Label>
                                        <Select value={String(field.value || '')} onValueChange={(val) => field.onChange(Number(val))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Grade' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {grades.map((g) => (
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

                            {/* Indicator Description */}
                            <Controller
                                control={control}
                                name='mappingDTO.0.ecsaM_IndicatorDescription'
                                render={({ field, fieldState }) => (
                                    <div className='col-span-2'>
                                        <Label>Indicator Description *</Label>
                                        <textarea
                                            {...field}
                                            value={field.value ?? ''}
                                            rows={3}
                                            className='w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                            placeholder='Enter Indicator Description'
                                        />
                                        {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                    </div>
                                )}
                            />
                        </div>

                        <div className='flex w-fit gap-4'>
                            <Button type='submit' disabled={isSubmitting}>
                                {isSubmitting ? 'Updating...' : 'Update'}
                            </Button>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={() => {
                                    if (rowData) {
                                        reset({
                                            ecS_Id: rowData.ecS_Id ?? 0,
                                            mI_Id: orgId,
                                            ecS_SkillName: rowData.ecS_SkillName ?? '',
                                            ecS_SkillCode: '',
                                            subexamDTO: [
                                                {
                                                    ecsA_Id: rowData.ecsA_Id ?? 0,
                                                    ecsA_SkillOrder: 1,
                                                    ecsA_SkillArea: rowData.ecsA_SkillArea ?? ''
                                                }
                                            ],
                                            mappingDTO: [
                                                {
                                                    ecsaM_Id: rowData.ecsaM_Id ?? 0,
                                                    asmaY_Id: rowData.asmaY_Id ?? 0,
                                                    mI_Id: orgId,
                                                    ecS_Id: rowData.ecS_Id ?? 0,
                                                    ecsA_Id: rowData.ecsA_Id ?? 0,
                                                    ecsaM_IndicatorDescription: rowData.ecsaM_IndicatorDescription ?? '',
                                                    emgR_Id: rowData.emgR_Id ?? 0,
                                                    ecsaM_ActiveFlag: rowData.ecsaM_ActiveFlag ?? true
                                                }
                                            ]
                                        });
                                    }
                                }}>
                                Reset
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            )}
        </div>
    );
}
