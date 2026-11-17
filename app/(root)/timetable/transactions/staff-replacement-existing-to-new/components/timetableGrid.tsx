'use client';
import { Button } from '@/components/ui/extension/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface TimetableGridProps {
    data: any;
}

export default function TimetableGrid({ data }: TimetableGridProps) {
    // Sample data structure - you'll need to fetch actual data based on the filter params
    const timetableData = [
        {
            sno: 1,
            category: 'Primary',
            class: 'Class 1',
            section: 'A',
            staff: 'John Doe',
            subject: 'Mathematics',
            period: 'Period 1'
        }
        // Add more rows as needed
    ];

    return (
        <div className='fade-in slide-in-from-top-4 mx-auto max-w-7xl animate-in overflow-hidden rounded-xl border border-purple-100 bg-white shadow-md duration-500'>
            {/* HEADER */}
            <div className='bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 px-6 py-4'>
                <h2 className='flex items-center gap-2 font-extrabold text-sm text-white uppercase tracking-widest'>
                    <span className='h-2 w-2 animate-pulse rounded-full bg-orange-400' />
                    Staff Replacement Report
                </h2>
            </div>

            <div className='space-y-6 bg-white p-6'>
                {/* SEARCH BAR */}
                <div className='relative max-w-md'>
                    <Search className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400' />
                    <Input
                        type='text'
                        placeholder='Search in table...'
                        className='h-10 border-purple-200 bg-white pl-10 focus:border-purple-400 focus:ring-purple-400'
                    />
                </div>

                {/* TABLE GRID CONTAINER */}
                <div className='overflow-x-auto rounded-xl border border-purple-100 bg-white'>
                    <table className='w-full border-collapse text-sm'>
                        <thead>
                            <tr className='bg-purple-50'>
                                <th className='min-w-[100px] border-purple-100 border-r border-b px-4 py-3 text-left font-bold text-purple-800 uppercase tracking-tight'>
                                    <div className='flex flex-col gap-2'>
                                        <span>S.No</span>
                                        <Input
                                            className='h-8 border-purple-200 bg-white/80 text-xs focus:border-purple-400'
                                            placeholder='Search...'
                                        />
                                    </div>
                                </th>
                                <th className='min-w-[150px] border-purple-100 border-r border-b px-4 py-3 text-left font-bold text-purple-800 uppercase tracking-tight'>
                                    <div className='flex flex-col gap-2'>
                                        <span>Category</span>
                                        <Input
                                            className='h-8 border-purple-200 bg-white/80 text-xs focus:border-purple-400'
                                            placeholder='Search...'
                                        />
                                    </div>
                                </th>
                                <th className='min-w-[120px] border-purple-100 border-r border-b px-4 py-3 text-left font-bold text-purple-800 uppercase tracking-tight'>
                                    <div className='flex flex-col gap-2'>
                                        <span>Class</span>
                                        <Input
                                            className='h-8 border-purple-200 bg-white/80 text-xs focus:border-purple-400'
                                            placeholder='Search...'
                                        />
                                    </div>
                                </th>
                                <th className='min-w-[100px] border-purple-100 border-r border-b px-4 py-3 text-left font-bold text-purple-800 uppercase tracking-tight'>
                                    <div className='flex flex-col gap-2'>
                                        <span>Section</span>
                                        <Input
                                            className='h-8 border-purple-200 bg-white/80 text-xs focus:border-purple-400'
                                            placeholder='Search...'
                                        />
                                    </div>
                                </th>
                                <th className='min-w-[180px] border-purple-100 border-r border-b px-4 py-3 text-left font-bold text-purple-800 uppercase tracking-tight'>
                                    <div className='flex flex-col gap-2'>
                                        <span>Staff</span>
                                        <Input
                                            className='h-8 border-purple-200 bg-white/80 text-xs focus:border-purple-400'
                                            placeholder='Search...'
                                        />
                                    </div>
                                </th>
                                <th className='min-w-[180px] border-purple-100 border-r border-b px-4 py-3 text-left font-bold text-purple-800 uppercase tracking-tight'>
                                    <div className='flex flex-col gap-2'>
                                        <span>Subject</span>
                                        <Input
                                            className='h-8 border-purple-200 bg-white/80 text-xs focus:border-purple-400'
                                            placeholder='Search...'
                                        />
                                    </div>
                                </th>
                                <th className='min-w-[120px] border-purple-100 border-b px-4 py-3 text-left font-bold text-purple-800 uppercase tracking-tight'>
                                    <div className='flex flex-col gap-2'>
                                        <span>Period</span>
                                        <Input
                                            className='h-8 border-purple-200 bg-white/80 text-xs focus:border-purple-400'
                                            placeholder='Search...'
                                        />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {timetableData.length > 0 ? (
                                timetableData.map((row, index) => (
                                    <tr
                                        key={index}
                                        className='group border-purple-50 border-b bg-white transition-colors last:border-0 hover:bg-purple-50/30'>
                                        <td className='border-purple-100 border-r bg-white px-4 py-3 text-gray-700'>{row.sno}</td>
                                        <td className='border-purple-100 border-r bg-white px-4 py-3 text-gray-700'>{row.category}</td>
                                        <td className='border-purple-100 border-r bg-white px-4 py-3 text-gray-700'>{row.class}</td>
                                        <td className='border-purple-100 border-r bg-white px-4 py-3 text-gray-700'>{row.section}</td>
                                        <td className='border-purple-100 border-r bg-white px-4 py-3 text-gray-700'>{row.staff}</td>
                                        <td className='border-purple-100 border-r bg-white px-4 py-3 text-gray-700'>{row.subject}</td>
                                        <td className='bg-white px-4 py-3 text-gray-700'>{row.period}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className='bg-white px-4 py-8 text-center text-gray-500'>
                                        No data available. Please select filters and click Report.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* FOOTER CONTROLS */}
                <div className='flex items-center justify-between px-2 pb-2'>
                    <div className='flex items-center gap-2'>
                        <Button className='rounded-lg border border-purple-100 p-2 text-purple-700 transition-colors hover:bg-purple-50'>
                            <ChevronLeft className='h-4 w-4' />
                        </Button>
                        <Button className='rounded-lg border border-purple-100 p-2 text-purple-700 transition-colors hover:bg-purple-50'>
                            <ChevronRight className='h-4 w-4' />
                        </Button>
                    </div>
                    <div className='rounded-lg border border-purple-100 bg-purple-50 px-3 py-1.5 font-medium text-purple-700 text-sm shadow-sm'>
                        Total Rows: {timetableData.length}
                    </div>
                </div>
            </div>
        </div>
    );
}
