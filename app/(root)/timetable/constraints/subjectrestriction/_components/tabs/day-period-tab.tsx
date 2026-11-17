'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dayPeriodSchema } from '@/schemas/timetable/constraints/subjectrestriction';
import { getClassDetails, getSectionDetails } from '@/server/timetable/constraints/labconstraints';
import { saveDayPeriodDetail } from '@/server/timetable/constraints/subjectrestriction';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save, Trash, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type DayPeriodSchema = z.infer<typeof dayPeriodSchema>;

interface DayPeriodTabProps {
    initialData: any;
}

export default function DayPeriodTab({ initialData }: DayPeriodTabProps) {
    const academicList = initialData?.yearlist || [];
    const categoryList = initialData?.categorylist || [];
    const dayList = initialData?.daylist || [];
    const periodList = initialData?.periodlist || [];

    const [classList, setClassList] = useState<any[]>([]);
    const [sectionList, setSectionList] = useState<any[]>([]);
    const [staffList, setStaffList] = useState<any[]>([]);
    const [subjectList, setSubjectList] = useState<any[]>([]);

    // We need to wrap this in a component that uses FormContext, OR we move FormProvider here.
    // Given the structure of SubjectRestriction page which renders Tabs, each Tab having its own list/form seems appropriate.
    // So we will wrap the content in FormProvider here (or in a sub-component).

    return (
        <FormProvider>
            <DayPeriodTabContent initialData={initialData} />
        </FormProvider>
    );
}

import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import DayPeriodList from './day-period-list';

