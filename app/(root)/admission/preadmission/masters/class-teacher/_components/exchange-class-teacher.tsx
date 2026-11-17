'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError, Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useAcademicYearDropdown,
    useClassTeacher,
    useClassTeacherEmployee,
    usegetExchangeClassSection
} from '@/hooks/admission/preadmission/useMasters';
import type { masterExchangeClassTeacherSchema } from '@/schemas/admission/preadmission/masters';
import { ExchangeEmployee } from '@/server/admission/preadmission/masters/class_teacher';
import type { IMasterClassTeacherList } from '@/types/admission/preadmission/masters';
import { useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterExchangeClassTeacherSchema.addOrUpdate>;

interface ExchangeClassTeacherFormProps {
    rowData: IMasterClassTeacherList;
    isOpen: boolean;
    onClose: () => void;
}

export default function ExchangeClassTeacherForm({ isOpen, onClose }: ExchangeClassTeacherFormProps) {
    const [selectedAcademicYearA, setSelectedAcademicYearA] = useState<number | undefined>();
    const [selectedStaffA, setSelectedStaffA] = useState<number | undefined>();
    const [selectedAcademicYearB, setSelectedAcademicYearB] = useState<number | undefined>();
    const [selectedStaffB, setSelectedStaffB] = useState<number | undefined>();

    const { refetchAll: refetchClassTeacher } = useClassTeacher();

    const { data: academicYear, isLoading: academicYearLoading, error: academicYearError } = useAcademicYearDropdown();

    const { data: employeeDataA, isLoading: employeeLoadingA, error: employeeErrorA } = useClassTeacherEmployee(selectedAcademicYearA);

    const { data: employeeDataB, isLoading: employeeLoadingB, error: employeeErrorB } = useClassTeacherEmployee(selectedAcademicYearB);

    const { data: classSectionA, isLoading: csLoadingA } = usegetExchangeClassSection(selectedAcademicYearA, selectedStaffA);

    const { data: classSectionB, isLoading: csLoadingB } = usegetExchangeClassSection(selectedAcademicYearB, selectedStaffB);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        defaultValues: {
            imcT_Id_1: 0,
            hrmE_Id_1: 0,
            imcT_Id_2: 0,
            hrmE_Id_2: 0
        },
        mode: 'onChange'
    });

    const closeDialog = () => {
        onClose();
        reset();
        setSelectedAcademicYearA(undefined);
        setSelectedStaffA(undefined);
        setSelectedAcademicYearB(undefined);
        setSelectedStaffB(undefined);
    };

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                imcT_Id_1: data.imcT_Id_1,
                hrmE_Id_1: data.hrmE_Id_1,
                imcT_Id_2: data.imcT_Id_2,
                hrmE_Id_2: data.hrmE_Id_2
            };

            const response = await ExchangeEmployee(payload);

            if (response.success) {
                toast.success(response.message);
                refetchClassTeacher();
                closeDialog();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message ?? 'Exchange failed');
        }
    };

    // === Helper: Render Class & Section Dropdowns (Display + Select Class) ===
    const renderClassSectionDropdowns = (
        data: { data?: any[] } | undefined,
        isLoading: boolean,
        fieldName: 'imcT_Id_1' | 'imcT_Id_2',
        title: string
    ) => {
        const items = data?.data ?? [];
        const selectedValue = watch(fieldName) ?? 0;

        // Group sections by class
        const classMap = new Map<number, any[]>();
        items.forEach((i) => {
            if (!classMap.has(i.asmcL_Id)) classMap.set(i.asmcL_Id, []);
            classMap.get(i.asmcL_Id)!.push(i);
        });

        const classIds = Array.from(classMap.keys());

        const sectionMap = new Map<number, any[]>();
        items.forEach((i) => {
            if (!sectionMap.has(i.asmS_Id)) sectionMap.set(i.asmS_Id, []);
            sectionMap.get(i.asmS_Id)!.push(i);
        });

        const sectionIds = Array.from(classMap.keys());

        return (
            <div className='space-y-3'>
                <p className='font-medium text-gray-700 text-sm'>{title}</p>
                <div className='grid grid-cols-1 gap-3'>
                    {/* Class Dropdown */}
                    <div className='flex flex-col gap-1.5'>
                        <Label className='font-medium text-xs'>Class</Label>
                        <Select
                            disabled={isLoading || items.length === 0}
                            onValueChange={(v) => {
                                const imcT_Id = Number(v);
                                setValue(fieldName, imcT_Id);
                            }}
                            value={selectedValue.toString()}>
                            <SelectTrigger className='h-9 text-xs'>
                                <SelectValue placeholder='Select Class' />
                            </SelectTrigger>
                            <SelectContent>
                                {isLoading ? (
                                    <SelectItem value='loading' disabled>
                                        Loading...
                                    </SelectItem>
                                ) : items.length === 0 ? (
                                    <SelectItem value='none' disabled>
                                        No class assigned
                                    </SelectItem>
                                ) : (
                                    classIds.map((classId) => {
                                        const firstItem = items.find((i) => i.asmcL_Id === classId);
                                        return (
                                            <SelectItem key={firstItem?.imcT_Id} value={firstItem?.imcT_Id.toString() ?? ''}>
                                                {firstItem?.asmcL_ClassName}
                                            </SelectItem>
                                        );
                                    })
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Section (Disabled - Display Only) */}
                    <div className='flex flex-col gap-1.5'>
                        <Label className='font-medium text-xs'>Section</Label>
                        <Select
                            disabled={isLoading || items.length === 0}
                            onValueChange={(v) => {
                                const imcT_Id = Number(v);
                                setValue(fieldName, imcT_Id);
                            }}
                            value={selectedValue.toString()}>
                            <SelectTrigger className='h-9 text-xs'>
                                <SelectValue placeholder='Select Class' />
                            </SelectTrigger>
                            <SelectContent>
                                {isLoading ? (
                                    <SelectItem value='loading' disabled>
                                        Loading...
                                    </SelectItem>
                                ) : items.length === 0 ? (
                                    <SelectItem value='none' disabled>
                                        No section assigned
                                    </SelectItem>
                                ) : (
                                    sectionIds.map((sectionId) => {
                                        const firstItem = items.find((i) => i.asmcL_Id === sectionId);
                                        return (
                                            <SelectItem key={firstItem?.imcT_Id} value={firstItem?.imcT_Id.toString() ?? ''}>
                                                {firstItem?.asmC_SectionName}
                                            </SelectItem>
                                        );
                                    })
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AdaptiveDialog title='Exchange Class Teacher' isOpen={isOpen} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-6'>
                    <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
                        {/* ====== SIDE A ====== */}
                        <div className='space-y-5'>
                            {/* Academic Year A */}
                            <div className='group flex flex-col gap-1.5'>
                                <Label htmlFor='year-a'>
                                    Academic Year <span className='text-red-500'>*</span>
                                </Label>
                                <Select
                                    onValueChange={(v) => {
                                        const n = Number(v);
                                        setSelectedAcademicYearA(n);
                                        setSelectedStaffA(undefined);
                                        setValue('imcT_Id_1', 0);
                                        setValue('hrmE_Id_1', 0);
                                    }}
                                    value={selectedAcademicYearA?.toString() || ''}>
                                    <SelectTrigger id='year-a' className='w-full'>
                                        <SelectValue placeholder='Select Academic Year' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {academicYearLoading ? (
                                            <SelectItem value='loading' disabled>
                                                Loading...
                                            </SelectItem>
                                        ) : academicYearError ? (
                                            <SelectItem value='error' disabled>
                                                Error loading years
                                            </SelectItem>
                                        ) : academicYear?.data?.length === 0 ? (
                                            <SelectItem value='empty' disabled>
                                                No academic years
                                            </SelectItem>
                                        ) : (
                                            academicYear?.data?.map((y) => (
                                                <SelectItem key={y.asmaY_Id} value={y.asmaY_Id.toString()}>
                                                    {y.asmaY_Year}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Staff A */}
                            <Controller
                                name='hrmE_Id_1'
                                control={control}
                                render={({ field }) => (
                                    <div className='group flex flex-col gap-1.5'>
                                        <Label htmlFor='staff-a'>
                                            Employee <span className='text-red-500'>*</span>
                                        </Label>
                                        <Select
                                            disabled={!selectedAcademicYearA || employeeLoadingA}
                                            onValueChange={(v) => {
                                                const n = Number(v);
                                                field.onChange(n);
                                                setSelectedStaffA(n);
                                                setValue('imcT_Id_1', 0); // Reset class on staff change
                                            }}
                                            value={field.value?.toString() || ''}>
                                            <SelectTrigger id='staff-a' className='w-full'>
                                                <SelectValue placeholder='Select Staff' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {employeeLoadingA ? (
                                                    <SelectItem value='loading' disabled>
                                                        Loading...
                                                    </SelectItem>
                                                ) : employeeErrorA ? (
                                                    <SelectItem value='error' disabled>
                                                        Error loading staff
                                                    </SelectItem>
                                                ) : !selectedAcademicYearA ? (
                                                    <SelectItem value='no-year' disabled>
                                                        Select year first
                                                    </SelectItem>
                                                ) : !employeeDataA?.data || employeeDataA.data.length === 0 ? (
                                                    <SelectItem value='empty' disabled>
                                                        No Employee found
                                                    </SelectItem>
                                                ) : (
                                                    employeeDataA.data.map((e: any) => (
                                                        <SelectItem key={e.hrmE_Id} value={e.hrmE_Id.toString()}>
                                                            {e.employee_name}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {errors.hrmE_Id_1 && <FormError>{errors.hrmE_Id_1.message}</FormError>}
                                    </div>
                                )}
                            />

                            {/* Class & Section A */}
                            {renderClassSectionDropdowns(classSectionA, csLoadingA, 'imcT_Id_1', 'Assigned Class & Section')}
                        </div>

                        {/* ====== SIDE B ====== */}
                        <div className='space-y-5'>
                            {/* Academic Year B */}
                            <div className='group flex flex-col gap-1.5'>
                                <Label htmlFor='year-b'>
                                    Academic Year <span className='text-red-500'>*</span>
                                </Label>
                                <Select
                                    onValueChange={(v) => {
                                        const n = Number(v);
                                        setSelectedAcademicYearB(n);
                                        setSelectedStaffB(undefined);
                                        setValue('imcT_Id_2', 0);
                                        setValue('hrmE_Id_2', 0);
                                    }}
                                    value={selectedAcademicYearB?.toString() || ''}>
                                    <SelectTrigger id='year-b' className='w-full'>
                                        <SelectValue placeholder='Select Academic Year' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {academicYearLoading ? (
                                            <SelectItem value='loading' disabled>
                                                Loading...
                                            </SelectItem>
                                        ) : academicYearError ? (
                                            <SelectItem value='error' disabled>
                                                Error loading years
                                            </SelectItem>
                                        ) : academicYear?.data?.length === 0 ? (
                                            <SelectItem value='empty' disabled>
                                                No academic years
                                            </SelectItem>
                                        ) : (
                                            academicYear?.data?.map((y) => (
                                                <SelectItem key={y.asmaY_Id} value={y.asmaY_Id.toString()}>
                                                    {y.asmaY_Year}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Staff B */}
                            <Controller
                                name='hrmE_Id_2'
                                control={control}
                                render={({ field }) => (
                                    <div className='group flex flex-col gap-1.5'>
                                        <Label htmlFor='staff-b'>
                                            Employee <span className='text-red-500'>*</span>
                                        </Label>
                                        <Select
                                            disabled={!selectedAcademicYearB || employeeLoadingB}
                                            onValueChange={(v) => {
                                                const n = Number(v);
                                                field.onChange(n);
                                                setSelectedStaffB(n);
                                                setValue('imcT_Id_2', 0);
                                            }}
                                            value={field.value?.toString() || ''}>
                                            <SelectTrigger id='staff-b' className='w-full'>
                                                <SelectValue placeholder='Select Staff' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {employeeLoadingB ? (
                                                    <SelectItem value='loading' disabled>
                                                        Loading...
                                                    </SelectItem>
                                                ) : employeeErrorB ? (
                                                    <SelectItem value='error' disabled>
                                                        Error loading staff
                                                    </SelectItem>
                                                ) : !selectedAcademicYearB ? (
                                                    <SelectItem value='no-year' disabled>
                                                        Select year first
                                                    </SelectItem>
                                                ) : !employeeDataB?.data || employeeDataB.data.length === 0 ? (
                                                    <SelectItem value='empty' disabled>
                                                        No Employee found
                                                    </SelectItem>
                                                ) : (
                                                    employeeDataB.data.map((e: any) => (
                                                        <SelectItem key={e.hrmE_Id} value={e.hrmE_Id.toString()}>
                                                            {e.employee_name}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {errors.hrmE_Id_2 && <FormError>{errors.hrmE_Id_2.message}</FormError>}
                                    </div>
                                )}
                            />

                            {/* Class & Section B */}
                            {renderClassSectionDropdowns(classSectionB, csLoadingB, 'imcT_Id_2', 'Assigned Class & Section')}
                        </div>
                    </div>

                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </AdaptiveBody>

                <AdaptiveFooter>
                    <Button variant='secondary' onClick={closeDialog} type='button' disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type='submit' isLoading={isSubmitting}>
                        Exchange
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
