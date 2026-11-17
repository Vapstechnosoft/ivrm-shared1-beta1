'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useFeeAdjustmentGroupDropDown,
    useFeeAdjustmentHeadDropDown,
    useFeeAdjustmentToGroupDropDown,
    useFeeAdjustmentToHead,
    useopeningClassdropdowndatafee,
    useopeningSectiondropdowndatafee,
    useopeningacademicyerdropdowndatafee
} from '@/hooks/fees/useTrasactions';
import { getFeeAdjustmentSave, studentNameDropdown } from '@/server/fees/trasactions/fee_adjustment';

import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { format } from 'date-fns';
import { CalendarIcon, Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

type FromHeadRow = {
    fmH_Id: number;
    fmH_FeeNameF: string;
    ftI_NameF: string;
    fsS_RunningExcessAmount: number;
};

type ToHeadRow = {
    fsA_To_FMH_Id: number;
    fsA_TO_FTI_Id: number;
    fmH_FeeNameT: string;
    ftI_NameT: string;
    tobepaid: number;
};

export default function AddFeeAdjustmentForm({
    onSuccess,
    className = ''
}: {
    onSuccess?: () => void;
    className?: string;
}) {
    const { control, reset } = useForm({
        defaultValues: {
            academicYearId: undefined,
            classId: undefined,
            sectionId: undefined
        }
    });

    const academicYearId = useWatch({ control, name: 'academicYearId' });
    const classId = useWatch({ control, name: 'classId' });
    const sectionId = useWatch({ control, name: 'sectionId' });

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [nameType, setNameType] = useState<'Name:Adm.No' | 'Adm.No:Name'>('Name:Adm.No');
    const [refundableType, setRefundableType] = useState<'Refunable' | 'NonRefundable'>('Refunable');
    const [studentWise, setStudentWise] = useState<string>('');
    const [fromGroupSelections, setFromGroupSelections] = useState<Set<number>>(new Set());
    const [toGroupSelections, setToGroupSelections] = useState<Set<number>>(new Set());
    const [loadingDropdown, setLoadingDropdown] = useState(false);
    const [studentDropdownList, setStudentDropdownList] = useState<{ value: string; label: string }[]>([]);
    const [adjustAmounts, setAdjustAmounts] = useState<{ [key: string]: number }>({});

    const { data: academicYear, isLoading: loadingAcademicYear } = useopeningacademicyerdropdowndatafee();
    const { data: classdata, isLoading: loadingClasses } = useopeningClassdropdowndatafee();
    const { data: sectiondata, isLoading: loadingSections } = useopeningSectiondropdowndatafee(
        academicYearId ? Number(academicYearId) : 0,
        classId ? Number(classId) : 0
    );

    const { data: groupdata, isLoading: loadingGroup } = useFeeAdjustmentGroupDropDown(
        refundableType,
        academicYearId ? Number(academicYearId) : 0,
        studentWise ? Number(studentWise) : 0
    );

    const { data: toGroupdata, isLoading: loadingToGroup } = useFeeAdjustmentToGroupDropDown(
        academicYearId ? Number(academicYearId) : 0,
        studentWise ? Number(studentWise) : 0
    );

    const selectedFromGroupId = useMemo(() => {
        return fromGroupSelections.size > 0 ? [...fromGroupSelections][0] : undefined;
    }, [fromGroupSelections]);

    const selectedToGroupId = useMemo(() => {
        return toGroupSelections.size > 0 ? [...toGroupSelections][0] : undefined;
    }, [toGroupSelections]);

    const { data: headdata, isLoading: loadingHead } = useFeeAdjustmentHeadDropDown(
        refundableType,
        academicYearId ? Number(academicYearId) : 0,
        studentWise ? Number(studentWise) : 0,
        selectedFromGroupId ?? 0
    );

    const { data: toHeaddata, isLoading: loadingToHead } = useFeeAdjustmentToHead(
        academicYearId ? Number(academicYearId) : 0,
        studentWise ? Number(studentWise) : 0,
        selectedToGroupId ?? 0
    );

    const canShowAdjustmentBoxes = !!academicYearId && !!classId && !!sectionId && !!studentWise;
    const canSelectTo = fromGroupSelections.size > 0;

    const toggleFromGroup = (groupId: number) => {
        setFromGroupSelections(new Set([groupId]));
    };

    const toggleToGroup = (groupId: number) => {
        if (!canSelectTo) return;
        setToGroupSelections(new Set([groupId]));
    };

    const handleReset = () => {
        reset();
        setSelectedDate(new Date());
        setNameType('Name:Adm.No');
        setRefundableType('Refunable');
        setStudentWise('');
        setFromGroupSelections(new Set());
        setToGroupSelections(new Set());
        setAdjustAmounts({});
        setStudentDropdownList([]);
    };

    useEffect(() => {
        let isMounted = true;
        setLoadingDropdown(true);
        setStudentDropdownList([]);
        setStudentWise('');

        const fetchStudents = async () => {
            if (!academicYearId || !classId) {
                setLoadingDropdown(false);
                return;
            }

            try {
                const payload = {
                    asmay_Id: Number(academicYearId),
                    fillClasFlg: String(classId),
                    fillSecCls: sectionId ? String(sectionId) : '0',
                    filterInitialData: nameType === 'Name:Adm.No' ? 'NameRegNo' : 'RegNoName'
                };
                console.log('payload', JSON.stringify(payload));
                const res = await studentNameDropdown(payload);
                if (!isMounted) return;

                if (res?.data && Array.isArray(res.data)) {
                    const formatted = res.data.map((s: any) => ({
                        value: String(s.amst_Id || s.AMST_Id || s.studentId),
                        label:
                            [s.amsT_FirstName || s.firstName, s.amsT_MiddleName || s.middleName, s.amsT_LastName || s.lastName]
                                .filter(Boolean)
                                .join(' ')
                                .trim() || 'Unknown'
                    }));
                    setStudentDropdownList(formatted);
                }
            } catch (error) {
                toast.error('Failed to load students');
            } finally {
                if (isMounted) setLoadingDropdown(false);
            }
        };

        fetchStudents();

        return () => {
            isMounted = false;
        };
    }, [academicYearId, classId, sectionId, nameType]);

    useEffect(() => {
        setFromGroupSelections(new Set());
        setToGroupSelections(new Set());
        setAdjustAmounts({});
    }, [studentWise, refundableType]);

    const handleSave = async () => {
        if (fromGroupSelections.size === 0) {
            toast.error('Please select at least one group from "Adjustment From Group"');
            return;
        }
        if (toGroupSelections.size === 0) {
            toast.error('Please select at least one group from "Adjustment To Group"');
            return;
        }

        const totalAdjusted = Object.values(adjustAmounts).reduce((a, b) => a + b, 0);
        if (totalAdjusted <= 0) {
            toast.error('Please enter at least one adjustment amount greater than 0');
            return;
        }

        const fromGroupId = [...fromGroupSelections][0];
        const toGroupId = [...toGroupSelections][0];

        // Find selected group info
        const fromGroup = groupdata?.data?.find((g: any) => g.fsA_From_FMG_Id === fromGroupId);
        const toGroup = toGroupdata?.data?.find((g: any) => g.fsA_To_FMG_Id === toGroupId);

        if (!fromGroup || !toGroup) {
            toast.error('Selected group information not found');
            return;
        }
        const fromGroups = (headdata?.data || [])
            .filter((h: any) => h.fsS_RunningExcessAmount > 0)
            .map((head: any) => ({
                fmG_Id: fromGroup.fsA_From_FMG_Id || 0,
                fmH_Id: head.fsA_From_FMH_Id || head.fmH_Id || 0,
                ftI_Id: head.fsA_From_FTI_Id || head.ftI_Id || 0,
                fmA_Id: head.fsA_From_FMA_Id || head.fmA_Id || 0,
                adjustedAmount: 0,
                runningExcessAmount: head.fsS_RunningExcessAmount || 0
            }));

        if (fromGroups.length === 0) {
            toast.error('No excess amount available in the selected "From" group heads');
            return;
        }

        const toGroups = (toHeaddata?.data || [])
            .map((head: any, index: number) => {
                const headId = head.fsA_To_FMH_Id;
                const installmentId = head.fsA_TO_FTI_Id;
                const uniqueKey = `adjust-${headId}-${installmentId}-${index}`;
                return {
                    fmG_Id: toGroup.fsA_To_FMG_Id || 0,
                    fmH_Id: head.fsA_To_FMH_Id || 0,
                    ftI_Id: head.fsA_TO_FTI_Id || 0,
                    fmA_Id: head.fsA_To_FMA_Id || 0,
                    adjustedAmount: adjustAmounts[uniqueKey] || 0, // Use the same key
                    runningExcessAmount: 0
                };
            })
            .filter((item: any) => item.adjustedAmount > 0);

        if (toGroups.length === 0) {
            toast.error('No valid adjustment amounts entered');
            return;
        }

        const totalExcess = fromGroups.reduce((sum: number, g: any) => sum + g.runningExcessAmount, 0);
        if (totalAdjusted > totalExcess) {
            toast.error(`Adjustment amount (${totalAdjusted}) exceeds available excess (${totalExcess})`);
            return;
        }

        const payload = {
            fsA_Id: 0,
            asmaY_Id: Number(academicYearId),
            amsT_Id: Number(studentWise),
            adjustmentDate: selectedDate.toISOString(),
            refundable: refundableType === 'Refunable',
            fromGroups,
            toGroups
        };

        try {
            await getFeeAdjustmentSave(payload);
            toast.success('Fee adjustment saved successfully!');
            onSuccess?.();
            handleReset();
        } catch (error: any) {
            toast.error(error?.message || 'Failed to save fee adjustment');
        }
    };

    const fromHeads: FromHeadRow[] = (headdata?.data || []).map((h: any) => ({
        fmH_Id: h.fsA_From_FMH_Id,
        fmH_FeeNameF: h.fmH_FeeNameF,
        ftI_NameF: h.ftI_NameF,
        fsS_RunningExcessAmount: h.fsS_RunningExcessAmount
    }));

    const toHeads: ToHeadRow[] = (toHeaddata?.data || []).map((h: any) => ({
        fsA_To_FMH_Id: h.fsA_To_FMH_Id,
        fsA_TO_FTI_Id: h.fsA_TO_FTI_Id,
        fmH_FeeNameT: h.fmH_FeeNameT,
        ftI_NameT: h.ftI_NameT,
        tobepaid: h.tobepaid
    }));

    function TableDataFrom({ heads }: { heads: FromHeadRow[] }) {
        const columns: ColumnDef<FromHeadRow>[] = [
            { id: 'select', header: () => <div className='w-10' />, cell: () => <Checkbox checked={true} disabled />, size: 50 },
            {
                accessorKey: 'fmH_FeeNameF',
                header: 'Head',
                cell: ({ row }) => <div className='font-medium'>{row.original.fmH_FeeNameF}</div>
            },
            { accessorKey: 'ftI_NameF', header: 'Installment', cell: ({ row }) => <div>{row.original.ftI_NameF || 'One Time'}</div> },
            {
                accessorKey: 'fsS_RunningExcessAmount',
                header: 'Excess Amount',
                cell: ({ row }) => <div className='font-medium text-green-600'>{row.original.fsS_RunningExcessAmount || 0}</div>
            }
        ];

        const table = useReactTable({
            data: heads,
            columns,
            getCoreRowModel: getCoreRowModel(),
            getRowId: (row, index) => `${row.fmH_Id}-${index}`
        });

        return (
            <table className='w-full bg-white'>
                <thead className='bg-blue-100 text-black'>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className='px-4 py-3 text-left' style={{ width: header.getSize() }}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className='border-b'>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className='px-4 py-3'>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    function TableDataTo({ heads }: { heads: ToHeadRow[] }) {
        const columns: ColumnDef<ToHeadRow>[] = [
            { id: 'select', header: () => <div className='w-10' />, cell: () => <Checkbox checked={true} disabled />, size: 50 },
            {
                accessorKey: 'fmH_FeeNameT',
                header: 'Head',
                cell: ({ row }) => <div className='font-medium'>{row.original.fmH_FeeNameT}</div>
            },
            { accessorKey: 'ftI_NameT', header: 'Installment', cell: ({ row }) => <div>{row.original.ftI_NameT || 'One Time'}</div> },
            {
                accessorKey: 'tobepaid',
                header: 'Balance',
                cell: ({ row }) => <div className='font-medium text-red-600'>{row.original.tobepaid ?? 0}</div>
            },
            // {
            //     id: 'adjustAmount',
            //     header: 'Adjust Amount',
            //     cell: ({ row }) => {
            //         const headId = row.original.fmH_Id;
            //         const value = adjustAmounts[headId] ?? 0;

            //         return (
            //             <Input
            //                 type='number'
            //                 min='0'
            //                 className='w-28'
            //                 value={value}
            //                 onChange={(e) => {
            //                     const newValue = Number(e.target.value) || 0;
            //                     setAdjustAmounts((prev) => ({
            //                         ...prev,
            //                         [headId]: newValue
            //                     }));
            //                 }}
            //             />
            //         );
            //     }
            // }
            {
                id: 'adjustAmount',
                header: 'Adjust Amount',
                cell: ({ row }) => {
                    const headId = row.original.fsA_To_FMH_Id;
                    const installmentId = row.original.fsA_TO_FTI_Id;
                    const uniqueKey = `adjust-${headId}-${installmentId}-${row.index}`;
                    const value = adjustAmounts[uniqueKey] ?? 0;
                    return (
                        <Input
                            type='number'
                            min='0'
                            className='w-28'
                            defaultValue={value}
                            onBlur={(e) => {
                                const num = Number(e.target.value) || 0;
                                setAdjustAmounts((prev) => ({
                                    ...prev,
                                    [uniqueKey]: num
                                }));
                            }}
                            // onChange={(e) => {
                            //                                 const num = Number(e.target.value) || 0;

                            //                                     setAdjustAmounts((prev) => ({
                            //                                         ...prev,
                            //                                         [uniqueKey]: num
                            //                                     }));

                            //                             }}
                        />
                    );
                }
            }
        ];

        const table = useReactTable({
            data: heads,
            columns,
            getCoreRowModel: getCoreRowModel(),
            getRowId: (row, index) => `${row.fsA_To_FMH_Id}-${index}`
        });

        return (
            <table className='w-full bg-white'>
                <thead className='bg-blue-100 text-black'>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className='px-4 py-3 text-left' style={{ width: header.getSize() }}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className='border-b'>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className='px-4 py-3'>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            <div className='grid gap-8 lg:grid-cols-2'>
                <div className='space-y-6'>
                    <div className='flex items-center gap-4'>
                        <Label className='w-40 text-right'>
                            Academic Year <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                            name='academicYearId'
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className='w-80'>
                                        <SelectValue placeholder={loadingAcademicYear ? 'Loading...' : 'Select Academic Year'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {academicYear?.data?.map((item: any) => (
                                            <SelectItem key={item.asmaY_Id} value={String(item.asmaY_Id)}>
                                                {item.asmaY_Year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div className='flex items-center gap-4'>
                        <Label className='w-40 text-right'>
                            Class <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                            name='classId'
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className='w-80'>
                                        <SelectValue placeholder={loadingClasses ? 'Loading...' : 'Select Class'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classdata?.data?.map((item: any) => (
                                            <SelectItem key={item.asmcL_Id} value={String(item.asmcL_Id)}>
                                                {item.asmcL_ClassName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div className='flex items-center gap-4'>
                        <Label className='w-40 text-right'>
                            Section <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                            name='sectionId'
                            control={control}
                            render={({ field }) => (
                                <Select disabled={!classId || loadingSections} onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className='w-80'>
                                        <SelectValue placeholder={loadingSections ? 'Loading...' : 'Select Section'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sectiondata?.data?.map((item: any) => (
                                            <SelectItem key={item.asmS_Id} value={String(item.asmS_Id)}>
                                                {item.asmC_SectionName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div className='flex items-center gap-4'>
                        <Label className='w-40 text-right'>
                            Adjustment Date <span className='text-red-500'>*</span>
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant='outline' className='w-80 justify-start text-left font-normal'>
                                    <CalendarIcon className='mr-2 h-4 w-4' />
                                    {format(selectedDate, 'dd-MM-yyyy')}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0'>
                                <Calendar mode='single' selected={selectedDate} onSelect={(d) => d && setSelectedDate(d)} />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className='space-y-6'>
                    <div className='flex justify-center gap-8 rounded-lg border bg-white p-4'>
                        <label className='flex cursor-pointer items-center gap-3'>
                            <input
                                type='radio'
                                name='nameType'
                                checked={nameType === 'Name:Adm.No'}
                                onChange={() => setNameType('Name:Adm.No')}
                                className='h-5 w-5 text-blue-600'
                            />
                            <span className='font-medium'>Name:Adm.No</span>
                        </label>
                        <label className='flex cursor-pointer items-center gap-3'>
                            <input
                                type='radio'
                                name='nameType'
                                checked={nameType === 'Adm.No:Name'}
                                onChange={() => setNameType('Adm.No:Name')}
                                className='h-5 w-5 text-blue-600'
                            />
                            <span className='font-medium'>Adm.No:Name</span>
                        </label>
                    </div>

                    <div className='flex items-center gap-4'>
                        <Label className='w-40 text-right'>
                            Student Name <span className='text-red-500'>*</span>
                        </Label>
                        <Select
                            value={studentWise}
                            onValueChange={setStudentWise}
                            disabled={loadingDropdown || studentDropdownList.length === 0}>
                            <SelectTrigger className='w-80'>
                                <SelectValue
                                    placeholder={
                                        loadingDropdown
                                            ? 'Loading students...'
                                            : studentDropdownList.length === 0
                                              ? 'No students found'
                                              : 'Select Student'
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {studentDropdownList.map((student) => (
                                    <SelectItem key={student.value} value={student.value}>
                                        {student.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='flex justify-center gap-8 rounded-lg border bg-white p-4'>
                        <label className='flex cursor-pointer items-center gap-3'>
                            <input
                                type='radio'
                                name='Refunable'
                                checked={refundableType === 'Refunable'}
                                onChange={() => setRefundableType('Refunable')}
                                className='h-5 w-5 text-blue-600'
                            />
                            <span className='font-medium'>Refundable</span>
                        </label>
                        <label className='flex cursor-pointer items-center gap-3'>
                            <input
                                type='radio'
                                name='Refunable'
                                checked={refundableType === 'NonRefundable'}
                                onChange={() => setRefundableType('NonRefundable')}
                                className='h-5 w-5 text-blue-600'
                            />
                            <span className='font-medium'>Non Refundable</span>
                        </label>
                    </div>
                </div>
            </div>

            {canShowAdjustmentBoxes && (
                <>
                    <div className='grid grid-cols-1 gap-6 pt-4 lg:grid-cols-2'>
                        <div className='overflow-hidden rounded-lg border-2 border-blue-400'>
                            <div className='justify-center bg-blue-100 px-4 py-3 font-semibold text-black'>Adjustment From Group</div>
                            <div className='relative min-h-48 bg-gray-50 p-6'>
                                {loadingGroup ? (
                                    <p className='absolute inset-0 flex items-center justify-center text-gray-500'>Loading fee groups...</p>
                                ) : !groupdata?.data || groupdata.data.length === 0 ? (
                                    <p className='absolute inset-0 flex items-center justify-center text-gray-500'>
                                        No fee group available
                                    </p>
                                ) : (
                                    groupdata.data.map((group: any) => (
                                        <div key={group.fsA_From_FMG_Id} className='mb-3 flex items-center space-x-3'>
                                            <Checkbox
                                                checked={fromGroupSelections.has(group.fsA_From_FMG_Id)}
                                                onCheckedChange={() => toggleFromGroup(group.fsA_From_FMG_Id)}
                                            />
                                            <Label className='cursor-pointer select-none text-lg'>{group.fmG_GroupNameF}</Label>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className='relative overflow-hidden rounded-lg border-2 border-blue-400'>
                            <div className='justify-center bg-blue-100 px-4 py-3 font-semibold text-black'>Adjustment To Group</div>
                            <div className={`min-h-48 bg-gray-50 p-6 ${!canSelectTo ? 'opacity-50' : ''}`}>
                                {loadingToGroup ? (
                                    <p className='text-center text-gray-500'>Loading To Groups...</p>
                                ) : !toGroupdata?.data || toGroupdata.data.length === 0 ? (
                                    <p className='text-center text-gray-500'>No fee heads available</p>
                                ) : (
                                    toGroupdata.data.map((head: any) => (
                                        <div key={head.fsA_To_FMG_Id} className='mb-3 flex items-center space-x-3'>
                                            <Checkbox
                                                checked={toGroupSelections.has(head.fsA_To_FMG_Id)}
                                                onCheckedChange={() => toggleToGroup(head.fsA_To_FMG_Id)}
                                                disabled={!canSelectTo}
                                            />
                                            <Label className={`select-none text-lg ${!canSelectTo ? 'text-gray-500' : 'cursor-pointer'}`}>
                                                {head.fmG_GroupNameT}
                                            </Label>
                                        </div>
                                    ))
                                )}
                            </div>
                            {!canSelectTo && (
                                <div className='pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg bg-gray-100/80'>
                                    <p className='font-medium text-gray-700'>Select a group from "Adjustment From Group" first</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {(fromGroupSelections.size > 0 || toGroupSelections.size > 0) && (
                        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                            {fromGroupSelections.size > 0 && fromHeads.length > 0 && (
                                <div className='overflow-hidden rounded-lg border-2 border-blue-400'>
                                    <div className='rounded-t-lg bg-blue-900 px-4 py-3 font-semibold text-white'>Adjusted From Head</div>
                                    <div className='overflow-x-auto'>
                                        <TableDataFrom heads={fromHeads} />
                                    </div>
                                </div>
                            )}

                            {toGroupSelections.size > 0 && toHeads.length > 0 && (
                                <div className='overflow-hidden rounded-lg border-2 border-blue-400'>
                                    <div className='rounded-t-lg bg-blue-900 px-4 py-3 font-semibold text-white'>Adjusted To Head</div>
                                    <div className='overflow-x-auto'>
                                        <TableDataTo heads={toHeads} />
                                    </div>
                                </div>
                            )}

                            {fromGroupSelections.size > 0 && fromHeads.length === 0 && (
                                <div className='rounded-lg border-2 border-gray-300 border-dashed p-8 text-center text-gray-500'>
                                    No excess amount in selected group
                                </div>
                            )}
                            {toGroupSelections.size > 0 && toHeads.length === 0 && (
                                <div className='rounded-lg border-2 border-gray-300 border-dashed p-8 text-center text-gray-500'>
                                    {loadingToHead ? 'Loading heads...' : 'No heads available for selected group'}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            <div className='flex justify-center gap-6 border-t pt-8'>
                <Button size='lg' onClick={handleSave} className='w-full sm:w-auto'>
                    <Save className='mr-2 h-5 w-5' />
                    Save
                </Button>
                <Button size='lg' variant='outline' onClick={handleReset} className='w-full sm:w-auto'>
                    CANCEL
                </Button>
            </div>
        </div>
    );
}
