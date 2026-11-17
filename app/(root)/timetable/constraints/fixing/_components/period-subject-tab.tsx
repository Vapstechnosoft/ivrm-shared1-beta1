'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type FixingPeriodSubjectSchema, fixingPeriodSubjectSchema } from '@/schemas/timetable/constraints/fixing';
import {
    deactivateFixingPeriodSubject,
    getClassByCategory,
    getFixingPeriodSubjectDetails,
    getSectionByClass,
    getStaffByClassSection,
    saveFixingPeriodSubject
} from '@/server/timetable/constraints/fixing';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type IFixingPeriodSubjectList, periodSubjectColumns } from './columns';
import { FixingViewModal } from './fixing-view-modal';

interface PeriodSubjectTabProps {
    initialData: any;
}

function PeriodSubjectTabContent({ initialData }: PeriodSubjectTabProps) {
    const {
        isAddFormOpen,
        isEditFormOpen,
        openAddForm,
        closeAddForm,
        closeEditForm,
        selectedRow,
        closeToggleForm,
        isToggleFormOpen,
        isDetailsViewOpen,
        selectedRow: viewRow,
        closeDetailsView
    } = useFormContext();

    const [academicList] = useState<any[]>(initialData?.yearlist || []);
    const [periodList] = useState<any[]>(initialData?.periodlist || []);
    const [subjectList, setSubjectList] = useState<any[]>(initialData?.subjectlist || []);
    const [gridData, setGridData] = useState<IFixingPeriodSubjectList[]>(initialData?.fix_period_subject_list || []);

    const [classList, setClassList] = useState<any[]>([]);
    const [sectionList, setSectionList] = useState<any[]>([]);
    const [subStaffList, setSubStaffList] = useState<any[]>([]);
    const [categoryList] = useState<any[]>(initialData?.categorylist || []);

    // View Modal State
    const [viewDetails, setViewDetails] = useState<any[]>([]);
    const [isLoadingView, setIsLoadingView] = useState(false);

    const form = useForm<FixingPeriodSubjectSchema>({
        resolver: zodResolver(fixingPeriodSubjectSchema),
        defaultValues: {
            TTFPSU_Id: 0,
            ASMAY_Id: undefined,
            TTMP_Id: undefined,
            ISMS_Id: undefined,
            TTFPSU_SUbSelcFlag: false,
            TempararyArrayList: []
        }
    });

    const { reset, setValue, watch, handleSubmit, control } = form;
    const ASMAY_Id = watch('ASMAY_Id');
    const TTFPSU_SUbSelcFlag = watch('TTFPSU_SUbSelcFlag');
    const ISMS_Id = watch('ISMS_Id');

    const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
    const [selectedClass, setSelectedClass] = useState<number | undefined>();
    const [selectedSection, setSelectedSection] = useState<number | undefined>();
    const [selectedStaff, setSelectedStaff] = useState<number | undefined>();
    const [nod, setNod] = useState<string>('');

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'TempararyArrayList'
    });

    // Effect to populate form on Edit
    useEffect(() => {
        if (isEditFormOpen && selectedRow) {
            onEdit(selectedRow);
        }
    }, [isEditFormOpen, selectedRow]);

    // Effect to handle Toggle
    useEffect(() => {
        if (isToggleFormOpen && selectedRow) {
            onToggle(selectedRow);
            closeToggleForm();
        }
    }, [isToggleFormOpen, selectedRow]);

    // Effect to handle View
    useEffect(() => {
        if (isDetailsViewOpen && viewRow) {
            onView(viewRow);
        }
    }, [isDetailsViewOpen, viewRow]);

    const handleCategoryChange = async (categoryId: number) => {
        setSelectedCategory(categoryId);
        setSelectedClass(undefined);
        setSelectedSection(undefined);
        setSelectedStaff(undefined);
        setClassList([]);
        setSectionList([]);
        setSubStaffList([]);
        if (ASMAY_Id && categoryId) {
            try {
                const res = await getClassByCategory({ ASMAY_Id, TTMC_Id: categoryId });
                if (Array.isArray(res) && res && res.classbycategory) setClassList(res.classbycategory as any[]);
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleClassChange = async (classId: number) => {
        setSelectedClass(classId);
        setSelectedSection(undefined);
        setSelectedStaff(undefined);
        setSectionList([]);
        setSubStaffList([]);
        if (ASMAY_Id && selectedCategory && classId) {
            try {
                const res = await getSectionByClass({ ASMAY_Id, ASMCL_Id: classId, TTMC_Id: selectedCategory });
                if (Array.isArray(res) && res && res.sectionlist) setSectionList(res.sectionlist as any[]);
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleSectionChange = async (sectionId: number) => {
        setSelectedSection(sectionId);
        setSelectedStaff(undefined);
        setSubStaffList([]);
        if (ASMAY_Id && selectedCategory && selectedClass && sectionId) {
            try {
                const res = await getStaffByClassSection({
                    ASMAY_Id,
                    TTMC_Id: selectedCategory,
                    ASMCL_Id: selectedClass!,
                    ASMS_Id: sectionId
                });
                if (Array.isArray(res) && res && res.staffbyall) setSubStaffList(res.staffbyall as any[]);
            } catch (e) {
                console.error(e);
            }
        }
    };

    const addToGrid = () => {
        if (!selectedClass || !selectedSection || !selectedStaff || !nod) {
            toast.warning('Please select all fields');
            return;
        }

        const clsObj = classList.find((c) => c.asmcL_Id === selectedClass);
        const secObj = sectionList.find((s) => s.asmS_Id === selectedSection);
        const staffObj = subStaffList.find((s) => s.hrmE_Id === selectedStaff);

        // Check duplicate
        const exists = fields.some(
            (f: any) => f.ASMCL_Id === selectedClass && f.ASMS_Id === selectedSection && f.HRME_Id === selectedStaff
        );
        if (exists) {
            toast.warning('Already Exists');
            return;
        }

        append({
            ASMCL_Id: selectedClass,
            ASMS_Id: selectedSection,
            HRME_Id: selectedStaff,
            NOD: Number(nod),
            clsDisplay: clsObj?.asmcL_ClassName,
            sectDisplay: secObj?.asmC_SectionName,
            staffDisplay: staffObj?.hrmE_EmployeeFirstName
        });
    };

    const subColumns: ColumnDef<any>[] = useMemo(
        () => [
            { accessorKey: 'clsDisplay', header: 'Class' },
            { accessorKey: 'sectDisplay', header: 'Section' },
            { accessorKey: 'staffDisplay', header: 'Staff' },
            { accessorKey: 'NOD', header: 'No Of Days' },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => (
                    <Button type='button' variant='ghost' size='sm' onClick={() => remove(row.index)}>
                        <span className='text-red-500'>Delete</span>
                    </Button>
                )
            }
        ],
        [remove]
    );

    // View Columns
    const viewColumns: ColumnDef<any>[] = useMemo(
        () => [
            { accessorKey: 'clsDisplay', header: 'Class' },
            { accessorKey: 'sectDisplay', header: 'Section' },
            { accessorKey: 'staffDisplay', header: 'Staff' },
            { accessorKey: 'NOD', header: 'No Of Days' }
        ],
        []
    );

    const onEdit = async (item: any) => {
        try {
            const res = await getFixingPeriodSubjectDetails(item.ttfpsU_Id);
            if (res?.fix_period_subject_edit && (res.fix_period_subject_edit as any[]).length > 0) {
                const d = (res.fix_period_subject_edit as any[])[0];
                reset({
                    TTFPSU_Id: d.ttfpsU_Id,
                    ASMAY_Id: d.asmaY_Id,
                    TTMP_Id: d.ttmP_Id,
                    ISMS_Id: d.ismS_Id,
                    TTFPSU_SUbSelcFlag: d.ttfpsU_SUbSelcFlag,
                    TempararyArrayList: []
                });
                if (d.ttfpsU_SUbSelcFlag && res.fix_period_subject__classecedit) {
                    (res.fix_period_subject__classecedit as any[]).forEach((sub: any) => {
                        append({
                            ASMCL_Id: sub.asmcL_Id,
                            ASMS_Id: sub.asmS_Id,
                            HRME_Id: sub.hrmE_Id,
                            NOD: sub.ttfpsucC_Days,
                            clsDisplay: sub.asmcL_ClassName,
                            sectDisplay: sub.asmC_SectionName,
                            staffDisplay: sub.staffName // Check this property match API
                        });
                    });
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    const onView = async (item: any) => {
        try {
            setIsLoadingView(true);
            setViewDetails([]);
            const res = await getFixingPeriodSubjectDetails(item.ttfpsU_Id);
            if (res?.fix_period_subject__classecedit) {
                const details = (res.fix_period_subject__classecedit as any[]).map((sub: any) => ({
                    clsDisplay: sub.asmcL_ClassName,
                    sectDisplay: sub.asmC_SectionName,
                    staffDisplay: sub.staffName,
                    NOD: sub.ttfpsucC_Days
                }));
                setViewDetails(details);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingView(false);
        }
    };

    const onToggle = async (item: any) => {
        try {
            const payload = { TTFPSU_Id: item.ttfpsU_Id, TTFPSU_ActiveFlag: !item.ttfpsU_ActiveFlag };
            const res = await deactivateFixingPeriodSubject(payload);
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

    const onSubmit = async (data: FixingPeriodSubjectSchema) => {
        try {
            if (!data.TTFPSU_SUbSelcFlag) {
                data.TempararyArrayList = [];
            } else if (!data.TempararyArrayList || data.TempararyArrayList.length === 0) {
                toast.warning('Please add at least one Class-Section details');
                return;
            }

            const res = await saveFixingPeriodSubject(data);
            if (res?.returnval === true) {
                toast.success('Record Saved Successfully');
                window.location.reload();
            } else {
                toast.error(res?.message || 'Failed to save');
            }
        } catch (e) {
            console.error(e);
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
                    Add Period Subject Constraint
                </Button>
            </div>

            <CollapsibleSection
                title='Period Subject Constraints List'
                defaultOpen={true}
                variant='default'
                size='lg'
                className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                <GenericDataTable data={gridData} columns={periodSubjectColumns} totalItems={gridData.length} isLoading={false} />
            </CollapsibleSection>

            {(isAddFormOpen || isEditFormOpen) && (
                <CollapsibleSection
                    title={isEditFormOpen ? 'Edit Period Subject Constraint' : 'Add New Period Subject Constraint'}
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
                                </div>

                                <div className='flex items-center space-x-2'>
                                    <FormField
                                        control={form.control}
                                        name='TTFPSU_SUbSelcFlag'
                                        render={({ field }) => (
                                            <FormItem className='flex flex-row items-start space-x-3 space-y-0 p-4'>
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <div className='space-y-1 leading-none'>
                                                    <FormLabel>Fixing Class-Section Wise</FormLabel>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {TTFPSU_SUbSelcFlag && (
                                    <div className='space-y-4 rounded-md border bg-gray-50 p-4'>
                                        <h4 className='font-semibold'>Add Class Details</h4>
                                        <div className='grid grid-cols-1 items-end gap-4 md:grid-cols-5'>
                                            <div className='space-y-2'>
                                                <FormLabel>Category</FormLabel>
                                                <Select
                                                    onValueChange={(v) => handleCategoryChange(Number(v))}
                                                    value={selectedCategory?.toString()}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categoryList.map((item: any) => (
                                                            <SelectItem key={item.ttmC_Id} value={item.ttmC_Id.toString()}>
                                                                {item.ttmC_CategoryName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className='space-y-2'>
                                                <FormLabel>Class</FormLabel>
                                                <Select
                                                    onValueChange={(v) => handleClassChange(Number(v))}
                                                    value={selectedClass?.toString()}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select' />
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
                                                <FormLabel>Section</FormLabel>
                                                <Select
                                                    onValueChange={(v) => handleSectionChange(Number(v))}
                                                    value={selectedSection?.toString()}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {sectionList.map((item: any) => (
                                                            <SelectItem key={item.asmS_Id} value={item.asmS_Id.toString()}>
                                                                {item.asmS_SectionName || item.asmC_SectionName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className='space-y-2'>
                                                <FormLabel>Staff</FormLabel>
                                                <Select
                                                    onValueChange={(v) => setSelectedStaff(Number(v))}
                                                    value={selectedStaff?.toString()}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {subStaffList.map((item: any) => (
                                                            <SelectItem key={item.hrmE_Id} value={item.hrmE_Id.toString()}>
                                                                {item.hrmE_EmployeeCode}-{item.hrmE_EmployeeFirstName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className='space-y-2'>
                                                <FormLabel>No Of Days</FormLabel>
                                                <Input type='number' value={nod} onChange={(e) => setNod(e.target.value)} />
                                            </div>
                                        </div>
                                        <Button type='button' onClick={addToGrid}>
                                            Add
                                        </Button>
                                        {fields.length > 0 && (
                                            <GenericDataTable
                                                data={fields}
                                                columns={subColumns}
                                                totalItems={fields.length}
                                                isLoading={false}
                                            />
                                        )}
                                    </div>
                                )}

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

            <FixingViewModal
                isOpen={!!isDetailsViewOpen}
                onClose={closeDetailsView}
                title='Class-Section Wise Details'
                data={viewDetails}
                columns={viewColumns}
                isLoading={isLoadingView}
            />
        </div>
    );
}

export default function PeriodSubjectTab({ initialData }: PeriodSubjectTabProps) {
    return (
        <FormProvider>
            <PeriodSubjectTabContent initialData={initialData} />
        </FormProvider>
    );
}
