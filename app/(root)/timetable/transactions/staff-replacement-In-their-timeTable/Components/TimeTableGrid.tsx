'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    type StaffReplacementInTheirTimetableValues,
    staffReplacementInTheirTimeTableSchema
} from '@/schemas/timetable/transactions/staff-replacement-In-their-timeTable';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRightLeft, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface TimeTableGridProps {
    params: any;
}

export default function TimeTableGrid({ params }: TimeTableGridProps) {
    // selection1 is the first box you click, selection2 is the second
    const [selection1, setSelection1] = useState<any>(null);
    const [selection2, setSelection2] = useState<any>(null);

    const periods = [
        'Period 1',
        'Period 2',
        'Break',
        'Period 3',
        'Period 4',
        'Period 5',
        'Break',
        'Period 6',
        'Break',
        'Period 7',
        'Period 8',
        'Period 9',
        'Period 10'
    ];

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<StaffReplacementInTheirTimetableValues>({
        resolver: zodResolver(staffReplacementInTheirTimeTableSchema),
        defaultValues: {
            hrmE_Id: ''
        }
    });

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const toggleSelection = (day: string, period: string) => {
        if (period.toLowerCase().includes('break')) return;

        // Logic: Fill selection1 first, then selection2
        if (!selection1) {
            setSelection1({ day, period, staff: 'Staff A' }); // staff would come from getCellData
        } else if (selection1.day === day && selection1.period === period) {
            setSelection1(null); // Deselect if clicking the same box
        } else if (!selection2) {
            setSelection2({ day, period, staff: 'Staff B' });
        } else if (selection2.day === day && selection2.period === period) {
            setSelection2(null); // Deselect second box
        } else {
            // If both are full and you click a new one, reset and start over
            setSelection1({ day, period, staff: 'Staff C' });
            setSelection2(null);
        }
    };

    const handleClear = () => {
        setSelection1(null);
        setSelection2(null);
    };

    const handleReset = () => {
        reset();
        // onFetch(null);
        // reset({
        //     asmaY_Id: "",
        //     hrmE_Id: "",
        // });
        // onFetch(null); // 🔥 clear report grid
    };

    return (
        <div className='mx-auto max-w-7xl overflow-hidden rounded-xl border border-purple-100 bg-white shadow-md'>
            {/* HEADER */}
            <div className='bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 px-6 py-4'>
                <h2 className='flex items-center gap-2 font-extrabold text-sm text-white uppercase tracking-widest'>
                    Time Table Replacement Mode
                </h2>
            </div>

            <div className='space-y-6 p-6'>
                {/* TABLE */}
                <div className='overflow-x-auto rounded-xl border border-purple-100'>
                    <table className='w-full min-w-[1200px] border-collapse text-[11px]'>
                        <thead>
                            <tr className='bg-purple-50'>
                                <th className='sticky left-0 z-10 min-w-[120px] border-purple-100 border-r border-b bg-purple-50 px-4 py-4 text-left font-black text-purple-800 uppercase'>
                                    Day / Period
                                </th>
                                {periods.map((p, i) => (
                                    <th
                                        key={i}
                                        className={cn(
                                            'border-purple-100 border-r border-b px-2 py-4 text-center font-bold text-purple-700',
                                            p.includes('Break') ? 'w-12 bg-orange-50/50' : 'min-w-[100px]'
                                        )}>
                                        {p}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {days.map((day) => (
                                <tr key={day} className='border-purple-50 border-b bg-white'>
                                    <td className='sticky left-0 z-10 border-purple-100 border-r bg-white px-4 py-4 font-bold text-purple-900'>
                                        {day}
                                    </td>
                                    {periods.map((period, pIdx) => {
                                        const isSel1 = selection1?.day === day && selection1?.period === period;
                                        const isSel2 = selection2?.day === day && selection2?.period === period;

                                        return (
                                            <td
                                                key={pIdx}
                                                onClick={() => toggleSelection(day, period)}
                                                className={cn(
                                                    'cursor-pointer border-purple-50 border-r px-2 py-4 text-center transition-all',
                                                    period.includes('Break') ? 'cursor-not-allowed bg-orange-50/20' : 'hover:bg-purple-50',
                                                    isSel1 ? 'bg-purple-600 text-white shadow-inner' : '',
                                                    isSel2 ? 'bg-orange-500 text-white shadow-inner' : ''
                                                )}>
                                                {period.includes('Break') ? (
                                                    <span className='font-bold text-[9px] text-orange-300'>BRK</span>
                                                ) : isSel1 || isSel2 ? (
                                                    'SELECTED'
                                                ) : (
                                                    ''
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* DUAL ACTIONS FOOTER */}
                {(selection1 || selection2) && (
                    <div className='slide-in-from-bottom-2 flex animate-in flex-col gap-4 border-t pt-4'>
                        <div className='flex items-center justify-between rounded-lg border border-purple-100 bg-purple-50 p-4 shadow-sm'>
                            <div className='flex flex-1 items-center gap-6'>
                                {/* SLOT 1 */}
                                <div className='flex flex-1 flex-col gap-1'>
                                    <span className='font-bold text-[10px] text-gray-400 uppercase tracking-wider'>Source Period</span>
                                    <div
                                        className={cn(
                                            'flex h-10 items-center rounded-md border px-4 font-semibold text-xs shadow-sm transition-all',
                                            selection1
                                                ? 'border-purple-400 bg-white text-purple-900'
                                                : 'border-gray-300 border-dashed bg-gray-100 text-gray-400'
                                        )}>
                                        {selection1 ? (
                                            <>
                                                <span className='mr-2 text-purple-600'>{selection1.day}</span>
                                                <span className='mr-2 text-gray-300'>|</span>
                                                <span>{selection1.period}</span>
                                            </>
                                        ) : (
                                            'Select first box...'
                                        )}
                                    </div>
                                </div>

                                <div className='pt-5 text-gray-400'>
                                    <ArrowRightLeft size={20} />
                                </div>

                                {/* SLOT 2 - EXACTLY SIMILAR TO SLOT 1 */}
                                <div className='flex flex-1 flex-col gap-1'>
                                    <span className='font-bold text-[10px] text-gray-400 uppercase tracking-wider'>Target Period</span>
                                    <div
                                        className={cn(
                                            'flex h-10 items-center rounded-md border px-4 font-semibold text-xs shadow-sm transition-all',
                                            selection2
                                                ? 'border-orange-400 bg-white text-purple-900'
                                                : 'border-gray-300 border-dashed bg-gray-100 text-gray-400'
                                        )}>
                                        {selection2 ? (
                                            <>
                                                <span className='mr-2 text-orange-600'>{selection2.day}</span>
                                                <span className='mr-2 text-gray-300'>|</span>
                                                <span>{selection2.period}</span>
                                            </>
                                        ) : (
                                            'Select second box...'
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* BUTTONS */}
                            <div className='ml-4 flex items-center gap-3 pt-5'>
                                <Button variant='ghost' onClick={handleClear} className='h-10 text-purple-600'>
                                    <X className='mr-1 h-4 w-4' /> Clear
                                </Button>
                                <Button
                                    disabled={!selection1 || !selection2}
                                    className='h-10 bg-orange-500 px-8 font-bold text-white shadow-md hover:bg-orange-600'>
                                    Replace
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
