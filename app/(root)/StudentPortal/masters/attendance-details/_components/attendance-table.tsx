'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { IAttendanceData } from '@/types/student-portal/masters/attendance-details';

import { Fragment } from 'react';

interface AttendanceTableProps {
    data: IAttendanceData[];
}

export function AttendanceTable({ data }: AttendanceTableProps) {
    if (!data || data.length === 0) return null;

    return (
        <Card className='mt-6 overflow-hidden'>
            <CardContent className='overflow-x-auto p-0'>
                <Table className='bordered min-w-max text-center'>
                    <TableHeader>
                        <TableRow>
                            {data.map((item, index) => (
                                <TableHead key={index} colSpan={5} className='border text-center font-bold'>
                                    {item.month_name}
                                </TableHead>
                            ))}
                        </TableRow>
                        <TableRow>
                            {data.map((_, index) => (
                                <Fragment key={index}>
                                    <TableHead className='border bg-muted/50 text-center'>
                                        CLASS HELD
                                    </TableHead>
                                    <TableHead className='border bg-muted/50 text-center'>
                                        TOTAL PRESENT
                                    </TableHead>
                                    <TableHead className='border bg-muted/50 text-center'>
                                        ABSENT COUNT
                                    </TableHead>
                                    <TableHead className='border bg-muted/50 text-center'>
                                        PERCENTAGE
                                    </TableHead>
                                    <TableHead className='border bg-muted/50 text-center'>
                                        ACTION
                                    </TableHead>
                                </Fragment>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            {data.map((item, index) => (
                                <Fragment key={index}>
                                    <TableCell className='border'>
                                        {item.class_held}
                                    </TableCell>
                                    <TableCell className='border'>
                                        {item.total_present}
                                    </TableCell>
                                    <TableCell className='border'>
                                        {item.absent_count}
                                    </TableCell>
                                    <TableCell className='border'>
                                        {item.score}
                                    </TableCell>
                                    <TableCell className='border'>
                                        {item.absent_dates || '-'}
                                    </TableCell>
                                </Fragment>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
