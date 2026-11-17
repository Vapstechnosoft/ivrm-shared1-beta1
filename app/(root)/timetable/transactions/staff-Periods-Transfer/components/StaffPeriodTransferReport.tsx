'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useSectionsByClass,
    useStaffPeriodDetails,
    useStaffPeriodTransferMasters
} from '@/hooks/timetable/transaction/useStaffPeriodTransfer';
import { cn } from '@/lib/utils';
import { type StaffPeriodTransferValues, staffPeriodTransferSchema } from '@/schemas/timetable/transactions/staffPeriodTransfer';
import { saveStaffPeriodTransfer } from '@/server/timetable/transactions/staffPeriodTransfer';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare, Loader2, Send, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface StaffPeriodTransferReportProps {
    data: {
        asmaY_Id: string;
        hrmE_Id: string;
    };
}

export default function StaffPeriodTransferReport({ data }: StaffPeriodTransferReportProps) {
    const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
    const [targetStaffId, setTargetStaffId] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        control,
        watch,
        reset,
        formState: { errors }
    } = useForm<StaffPeriodTransferValues>({
        resolver: zodResolver(staffPeriodTransferSchema),
        defaultValues: {
            asmaY_Id: data.asmaY_Id,
            hrmE_Id: data.hrmE_Id,
            asmcL_Id: '0',
            asms_Id: '0',
            ismS_Id: '0'
        }
    });

    const watchAll = watch();

    const { data: periods } = useStaffPeriodDetails({
        asmaY_Id: Number(data.asmaY_Id),
        hrmE_Id: Number(data.hrmE_Id),
        asmcL_Id: Number(watchAll.asmcL_Id || 0),
        asms_Id: Number(watchAll.asms_Id || 0),
        ismS_Id: Number(watchAll.ismS_Id || 0)
    });

    const { data: masters } = useStaffPeriodTransferMasters();
    const { data: sections, isLoading: sectionsLoading } = useSectionsByClass(Number(watchAll.asmcL_Id || 0));

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timetableStructure = [1, 2, 'BREAK', 3, 4, 5, 'BREAK', 6, 7, 8];

    const toggleCell = (day: string, period: number | string) => {
        if (period === 'BREAK') return;
        const key = `${day}-${period}`;
        setSelectedPeriods((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
    };

    const handleSelectAll = () => {
        const all: string[] = [];
        days.forEach((day) =>
            timetableStructure.forEach((p) => {
                if (p !== 'BREAK') all.push(`${day}-${p}`);
            })
        );
        setSelectedPeriods(all);
    };

    const handleTransfer = async () => {
        if (!targetStaffId) return toast.error('Select target staff');

        setIsSaving(true);
        try {
            const payload = {
                asmaY_Id: Number(data.asmaY_Id),
                from_hrmE_Id: Number(data.hrmE_Id),
                to_hrmE_Id: Number(targetStaffId),
                selectedPeriods
            };

            const res = await saveStaffPeriodTransfer(payload);
            if (res.success) {
                toast.success('Transfer successful');
                setSelectedPeriods([]);
            }
        } catch {
            toast.error('Transfer failed');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = () => {
        reset();
        setSelectedPeriods([]);
        toast.success('Selection cleared');
        // onFetch();
        // reset({
        //     asmaY_Id: "",
        //     hrmE_Id: "",
        // });
        // onFetch(null); // 🔥 clear report grid
    };

    return (
        <div className='space-y-6 p-4'>
            {/* Header */}

            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                {/* Class */}
                <div className='space-y-2'>
                    <Label className='font-bold text-purple-900 text-xs'>Class</Label>
                    <Controller
                        name='asmcL_Id'
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className='h-10'>
                                    <SelectValue placeholder='-- All Classes --' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem key='all-classes' value='0'>
                                        All Classes
                                    </SelectItem>
                                    {masters?.classes?.map((c) => (
                                        <SelectItem key={`class-${c.asmcL_Id}`} value={String(c.asmcL_Id)}>
                                            {c.asmcL_ClassName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Section */}
                <div className='space-y-2'>
                    <Label className='font-bold text-purple-900 text-xs'>Section</Label>
                    <Controller
                        name='asms_Id'
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className='h-10'>
                                    <SelectValue placeholder='-- All Sections --' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem key='all-sections' value='0'>
                                        All Sections
                                    </SelectItem>
                                    {sectionsLoading ? (
                                        <SelectItem key='loading' value='loading' disabled>
                                            Loading sections...
                                        </SelectItem>
                                    ) : (
                                        sections?.map((s) => (
                                            <SelectItem key={`section-${s.asms_Id}`} value={String(s.asms_Id)}>
                                                {s.asms_SectionName}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Subject */}
                <div className='space-y-2'>
                    <Label className='font-bold text-purple-900 text-xs'>Subject</Label>
                    <Controller
                        name='ismS_Id'
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className='h-10'>
                                    <SelectValue placeholder='-- All Subjects --' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem key='all-subjects' value='0'>
                                        All Subjects
                                    </SelectItem>
                                    {masters?.subjects?.map((s) => (
                                        <SelectItem key={`subject-${s.ismS_Id}`} value={String(s.ismS_Id)}>
                                            {s.ismS_SubjectName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            </div>

            {/*Select All button */}
            <div className='flex items-start justify-end rounded-xl border border-purple-100 bg-slate-50/30 p-2'>
                <Button size='sm' onClick={handleSelectAll} className='h-8 bg-orange-500 px-2 text-white text-xs hover:bg-orange-600'>
                    <CheckSquare className='mr-1 h-4 w-4' />
                    Select All
                </Button>
            </div>

            {/* Timetable */}
            <div className='overflow-x-auto rounded-xl border border-purple-100 bg-slate-50/30'>
                <table className='w-full border-collapse bg-white'>
                    <thead>
                        <tr className='bg-purple-600 text-white'>
                            <th className='border p-3 font-medium text-sm'>Day</th>
                            {timetableStructure.map((c, i) => (
                                <th key={`header-p-${i}`} className='border p-3 text-center font-medium text-sm'>
                                    {c === 'BREAK' ? '—' : `P${c}`}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {days.map((day) => (
                            <tr key={`row-${day}`} className='border-b last:border-0'>
                                <td className='border bg-slate-50 p-3 font-bold text-sm'>{day}</td>
                                {timetableStructure.map((p, i) => {
                                    if (p === 'BREAK')
                                        return (
                                            <td
                                                key={`break-${day}-${i}`}
                                                className='rotate-180 border bg-slate-100/50 p-2 text-center font-bold text-[10px] text-slate-400 [writing-mode:vertical-lr]'>
                                                Break
                                            </td>
                                        );

                                    const key = `${day}-${p}`;
                                    const isSelected = selectedPeriods.includes(key);
                                    const periodData = periods?.find(
                                        (p_row: any) =>
                                            p_row.day === day && Number(p_row.periodNo || p_row.ttmP_Period || p_row.period) === Number(p)
                                    );

                                    return (
                                        <td
                                            key={`cell-${day}-${p}-${i}`}
                                            onClick={() => toggleCell(day, p)}
                                            className={cn(
                                                'relative h-20 w-32 cursor-pointer border p-2 text-center transition-all',
                                                isSelected
                                                    ? 'z-10 scale-[0.98] bg-purple-600 text-white shadow-inner'
                                                    : 'hover:bg-purple-50',
                                                !periodData && !isSelected && 'bg-slate-50/20'
                                            )}>
                                            {periodData ? (
                                                <div className='space-y-1'>
                                                    <p className='line-clamp-2 font-bold text-[10px] uppercase'>
                                                        {periodData.ismS_SubjectName || periodData.subject}
                                                    </p>
                                                    <p className='text-[9px] opacity-80'>
                                                        {periodData.asmcL_ClassName}-
                                                        {periodData.asms_SectionName || periodData.classSection}
                                                    </p>
                                                </div>
                                            ) : (
                                                <></>
                                                // <span className="text-[10px] text-slate-300 italic"></span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Bottom Bar */}
            {selectedPeriods.length > 0 && (
                <div className='mt-4 rounded-2xl border-2 border-purple-100 bg-white p-6 shadow-lg'>
                    <div className='flex flex-col items-center justify-between gap-6 md:flex-row'>
                        <div className='flex items-center gap-4'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-600'>
                                {selectedPeriods.length}
                            </div>
                            <div>
                                <p className='font-bold text-slate-900 text-sm'>Periods Selected</p>
                                <p className='text-slate-500 text-xs'>Ready for transfer/replacement</p>
                            </div>
                        </div>

                        <div className='flex items-center gap-3'>
                            <Button
                                onClick={handleDelete}
                                variant='outline'
                                className='h-11 border-red-200 px-6 text-red-600 hover:bg-red-50'>
                                <Trash2 className='mr-2 h-4 w-4' />
                                Reset
                            </Button>
                        </div>

                        <div className='hidden h-10 w-px bg-slate-200 md:block' />

                        <div className='flex max-w-md flex-1 items-end gap-3'>
                            <div className='flex-1'>
                                <Label className='font-bold text-purple-900 text-xs uppercase'>Target Staff Member</Label>
                                <Select value={targetStaffId} onValueChange={setTargetStaffId}>
                                    <SelectTrigger className='h-11 border-purple-100'>
                                        <SelectValue placeholder='Select staff' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {masters?.staff
                                            ?.filter((s) => s.hrmE_Id.toString() !== data.hrmE_Id)
                                            .map((s) => (
                                                <SelectItem key={`staff-${s.hrmE_Id}`} value={String(s.hrmE_Id)}>
                                                    {s.staffName}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                onClick={handleTransfer}
                                disabled={isSaving || !targetStaffId}
                                className='h-11 bg-orange-500 px-8 hover:bg-orange-600'>
                                {isSaving ? (
                                    <Loader2 className='animate-spin' />
                                ) : (
                                    <>
                                        <Send className='mr-2 h-4 w-4' /> Save & Replace
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
