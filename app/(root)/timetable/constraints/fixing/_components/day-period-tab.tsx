'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type FixingDayPeriodSchema, fixingDayPeriodSchema } from '@/schemas/timetable/constraints/fixing';
import {
    deactivateFixingDayPeriod,
    getClassByCategory,
    getFixingDayPeriodDetails,
    getSectionByClass,
    getStaffByClassSection,
    getSubjectByStaff,
    saveFixingDayPeriod
} from '@/server/timetable/constraints/fixing';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type IFixingDayPeriodList, dayPeriodColumns } from './columns';

interface DayPeriodTabProps {
    initialData: any;
}

function DayPeriodTabContent({ initialData }: DayPeriodTabProps) {
    const { isAddFormOpen, isEditFormOpen, openAddForm, closeAddForm, closeEditForm, selectedRow, closeToggleForm, isToggleFormOpen } =
        useFormContext();

    const [academicList, setAcademicList] = useState<any[]>(initialData?.yearlist || []);
    const [categoryList, setCategoryList] = useState<any[]>(initialData?.categorylist || []);
    const [dayList, setDayList] = useState<any[]>(initialData?.daylist || []);
    const [periodList, setPeriodList] = useState<any[]>(initialData?.periodlist || []);
    const [gridData, setGridData] = useState<IFixingDayPeriodList[]>(initialData?.fix_day_period_list || []);

    const [classList, setClassList] = useState<any[]>([]);
    const [sectionList, setSectionList] = useState<any[]>([]);
    const [staffList, setStaffList] = useState<any[]>([]);
    const [subjectList, setSubjectList] = useState<any[]>([]);

    const form = useForm<FixingDayPeriodSchema>({
        resolver: zodResolver(fixingDayPeriodSchema),
        defaultValues: {
            TTFDP_Id: 0,
            ASMAY_Id: undefined,
            TTMC_Id: undefined,
            ASMCL_Id: undefined,
            ASMS_Id: undefined,
            HRME_Id: undefined,
            ISMS_Id: undefined,
            TTMD_Id: undefined,
            TTMP_Id: undefined
        }
    });

    const { reset, setValue, watch, handleSubmit } = form;
    const ASMAY_Id = watch('ASMAY_Id');
    const TTMC_Id = watch('TTMC_Id');
    const ASMCL_Id = watch('ASMCL_Id');
    const ASMS_Id = watch('ASMS_Id');

    // Effect to populate form on Edit
    useEffect(() => {
        if (isEditFormOpen && selectedRow) {
            onEdit(selectedRow);
        }
    }, [isEditFormOpen, selectedRow]);

    // Effect to handle Toggle (Active/Deactive)
    useEffect(() => {
        if (isToggleFormOpen && selectedRow) {
            onToggle(selectedRow);
            closeToggleForm();
        }
    }, [isToggleFormOpen, selectedRow]);

    const handleCategoryChange = async (categoryId: number) => {
        setValue('TTMC_Id', categoryId);
        setValue('ASMCL_Id', 0);
        setValue('ASMS_Id', 0);
        setValue('HRME_Id', 0);
        setValue('ISMS_Id', 0);
        setClassList([]);
        setSectionList([]);
        setStaffList([]);
        setSubjectList([]);

        if (ASMAY_Id && categoryId) {
            try {
                const res = await getClassByCategory({ ASMAY_Id, TTMC_Id: categoryId });
                if (Array.isArray(res) && res && res.classbycategory) {
                    setClassList(res.classbycategory as any[]);
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleClassChange = async (classId: number) => {
        setValue('ASMCL_Id', classId);
        setValue('ASMS_Id', 0);
        setValue('HRME_Id', 0);
        setValue('ISMS_Id', 0);
        setSectionList([]);
        setStaffList([]);
        setSubjectList([]);

        if (ASMAY_Id && TTMC_Id && classId) {
            try {
                const res = await getSectionByClass({ ASMAY_Id, ASMCL_Id: classId, TTMC_Id });
                if (Array.isArray(res) && res && res.sectionlist) {
                    setSectionList(res.sectionlist as any[]);
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleSectionChange = async (sectionId: number) => {
        setValue('ASMS_Id', sectionId);
        setValue('HRME_Id', 0);
        setValue('ISMS_Id', 0);
        setStaffList([]);
        setSubjectList([]);

        if (ASMAY_Id && ASMCL_Id && sectionId) {
            try {
                const res = await getStaffByClassSection({ ASMAY_Id, TTMC_Id, ASMCL_Id, ASMS_Id: sectionId });
                if (Array.isArray(res) && res && res.staffbyall) {
                    setStaffList(res.staffbyall as any[]);
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleStaffChange = async (staffId: number) => {
        setValue('HRME_Id', staffId);
        setValue('ISMS_Id', 0);
        setSubjectList([]);

        if (ASMAY_Id && ASMCL_Id && ASMS_Id && staffId) {
            try {
                const res = await getSubjectByStaff({ ASMAY_Id, ASMCL_Id, ASMS_Id, HRME_Id: staffId });
                if (Array.isArray(res) && res && res.subjectbystaff) {
                    setSubjectList(res.subjectbystaff as any[]);
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    const onEdit = async (item: any) => {
        try {
            const res = await getFixingDayPeriodDetails(item.ttfdP_Id);
            if (res?.fix_day_period_edit && (res.fix_day_period_edit as any[]).length > 0) {
                const d = (res.fix_day_period_edit as any[])[0];

                const _ASMAY_Id = d.asmaY_Id;
                const _TTMC_Id = d.ttmC_Id;
                const _ASMCL_Id = d.asmcL_Id;
                const _ASMS_Id = d.asmS_Id;
                const _HRME_Id = d.hrmE_Id;

                // 1. Class
                if (_ASMAY_Id && _TTMC_Id) {
                    const clsRes = await getClassByCategory({ ASMAY_Id: _ASMAY_Id, TTMC_Id: _TTMC_Id });
                    if (Array.isArray(clsRes) && clsRes && clsRes.classbycategory) setClassList(clsRes.classbycategory as any[]);
                }
                // 2. Section
                if (_ASMAY_Id && _ASMCL_Id && _TTMC_Id) {
                    const secRes = await getSectionByClass({ ASMAY_Id: _ASMAY_Id, ASMCL_Id: _ASMCL_Id, TTMC_Id: _TTMC_Id });
                    if (Array.isArray(secRes) && secRes && secRes.sectionlist) setSectionList(secRes.sectionlist as any[]);
                }
                // 3. Staff
                if (_ASMAY_Id && _ASMCL_Id && _ASMS_Id && _TTMC_Id) {
                    const staffRes = await getStaffByClassSection({
                        ASMAY_Id: _ASMAY_Id,
                        ASMCL_Id: _ASMCL_Id,
                        ASMS_Id: _ASMS_Id,
                        TTMC_Id: _TTMC_Id
                    });
                    if (Array.isArray(staffRes) && staffRes && staffRes.staffbyall) setStaffList(staffRes.staffbyall as any[]);
                }
                // 4. Subject
                if (_ASMAY_Id && _ASMCL_Id && _ASMS_Id && _HRME_Id) {
                    const subRes = await getSubjectByStaff({
                        ASMAY_Id: _ASMAY_Id,
                        ASMCL_Id: _ASMCL_Id,
                        ASMS_Id: _ASMS_Id,
                        HRME_Id: _HRME_Id
                    });
                    if (Array.isArray(subRes) && subRes && subRes.subjectbystaff) setSubjectList(subRes.subjectbystaff as any[]);
                }

                reset({
                    TTFDP_Id: d.ttfdP_Id,
                    ASMAY_Id: d.asmaY_Id,
                    TTMC_Id: d.ttmC_Id,
                    ASMCL_Id: d.asmcL_Id,
                    ASMS_Id: d.asmS_Id,
                    HRME_Id: d.hrmE_Id,
                    ISMS_Id: d.ismS_Id,
                    TTMD_Id: d.ttmD_Id,
                    TTMP_Id: d.ttmP_Id
                });
            }
        } catch (e) {
            console.error(e);
        }
    };

    const onToggle = async (item: any) => {
        try {
            const payload = { TTFDP_Id: item.ttfdP_Id, TTFDP_ActiveFlag: !item.ttfdP_ActiveFlag };
            const res = await deactivateFixingDayPeriod(payload);
            if (res?.returnval === true) {
                toast.success('Status Updated');
                window.location.reload();
            } else {
                toast.error('Failed to update status');
            }
        } catch (e) {
            console.error(e);
        }
    };

    const onSubmit = async (data: FixingDayPeriodSchema) => {
        try {
            const res = await saveFixingDayPeriod(data);
            if (res?.returnval === true) {
                toast.success('Record Saved Successfully');
                window.location.reload();
            } else {
                toast.error(res?.message || 'Failed to save');
            }
        } catch (e) {
            console.error(e);
            toast.error('An error occurred');
        }
    };

    return (
        <div className='space-y-4'>
            <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                <Button
                    type='button'
                    onClick={openAddForm}
                    className='w-fit bg-orange-500 shadow-md transition-all duration-200 hover:scale-105 hover:bg-orange-600 hover:shadow-lg'>
                    <Plus className='mr-2 h-4 w-4' />
                    Add Day Period Constraint
                </Button>
            </div>

            <CollapsibleSection
                title='Day Period Constraints List'
                defaultOpen={true}
                variant='default'
                size='lg'
                className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                <GenericDataTable data={gridData} columns={dayPeriodColumns} totalItems={gridData.length} isLoading={false} />
            </CollapsibleSection>

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

                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 bg-white p-4 shadow-sm'>
                                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                                    <FormField
                                        control={form.control}
                                        name='ASMAY_Id'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Academic Year</FormLabel>
                                                <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder='Select' />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {academicList.map((item: any) => (
                                                            <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                                {item.asmaY_Year}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name='TTMC_Id'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <Select
                                                    onValueChange={(v) => handleCategoryChange(Number(v))}
                                                    value={field.value?.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder='Select' />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {categoryList.map((item: any) => (
                                                            <SelectItem key={item.ttmC_Id} value={item.ttmC_Id.toString()}>
                                                                {item.ttmC_CategoryName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name='ASMCL_Id'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Class</FormLabel>
                                                <Select onValueChange={(v) => handleClassChange(Number(v))} value={field.value?.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder='Select' />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {classList.map((item: any) => (
                                                            <SelectItem key={item.asmcL_Id} value={item.asmcL_Id.toString()}>
                                                                {item.asmcL_ClassName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name='ASMS_Id'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Section</FormLabel>
                                                <Select
                                                    onValueChange={(v) => handleSectionChange(Number(v))}
                                                    value={field.value?.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder='Select' />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {sectionList.map((item: any) => (
                                                            <SelectItem key={item.asmS_Id} value={item.asmS_Id.toString()}>
                                                                {item.asmS_SectionName || item.asmC_SectionName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name='HRME_Id'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Staff</FormLabel>
                                                <Select onValueChange={(v) => handleStaffChange(Number(v))} value={field.value?.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder='Select' />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {staffList.map((item: any) => (
                                                            <SelectItem key={item.hrmE_Id} value={item.hrmE_Id.toString()}>
                                                                {item.hrmE_EmployeeCode} - {item.hrmE_EmployeeFirstName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name='ISMS_Id'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Subject</FormLabel>
                                                <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder='Select' />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {subjectList.map((item: any) => (
                                                            <SelectItem key={item.ismS_Id} value={item.ismS_Id.toString()}>
                                                                {item.ismS_SubjectName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name='TTMD_Id'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Day</FormLabel>
                                                <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder='Select' />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {dayList.map((item: any) => (
                                                            <SelectItem key={item.ttmD_Id} value={item.ttmD_Id.toString()}>
                                                                {item.ttmD_DayName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name='TTMP_Id'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Period</FormLabel>
                                                <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder='Select' />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {periodList.map((item: any) => (
                                                            <SelectItem key={item.ttmP_Id} value={item.ttmP_Id.toString()}>
                                                                {item.ttmP_PeriodName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className='flex justify-end gap-2'>
                                    <Button type='button' variant='outline' onClick={() => reset()}>
                                        Cancel
                                    </Button>
                                    <Button type='submit'>Save</Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </CollapsibleSection>
            )}
        </div>
    );
}

export default function DayPeriodTab({ initialData }: DayPeriodTabProps) {
    return (
        <FormProvider>
            <DayPeriodTabContent initialData={initialData} />
        </FormProvider>
    );
}
