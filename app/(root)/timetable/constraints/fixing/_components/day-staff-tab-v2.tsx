'use client';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table/data-table';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { type FixingDayStaffSchema, fixingDayStaffSchema } from '@/schemas/timetable/constraints/fixing';
import {
    deactivateFixingDayStaff,
    getClassByCategory,
    getFixingDayStaffDetails,
    getSectionByClass,
    getSubjectByStaff,
    saveFixingDayStaff
} from '@/server/timetable/constraints/fixing';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ColumnDef } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type IFixingDayStaffList, dayStaffColumns } from './columns';

interface DayStaffTabProps {
    initialData: any;
}

function DayStaffTabContent({ initialData }: DayStaffTabProps) {
    const { isEditFormOpen, selectedRow, closeToggleForm, isToggleFormOpen } = useFormContext();

    const [academicList] = useState<any[]>(initialData?.yearlist || []);
    const [dayList] = useState<any[]>(initialData?.daylist || []);
    const [staffList, setStaffList] = useState<any[]>(initialData?.stafflist || []);
    const [gridData, setGridData] = useState<IFixingDayStaffList[]>(initialData?.fix_day_staff_list || []);

    const [classList, setClassList] = useState<any[]>([]);
    const [sectionList, setSectionList] = useState<any[]>([]);
    const [subSubjectList, setSubSubjectList] = useState<any[]>([]);
    const [categoryList] = useState<any[]>(initialData?.categorylist || []);

    const form = useForm<FixingDayStaffSchema>({
        resolver: zodResolver(fixingDayStaffSchema),
        defaultValues: {
            TTFDS_Id: 0,
            ASMAY_Id: undefined,
            TTMD_Id: undefined,
            HRME_Id: undefined,
            TTFDS_SUbSelcFlag: false,
            TempararyArrayList: []
        }
    });

    const { reset, setValue, watch, handleSubmit, control } = form;
    const ASMAY_Id = watch('ASMAY_Id');
    const TTFDS_SUbSelcFlag = watch('TTFDS_SUbSelcFlag');

    const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
    const [selectedClass, setSelectedClass] = useState<number | undefined>();
    const [selectedSection, setSelectedSection] = useState<number | undefined>();
    const [selectedSubject, setSelectedSubject] = useState<number | undefined>();
    const [nop, setNop] = useState<string>('');

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

    // Effect to handle Toggle (Active/Deactivate)
    useEffect(() => {
        if (isToggleFormOpen && selectedRow) {
            onToggle(selectedRow);
            closeToggleForm();
        }
    }, [isToggleFormOpen, selectedRow]);

    const handleCategoryChange = async (categoryId: number) => {
        setSelectedCategory(categoryId);
        setSelectedClass(undefined);
        setSelectedSection(undefined);
        setSelectedSubject(undefined);
        setClassList([]);
        setSectionList([]);
        setSubSubjectList([]);

        if (ASMAY_Id && categoryId) {
            try {
                const res = await getClassByCategory({ ASMAY_Id, TTMC_Id: categoryId });
                if (Array.isArray(res) && res && res.classbycategory) {
                    setClassList(res.classbycategory as any[]);
                }
            } catch (e) {
                console.error(e);
                toast.error('Failed to load classes');
            }
        }
    };

    const handleClassChange = async (classId: number) => {
        setSelectedClass(classId);
        setSelectedSection(undefined);
        setSelectedSubject(undefined);
        setSectionList([]);
        setSubSubjectList([]);

        if (ASMAY_Id && selectedCategory && classId) {
            try {
                const res = await getSectionByClass({
                    ASMAY_Id,
                    ASMCL_Id: classId,
                    TTMC_Id: selectedCategory
                });
                if (Array.isArray(res) && res && res.sectionlist) {
                    setSectionList(res.sectionlist as any[]);
                }
            } catch (e) {
                console.error(e);
                toast.error('Failed to load sections');
            }
        }
    };

    const handleSectionChange = async (sectionId: number) => {
        setSelectedSection(sectionId);
        setSelectedSubject(undefined);
        setSubSubjectList([]);
        const HRME_Id = watch('HRME_Id');

        if (ASMAY_Id && selectedClass && sectionId && HRME_Id) {
            try {
                const res = await getSubjectByStaff({
                    ASMAY_Id,
                    ASMCL_Id: selectedClass,
                    ASMS_Id: sectionId,
                    HRME_Id
                });
                if (Array.isArray(res) && res && res.subjectbystaff) {
                    setSubSubjectList(res.subjectbystaff as any[]);
                }
            } catch (e) {
                console.error(e);
                toast.error('Failed to load subjects');
            }
        }
    };

    const addToGrid = () => {
        if (!selectedClass || !selectedSection || !selectedSubject || !nop) {
            toast.warning('Please select all fields');
            return;
        }

        const clsObj = classList.find((c) => c.asmcL_Id === selectedClass);
        const secObj = sectionList.find((s) => s.asmS_Id === selectedSection);
        const subObj = subSubjectList.find((s) => s.ismS_Id === selectedSubject);

        // Check duplicate
        const exists = fields.some(
            (f: any) => f.ASMCL_Id === selectedClass && f.ASMS_Id === selectedSection && f.ISMS_Id === selectedSubject
        );

        if (exists) {
            toast.warning('Already Exists');
            return;
        }

        append({
            ASMCL_Id: selectedClass,
            ASMS_Id: selectedSection,
            ISMS_Id: selectedSubject,
            NOP: Number(nop),
            clsDisplay: clsObj?.asmcL_ClassName,
            sectDisplay: secObj?.asmC_SectionName || secObj?.asmS_SectionName,
            subDisplay: subObj?.ismS_SubjectName || subObj?.subjectName
        });

        // Clear input fields after adding
        setNop('');
    };

    const subColumns: ColumnDef<any>[] = useMemo(
        () => [
            {
                accessorKey: 'clsDisplay',
                header: 'Class'
            },
            {
                accessorKey: 'sectDisplay',
                header: 'Section'
            },
            {
                accessorKey: 'subDisplay',
                header: 'Subject'
            },
            {
                accessorKey: 'NOP',
                header: 'No Of Periods'
            },
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

    const onEdit = async (item: any) => {
        try {
            const res = await getFixingDayStaffDetails(item.ttfdS_Id);
            if (res?.fix_day_staff_edit && (res.fix_day_staff_edit as any[]).length > 0) {
                const d = (res.fix_day_staff_edit as any[])[0];

                reset({
                    TTFDS_Id: d.ttfdS_Id,
                    ASMAY_Id: d.asmaY_Id,
                    TTMD_Id: d.ttmD_Id,
                    HRME_Id: d.hrmE_Id,
                    TTFDS_SUbSelcFlag: d.ttfdS_SUbSelcFlag,
                    TempararyArrayList: []
                });

                if (d.ttfdS_SUbSelcFlag && res.fix_day_staff__classecedit) {
                    (res.fix_day_staff__classecedit as any[]).forEach((sub: any) => {
                        append({
                            ASMCL_Id: sub.asmcL_Id,
                            ASMS_Id: sub.asmS_Id,
                            ISMS_Id: sub.ismS_Id,
                            NOP: sub.ttfdscC_Periods || sub.ttscC_Periods,
                            clsDisplay: sub.asmcL_ClassName,
                            sectDisplay: sub.asmC_SectionName,
                            subDisplay: sub.ismS_SubjectName
                        });
                    });
                }
            }
        } catch (e) {
            console.error(e);
            toast.error('Failed to load edit data');
        }
    };

    const onToggle = async (item: any) => {
        try {
            const payload = {
                TTFDS_Id: item.ttfdS_Id,
                TTFDS_ActiveFlag: !item.ttfdS_ActiveFlag
            };
            const res = await deactivateFixingDayStaff(payload);
            if (res?.returnval === true) {
                toast.success('Status Updated');
                window.location.reload();
            } else {
                toast.error('Failed to update status');
            }
        } catch (e) {
            console.error(e);
            toast.error('Failed to update status');
        }
    };

    const onSubmit = async (data: FixingDayStaffSchema) => {
        try {
            if (!data.TTFDS_SUbSelcFlag) {
                data.TempararyArrayList = [];
            } else {
                if (!data.TempararyArrayList || data.TempararyArrayList.length === 0) {
                    toast.warning('Please add at least one Class-Section details');
                    return;
                }
            }

            const res = await saveFixingDayStaff(data);
            if (res?.returnval === true) {
                toast.success('Record Saved Successfully');
                window.location.reload();
            } else {
                toast.error(res?.message || 'Failed to save');
            }
        } catch (e) {
            console.error(e);
            toast.error('Failed to save');
        }
    };

    return (
        <div className='space-y-6'>
            {/* <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 rounded-md border bg-white p-4 shadow-sm'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                    <FormField 
                        control={form.control} 
                        name="ASMAY_Id" 
                         render={({ field }: { field: any }) => (
                            <FormItem>
                                <FormLabel>Academic Year</FormLabel>
                                <Select 
                                    onValueChange={(v) => field.onChange(Number(v))} 
                                    value={field.value?.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {academicList.map((item: any) => (
                                            <SelectItem 
                                                key={item.asmaY_Id} 
                                                value={item.asmaY_Id.toString()}
                                            >
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
                        name="TTMD_Id" 
                       render={({ field }: { field: any })=> (
                            <FormItem>
                                <FormLabel>Day</FormLabel>
                                <Select 
                                    onValueChange={(v) => field.onChange(Number(v))} 
                                    value={field.value?.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {dayList.map((item: any) => (
                                            <SelectItem 
                                                key={item.ttmD_Id} 
                                                value={item.ttmD_Id.toString()}
                                            >
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
                        name="HRME_Id" 
                       render={({ field }: { field: any })=> (
                            <FormItem>
                                <FormLabel>Staff</FormLabel>
                                <Select 
                                    onValueChange={(v) => field.onChange(Number(v))} 
                                    value={field.value?.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {staffList.map((item: any) => (
                                            <SelectItem 
                                                key={item.hrmE_Id} 
                                                value={item.hrmE_Id.toString()}
                                            >
                                                {item.hrmE_EmployeeCode} - {item.hrmE_EmployeeFirstName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} 
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <FormField 
                        control={form.control} 
                        name="TTFDS_SUbSelcFlag" 
                       render={({ field }: { field: any })=> (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                                <FormControl>
                                    <Checkbox 
                                        checked={field.value} 
                                        onCheckedChange={field.onChange} 
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Fixing Class-Section Wise</FormLabel>
                                </div>
                            </FormItem>
                        )} 
                    />
                </div>

                {TTFDS_SUbSelcFlag && (
                    <div className='space-y-4 rounded-md border bg-gray-50 p-4'>
                        <h4 className="font-semibold">Add Class Details</h4>
                        <div className='grid grid-cols-1 items-end gap-4 md:grid-cols-5'>
                            <div className="space-y-2">
                                <FormLabel>Category</FormLabel>
                                <Select 
                                    onValueChange={(v) => handleCategoryChange(Number(v))} 
                                    value={selectedCategory?.toString()}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categoryList.map((item: any) => (
                                            <SelectItem 
                                                key={item.ttmC_Id} 
                                                value={item.ttmC_Id.toString()}
                                            >
                                                {item.ttmC_CategoryName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <FormLabel>Class</FormLabel>
                                <Select 
                                    onValueChange={(v) => handleClassChange(Number(v))} 
                                    value={selectedClass?.toString()}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classList.map((item: any) => (
                                            <SelectItem 
                                                key={item.asmcL_Id} 
                                                value={item.asmcL_Id.toString()}
                                            >
                                                {item.asmcL_ClassName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <FormLabel>Section</FormLabel>
                                <Select 
                                    onValueChange={(v) => handleSectionChange(Number(v))} 
                                    value={selectedSection?.toString()}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sectionList.map((item: any) => (
                                            <SelectItem 
                                                key={item.asmS_Id} 
                                                value={item.asmS_Id.toString()}
                                            >
                                                {item.asmS_SectionName || item.asmC_SectionName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <FormLabel>Subject</FormLabel>
                                <Select 
                                    onValueChange={(v) => setSelectedSubject(Number(v))} 
                                    value={selectedSubject?.toString()}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subSubjectList.map((item: any) => (
                                            <SelectItem 
                                                key={item.ismS_Id} 
                                                value={item.ismS_Id.toString()}
                                            >
                                                {item.ismS_SubjectName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <FormLabel>Periods</FormLabel>
                                <Input 
                                    type="number" 
                                    value={nop} 
                                    onChange={(e) => setNop(e.target.value)} 
                                    min="1"
                                />
                            </div>
                        </div>
                        <Button type="button" onClick={addToGrid}>Add</Button>

                        {fields.length > 0 && (
                            <DataTable
                                data={fields}
                                columns={subColumns}
                                totalItems={fields.length}
                            />
                        )}
                    </div>
                )}

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => reset()}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        Save
                    </Button>
                </div>
            </form> */}

            <DataTable data={gridData} columns={dayStaffColumns} totalItems={gridData.length} />
        </div>
    );
}

export default function DayStaffTab({ initialData }: DayStaffTabProps) {
    return (
        <FormProvider>
            <DayStaffTabContent initialData={initialData} />
        </FormProvider>
    );
}
