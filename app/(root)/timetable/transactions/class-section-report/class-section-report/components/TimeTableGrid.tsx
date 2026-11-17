'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface TimeTableGridProps {
    params: any;
}

export default function TimeTableGrid({ params }: TimeTableGridProps) {
    // Periods array including all 9 periods and breaks

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
        'Period 9'
    ];

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <div className='fade-in slide-in-from-top-4 mx-auto max-w-7xl animate-in overflow-hidden rounded-xl border border-purple-100 bg-white shadow-md duration-500'>
            {/* HEADER */}
            <div className='bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 px-6 py-4'>
                <h2 className='flex items-center gap-2 font-extrabold text-sm text-white uppercase tracking-widest'>
                    <span className='h-2 w-2 animate-pulse rounded-full bg-orange-400' />
                    Time Table View
                </h2>
            </div>

            <div className='space-y-6 p-6'>
                {/* CHECKBOX GROUP */}
                <div className='flex flex-wrap items-center gap-8 rounded-lg border-orange-500 border-l-4 bg-white p-5 shadow-sm ring-1 ring-purple-50'>
                    <div className='group flex items-center space-x-3'>
                        <Checkbox
                            id='staff-uniform'
                            className='border-purple-300 data-[state=checked]:bg-orange-50 data-[state=checked]:text-orange-600'
                        />
                        <Label
                            htmlFor='staff-uniform'
                            className='cursor-pointer font-bold text-purple-900 text-xs transition-colors group-hover:text-orange-600'>
                            Staff Wise Uniform Distribution
                        </Label>
                    </div>
                    <div className='group flex items-center space-x-3'>
                        <Checkbox
                            id='subject-uniform'
                            className='border-purple-300 data-[state=checked]:bg-orange-50 data-[state=checked]:text-orange-600'
                        />
                        <Label
                            htmlFor='subject-uniform'
                            className='cursor-pointer font-bold text-purple-900 text-xs transition-colors group-hover:text-orange-600'>
                            Subject Wise Uniform Distribution
                        </Label>
                    </div>
                    <div className='group flex items-center space-x-3'>
                        <Checkbox
                            id='staff-rest'
                            className='border-purple-300 data-[state=checked]:bg-orange-50 data-[state=checked]:text-orange-600'
                        />
                        <Label
                            htmlFor='staff-rest'
                            className='cursor-pointer font-bold text-purple-900 text-xs transition-colors group-hover:text-orange-600'>
                            Staff Wise Rest and Continue
                        </Label>
                    </div>
                </div>

                {/* TABLE GRID CONTAINER */}
                <div className='overflow-x-auto rounded-xl border border-purple-100 bg-slate-50/30'>
                    {/* Increased min-w to ensure 9th period isn't cut off */}
                    <table className='w-full min-w-[1200px] border-collapse text-[11px]'>
                        <thead>
                            <tr className='bg-purple-50'>
                                <th className='sticky left-0 z-10 min-w-[120px] border-purple-100 border-r border-b bg-purple-50 px-4 py-4 text-left font-black text-purple-800 uppercase tracking-tighter'>
                                    Day / Period
                                </th>
                                {periods.map((period, index) => (
                                    <th
                                        key={index}
                                        className={`border-purple-100 border-r border-b px-2 py-4 text-center font-bold text-purple-700 ${period.includes('Break') ? 'w-12 bg-orange-50/50 text-[10px] text-orange-700' : 'min-w-[100px]'}`}>
                                        {period}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {days.map((day) => (
                                <tr key={day} className='group border-purple-50 border-b bg-white transition-colors last:border-0'>
                                    <td className='sticky left-0 z-10 border-purple-100 border-r bg-white px-4 py-4 font-bold text-purple-900 transition-all group-hover:bg-purple-50 group-hover:text-orange-600'>
                                        {day}
                                    </td>
                                    {periods.map((period, pIdx) => {
                                        const isBreak = period.includes('Break');
                                        return (
                                            <td
                                                key={pIdx}
                                                className={`border-purple-50 border-r px-2 py-4 text-center transition-all ${
                                                    isBreak
                                                        ? 'bg-orange-50/20 font-black text-orange-300/60 italic'
                                                        : 'font-medium text-gray-400 group-hover:bg-orange-50/10'
                                                }`}>
                                                {isBreak ? (
                                                    <span className='text-[9px] tracking-tighter'>BRK</span>
                                                ) : (
                                                    <span className='opacity-20'>—</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FOOTER ACCENT */}
            <div className='h-1.5 w-full bg-gradient-to-r from-orange-400 via-purple-600 to-orange-400' />
        </div>
    );
}