function DayPeriodTabContent({ initialData }: DayPeriodTabProps) {
    const { isAddFormOpen, isEditFormOpen, openAddForm, closeAddForm, closeEditForm } = useFormContext();

    const academicList = initialData?.yearlist || [];
    const categoryList = initialData?.categorylist || [];
    const dayList = initialData?.daylist || [];
    const periodList = initialData?.periodlist || [];

    // ... (State and Form Hooks from original component)
    const [classList, setClassList] = useState<any[]>([]);
    const [sectionList, setSectionList] = useState<any[]>([]);
    const [staffList, setStaffList] = useState<any[]>([]);
    const [subjectList, setSubjectList] = useState<any[]>([]);

    const form = useForm<DayPeriodSchema>({
        resolver: zodResolver(dayPeriodSchema),
        mode: 'onChange',
        defaultValues: {
            TTRDP_Id: 0,
            ASMAY_Id: 0,
            TTMC_Id: 0,
            ASMCL_Id: 0,
            ASMS_Id: 0,
            HRME_Id: 0,
            ISMS_Id: 0,
            TTMD_Id: 0,
            TTMP_Id: 0,
            combinationlist: []
        }
    });

    const {
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors, isSubmitting }
    } = form;

    const watchedYear = watch('ASMAY_Id');
    const watchedCategory = watch('TTMC_Id');
    const watchedClass = watch('ASMCL_Id');
    const watchedSection = watch('ASMS_Id');
    const watchedStaff = watch('HRME_Id');
    const watchedSubSelectFlag = watch('TTRDP_SUbSelcFlag' as any);

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'combinationlist' as any
    });

    const [tempInput, setTempInput] = useState({
        ASMCL_Id: 0,
        ASMS_Id: 0,
        HRME_Id: 0,
        ISMS_Id: 0,
        TTMD_Id: 0,
        TTMP_Id: 0
    });

    const handleAdd = () => {
        if (
            !tempInput.ASMCL_Id ||
            !tempInput.ASMS_Id ||
            !tempInput.HRME_Id ||
            !tempInput.ISMS_Id ||
            !tempInput.TTMD_Id ||
            !tempInput.TTMP_Id
        ) {
            toast.error('Please fill all fields');
            return;
        }
        append({
            ASMCL_Id: tempInput.ASMCL_Id,
            ASMS_Id: tempInput.ASMS_Id,
            HRME_Id: tempInput.HRME_Id,
            ISMS_Id: tempInput.ISMS_Id,
            TTMD_Id: tempInput.TTMD_Id,
            TTMP_Id: tempInput.TTMP_Id
        });
        setTempInput({ ASMCL_Id: 0, ASMS_Id: 0, HRME_Id: 0, ISMS_Id: 0, TTMD_Id: 0, TTMP_Id: 0 });
    };

    // ... (UseEffects)
    useEffect(() => {
        const fetch = async () => {
            if (watchedYear && watchedCategory) {
                const res = await getClassDetails({ ASMAY_Id: watchedYear, TTMC_Id: watchedCategory });
                setClassList((res?.classlist as any[]) || []);
            } else {
                setClassList([]);
            }
        };
        fetch();
    }, [watchedYear, watchedCategory]);

    useEffect(() => {
        const fetch = async () => {
            if (watchedYear && watchedCategory && watchedClass) {
                const res = await getSectionDetails({ ASMAY_Id: watchedYear, TTMC_Id: watchedCategory, ASMCL_Id: watchedClass });
                setSectionList((res?.sectionlist as any) || []);
            } else {
                setSectionList([]);
            }
        };
        fetch();
    }, [watchedYear, watchedCategory, watchedClass]);

    useEffect(() => {
        const fetch = async () => {
            if (watchedYear && watchedCategory && watchedClass && watchedSection) {
                const { getStaffSection } = await import('@/server/timetable/constraints/bifurcationconstraints');
                const res = await getStaffSection({
                    ASMAY_Id: watchedYear,
                    TTMC_Id: watchedCategory,
                    ASMCL_Id: watchedClass,
                    ASMS_Id: watchedSection
                });
                setStaffList((res?.staffbyall as any) || []);
            } else {
                setStaffList([]);
            }
        };
        fetch();
    }, [watchedYear, watchedCategory, watchedClass, watchedSection]);

    useEffect(() => {
        const fetch = async () => {
            if (watchedYear && watchedCategory && watchedClass && watchedSection && watchedStaff) {
                const { getSubjectStaff } = await import('@/server/timetable/constraints/bifurcationconstraints');
                const res = await getSubjectStaff({
                    ASMAY_Id: watchedYear,
                    TTMC_Id: watchedCategory,
                    ASMCL_Id: watchedClass,
                    ASMS_Id: watchedSection,
                    HRME_Id: watchedStaff
                });
                setSubjectList((res?.subjectbystaff as any) || []);
            } else {
                setSubjectList([]);
            }
        };
        fetch();
    }, [watchedYear, watchedCategory, watchedClass, watchedSection, watchedStaff]);

    const onSubmit: SubmitHandler<DayPeriodSchema> = async (data) => {
        try {
            const res = await saveDayPeriodDetail(data);
            if (res.returnval === true) {
                toast.success('Saved Successfully');
                reset();
                closeAddForm(); // Close form on success
            } else if (res.returnfixstatus === 'Fixed') {
                toast.warning('Selected Staff And Subject Is Fixed For Selected Details !');
            } else if (res.returnduplicatestatus === 'Duplicate') {
                toast.warning('Records Already Exist !');
            } else {
                toast.error('Failed to Save');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        }
    };

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit bg-orange-500 shadow-md transition-all duration-200 hover:scale-105 hover:bg-orange-600 hover:shadow-lg'>
                        <Plus className='mr-2 h-4 w-4' />
                        Add Day Period Constraint
                    </Button>
                </div>

                <DayPeriodList data={initialData?.dayperiodlist || []} />

                {(isAddFormOpen || isEditFormOpen) && (
                    <CollapsibleSection
                        title={isEditFormOpen ? 'Edit Day Period Constraint' : 'Add New Day Period Constraint'}
                        defaultOpen={true}
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                        <div className='relative'>
                            <Button
                                type='button'
                                onClick={isEditFormOpen ? closeEditForm : closeAddForm}
                                variant='ghost'
                                size='sm'
                                className='-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>

                            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 bg-white p-6'>
                                <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                                    <div className='space-y-2'>
                                        <Label>
                                            Academic Year <span className='text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            control={control}
                                            name='ASMAY_Id'
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={(val) => field.onChange(Number(val))}
                                                    value={field.value?.toString()}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='--Select--' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {academicList.map((item: any) => (
                                                            <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                                {item.asmaY_Year}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label>
                                            Category <span className='text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            control={control}
                                            name='TTMC_Id'
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={(val) => field.onChange(Number(val))}
                                                    value={field.value?.toString()}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='--Select--' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categoryList.map((item: any) => (
                                                            <SelectItem key={item.ttmC_Id} value={item.ttmC_Id.toString()}>
                                                                {item.ttmC_CategoryName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className='space-y-4 rounded-md border bg-gray-50 p-4'>
                                    <div className='flex items-center space-x-2'>
                                        <Controller
                                            control={control}
                                            name='TTRDP_SUbSelcFlag'
                                            render={({ field }) => (
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} id='cs_flag' />
                                            )}
                                        />
                                        <Label htmlFor='cs_flag' className='font-semibold'>
                                            Restriction Class-Section Wise
                                        </Label>
                                    </div>

                                    {watchedSubSelectFlag && (
                                        <div className='grid grid-cols-1 items-end gap-4 md:grid-cols-5'>
                                            <div className='space-y-2'>
                                                <Label>Class</Label>
                                                <Select
                                                    value={tempInput.ASMCL_Id.toString()}
                                                    onValueChange={(val) => setTempInput((prev) => ({ ...prev, ASMCL_Id: Number(val) }))}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='--Select--' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {classList.map((item: any) => (
                                                            <SelectItem key={item.asmcL_Id} value={item.asmcL_Id.toString()}>
                                                                {item.asmcL_ClassName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className='space-y-2'>
                                                <Label>Section</Label>
                                                <Select
                                                    value={tempInput.ASMS_Id.toString()}
                                                    onValueChange={(val) => setTempInput((prev) => ({ ...prev, ASMS_Id: Number(val) }))}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='--Select--' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {sectionList.map((item: any) => (
                                                            <SelectItem key={item.asmS_Id} value={item.asmS_Id.toString()}>
                                                                {item.asmC_SectionName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className='space-y-2'>
                                                <Label>Staff</Label>
                                                <Select
                                                    value={tempInput.HRME_Id.toString()}
                                                    onValueChange={(val) => setTempInput((prev) => ({ ...prev, HRME_Id: Number(val) }))}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='--Select--' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {staffList.map((item: any) => (
                                                            <SelectItem key={item.hrmE_Id} value={item.hrmE_Id.toString()}>
                                                                {item.staffName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className='space-y-2'>
                                                <Label>Subject</Label>
                                                <Select
                                                    value={tempInput.ISMS_Id.toString()}
                                                    onValueChange={(val) => setTempInput((prev) => ({ ...prev, ISMS_Id: Number(val) }))}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='--Select--' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {subjectList.map((item: any) => (
                                                            <SelectItem key={item.ismS_Id} value={item.ismS_Id.toString()}>
                                                                {item.ismS_SubjectName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className='space-y-2'>
                                                <Label>Day</Label>
                                                <Select
                                                    value={tempInput.TTMD_Id.toString()}
                                                    onValueChange={(val) => setTempInput((prev) => ({ ...prev, TTMD_Id: Number(val) }))}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='--Select--' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {dayList.map((item: any) => (
                                                            <SelectItem key={item.ttmD_Id} value={item.ttmD_Id.toString()}>
                                                                {item.ttmD_DayName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className='space-y-2'>
                                                <Label>Period</Label>
                                                <Select
                                                    value={tempInput.TTMP_Id.toString()}
                                                    onValueChange={(val) => setTempInput((prev) => ({ ...prev, TTMP_Id: Number(val) }))}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='--Select--' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {periodList.map((item: any) => (
                                                            <SelectItem key={item.ttmP_Id} value={item.ttmP_Id.toString()}>
                                                                {item.ttmP_PeriodName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <Button type='button' onClick={handleAdd} variant='secondary'>
                                                <Plus className='mr-2 h-4 w-4' /> Add
                                            </Button>
                                        </div>
                                    )}

                                    {watchedSubSelectFlag && fields.length > 0 && (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Class</TableHead>
                                                    <TableHead>Section</TableHead>
                                                    <TableHead>Staff</TableHead>
                                                    <TableHead>Subject</TableHead>
                                                    <TableHead>Day</TableHead>
                                                    <TableHead>Period</TableHead>
                                                    <TableHead>Action</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {fields.map((field: any, index) => (
                                                    <TableRow key={field.id}>
                                                        <TableCell>{field.ASMCL_Id}</TableCell>
                                                        <TableCell>{field.ASMS_Id}</TableCell>
                                                        <TableCell>{field.HRME_Id}</TableCell>
                                                        <TableCell>{field.ISMS_Id}</TableCell>
                                                        <TableCell>{field.TTMD_Id}</TableCell>
                                                        <TableCell>{field.TTMP_Id}</TableCell>
                                                        <TableCell>
                                                            <Button type='button' variant='ghost' size='icon' onClick={() => remove(index)}>
                                                                <Trash className='h-4 w-4 text-red-500' />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </div>

                                <div className='flex justify-center gap-4 pt-4'>
                                    <Button type='submit' disabled={isSubmitting} isLoading={isSubmitting}>
                                        <Save className='mr-2 h-4 w-4' /> Save
                                    </Button>
                                    <Button
                                        type='button'
                                        variant='destructive'
                                        onClick={() => {
                                            reset();
                                            if (isEditFormOpen) closeEditForm();
                                            if (isAddFormOpen) closeAddForm();
                                        }}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </CollapsibleSection>
                )}
            </div>
        </div>
    );
}
