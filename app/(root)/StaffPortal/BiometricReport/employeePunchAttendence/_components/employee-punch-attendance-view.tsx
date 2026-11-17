'use client';

import { format } from 'date-fns';
import { IPunchDetail } from '@/types/staff-portal/biometric-report/employee-punch-attendance.types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface EmployeePunchAttendanceViewProps {
    data: IPunchDetail[];
}

export const EmployeePunchAttendanceView = ({
    data,
}: EmployeePunchAttendanceViewProps) => {
    return (
        <div className='w-full p-4 mt-6 bg-white rounded-lg shadow-sm border'>
            <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-gray-800'>Grid View</h3>
            </div>
            <div className='overflow-x-auto'>
                <Table className='border'>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='text-center w-[80px]'>SLNO</TableHead>
                            <TableHead className='text-center'>Date</TableHead>
                            <TableHead className='text-center'>Time In</TableHead>
                            <TableHead className='text-center'>Time Out</TableHead>
                            <TableHead className='text-center'>Late In</TableHead>
                            <TableHead className='text-center'>Early Out</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length > 0 ? (
                            data.map((row, index) => (
                                <TableRow key={index} className='text-center'>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        {row.punchdate ? format(new Date(row.punchdate), 'dd-MM-yyyy') : ''}
                                    </TableCell>
                                    <TableCell>{row.punchINtime}</TableCell>
                                    <TableCell>{row.punchOUTtime}</TableCell>
                                    <TableCell>{row.lateby}</TableCell>
                                    <TableCell>{row.earlyby}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className='text-center py-4'>
                                    No records found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
