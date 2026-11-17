'use client';

import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Bookmark, CalendarDays, Clock, FileText, UserCheck } from 'lucide-react';
import React from 'react'; // Required for React.Fragment

export default function DeputationReport({ data }: { data: any }) {
    if (!data) return null;

    return (
        <div className='space-y-8'>
            {/* ==========================================================
          NEW SECTION: ABSENT DETAILS (ROW-WISE VIEW)
          ========================================================== */}
            <CollapsibleSection defaultOpen className='overflow-hidden rounded-xl border-none shadow-lg'>
                <div className='relative border border-indigo-100 bg-white'>
                    {/* Section Header */}
                    <div className='flex items-center gap-2 bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-800 px-4 py-3'>
                        <Bookmark className='h-4 w-4 text-blue-200' />
                        <span className='font-bold text-white text-xs uppercase tracking-wider'>Absent Staff Time Table</span>
                    </div>
                    <Table>
                        <TableHeader className='bg-purple-50'>
                            <TableRow>
                                <TableHead className='text-purple-900'>Period</TableHead>
                                <TableHead className='text-purple-900'>Class-Section / Subject</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {data.absentStaffTimeTable?.map((r: any, i: number) => (
                                <TableRow key={i} className='hover:bg-purple-50/40'>
                                    {/* COLUMN 1 */}
                                    <TableCell className='font-bold text-purple-700'>{r.period ?? i + 1}</TableCell>

                                    {/* COLUMN 2 */}
                                    <TableCell className='font-semibold text-slate-700'>{r.classSubject}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className='overflow-hidden'>
                        <Table>
                            <TableBody>
                                {data.absentStaffTimeTable?.map((r: any, i: number) => (
                                    <React.Fragment key={`row-view-${i}`}>
                                        {/* Row 1: Periods */}
                                        <TableRow className='border-none bg-indigo-50/30'>
                                            <TableCell className='w-[220px] border-indigo-100 border-r bg-indigo-50/50 font-black text-[10px] text-indigo-900 uppercase tracking-widest'>
                                                <div className='flex items-center gap-2'>
                                                    <Clock className='h-3 w-3 text-indigo-400' />
                                                    Periods
                                                </div>
                                            </TableCell>
                                            <TableCell className='px-6 py-4 font-bold text-indigo-700 text-lg'>
                                                {r.period || i + 1}
                                            </TableCell>
                                        </TableRow>

                                        {/* Row 2: Class-Section/Subject */}
                                        <TableRow className='border-white border-b-4'>
                                            <TableCell className='w-[220px] border-indigo-100 border-r bg-indigo-50/50 font-black text-[10px] text-indigo-900 uppercase tracking-widest'>
                                                <div className='flex items-center gap-2'>
                                                    <FileText className='h-3 w-3 text-indigo-400' />
                                                    Class-Section/Subject
                                                </div>
                                            </TableCell>
                                            <TableCell className='px-6 py-4 font-semibold text-base text-slate-700'>
                                                {r.classSubject || 'VIII ICSE-C / MATHEMATICS'}
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </CollapsibleSection>

            {/* ==========================================================
          1. EXISTING: Absent Staff Time Table (Column View)
          ========================================================== */}
            <CollapsibleSection title='Absent Staff Time Table' defaultOpen className='overflow-hidden rounded-xl border-none shadow-md'>
                <div className='relative border border-purple-100 bg-white'>
                    <div className='flex items-center gap-2 bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 px-4 py-3'>
                        <Bookmark className='h-4 w-4 text-blue-200' />
                        <span className='font-bold text-white text-xs uppercase tracking-wider'>Absent DETAILS</span>
                    </div>

                    <div className='overflow-x-auto'>
                        <Table>
                            <TableHeader className='bg-purple-50/50'>
                                <TableRow>
                                    <TableHead className='text-purple-900'>Staff Name</TableHead>
                                    <TableHead className='text-purple-900'>Absent On</TableHead>
                                    <TableHead className='text-purple-900'>WEEKLY ABSENT COUNT</TableHead>
                                    <TableHead className='text-purple-900'>MONTHLY ABSENT COUNT</TableHead>
                                    <TableHead className='text-purple-900'>YEARLY ABSENT COUNT</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.absentStaffTimeTable?.length > 0 ? (
                                    data.absentStaffTimeTable.map((r: any, i: number) => (
                                        <TableRow key={i} className='border-purple-50 transition-colors hover:bg-purple-50/30'>
                                            <TableCell className='font-bold text-purple-700'>
                                                <span className='flex items-center gap-2'>
                                                    <span className='flex h-5 w-5 items-center justify-center rounded bg-purple-100 text-[10px]'>
                                                        {r.period || i + 1}
                                                    </span>
                                                    Period
                                                </span>
                                            </TableCell>
                                            <TableCell className='font-semibold text-slate-700'>
                                                {r.classSubject || 'VIII ICSE-C / MATHEMATICS'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className='h-24 text-center text-slate-400 italic'>
                                            No periods found for replacement.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </CollapsibleSection>

            {data.absentDetails && data.absentDetails.length > 0 && (
                <CollapsibleSection
                    title='Absent Staff Attendance Summary'
                    defaultOpen
                    className='overflow-hidden rounded-xl border-none shadow-md'>
                    <div className='relative border border-orange-100 bg-white'>
                        <div className='flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3'>
                            <CalendarDays className='h-4 w-4 text-white' />
                            <span className='font-bold text-white text-xs uppercase tracking-wider'>Staff Absence Statistics</span>
                        </div>

                        <div className='overflow-x-auto'>
                            <Table>
                                <TableHeader className='bg-orange-50/50'>
                                    <TableRow>
                                        <TableHead className='font-black text-[11px] text-orange-900 uppercase'>Staff Name</TableHead>
                                        <TableHead className='font-black text-[11px] text-orange-900 uppercase'>Absent On</TableHead>
                                        <TableHead className='text-center font-black text-[11px] text-orange-900 uppercase'>
                                            Weekly
                                        </TableHead>
                                        <TableHead className='text-center font-black text-[11px] text-orange-900 uppercase'>
                                            Monthly
                                        </TableHead>
                                        <TableHead className='text-center font-black text-[11px] text-orange-900 uppercase'>
                                            Yearly
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.absentDetails.map((r: any, i: number) => (
                                        <TableRow key={i} className='border-orange-50 transition-colors hover:bg-orange-50/30'>
                                            <TableCell className='font-bold text-slate-800'>
                                                <div className='flex items-center gap-2'>
                                                    <UserCheck className='h-3.5 w-3.5 text-orange-400' />
                                                    {r.staffName}
                                                </div>
                                            </TableCell>
                                            <TableCell className='font-medium text-slate-600'>{r.absentOn}</TableCell>
                                            <TableCell className='text-center'>
                                                <span className='inline-flex h-6 w-8 items-center justify-center rounded-full bg-orange-100 font-bold text-[11px] text-orange-700'>
                                                    {r.weeklyCount}
                                                </span>
                                            </TableCell>
                                            <TableCell className='text-center'>
                                                <span className='inline-flex h-6 w-8 items-center justify-center rounded-full bg-orange-100 font-bold text-[11px] text-orange-700'>
                                                    {r.monthlyCount}
                                                </span>
                                            </TableCell>
                                            <TableCell className='text-center'>
                                                <span className='inline-flex h-6 w-8 items-center justify-center rounded-full bg-orange-100 font-bold text-[11px] text-orange-700'>
                                                    {r.yearlyCount}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CollapsibleSection>
            )}
        </div>
    );
}
