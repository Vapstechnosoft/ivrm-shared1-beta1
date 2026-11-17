'use client';

import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Printer } from 'lucide-react';
import type { IAttendanceReportResponse } from '@/types/staff-portal/attendance-report';
import { exportToExcel } from '@/lib/export-to-file';

interface AttendanceGridProps {
    data: IAttendanceReportResponse;
    yearName?: string;
}

export default function AttendanceGrid({ data, yearName }: AttendanceGridProps) {
    const students = data.studentAttendanceList || [];

    const handleExportExcel = () => {
        const columns = [
            { label: 'Sl No', value: 'slno' },
            { label: 'Student Name', value: 'namme' },
            { label: 'Admission No', value: 'AMST_AdmNo' },
            { label: 'Reg No', value: 'AMST_RegistrationNo' },
            { label: 'Class', value: 'ASMCL_ClassName' },
            { label: 'Section', value: 'ASMC_SectionName' },
            { label: 'Working Days', value: 'classes' },
            { label: 'Present Days', value: 'attendance' },
            { label: 'Percentage', value: 'per' },
            { label: 'Concession', value: 'FMCC_ConcessionName' }
        ];

        const content = students.map((student, index) => ({
            slno: index + 1,
            namme: student.namme || `${student.AMST_FirstName} ${student.AMST_MiddleName || ''} ${student.Amst_LastName || ''}`.trim(),
            AMST_AdmNo: student.AMST_AdmNo,
            AMST_RegistrationNo: student.AMST_RegistrationNo,
            ASMCL_ClassName: student.ASMCL_ClassName,
            ASMC_SectionName: student.ASMC_SectionName,
            classes: student.classes,
            attendance: student.attendance,
            per: student.per,
            FMCC_ConcessionName: student.FMCC_ConcessionName || '-'
        }));

        exportToExcel('100% Attendance Report', JSON.stringify(columns), JSON.stringify(content));
    };

    const handlePrint = () => {
        window.print();
    };

    if (students.length === 0) {
        return null;
    }

    return (
        <Card className="mt-6 border-none shadow-none print:shadow-none">
            <CardHeader className="flex flex-row items-center justify-between print:hidden">
                <CardTitle>Report View</CardTitle>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleExportExcel}>
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Excel
                    </Button>
                    <Button variant="outline" size="sm" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="print:block hidden text-center mb-4">
                    <h2 className="text-xl font-bold">100% Attendance Report For Year {yearName}</h2>
                </div>
                <div className="overflow-auto border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="w-[50px] text-center font-bold">Sl.No.</TableHead>
                                <TableHead className="font-bold">Student Name</TableHead>
                                <TableHead className="font-bold">Adm.No.</TableHead>
                                <TableHead className="font-bold">Reg.No.</TableHead>
                                <TableHead className="font-bold">Class</TableHead>
                                <TableHead className="font-bold">Section</TableHead>
                                <TableHead className="text-center font-bold">Working Days</TableHead>
                                <TableHead className="text-center font-bold">Present Days</TableHead>
                                <TableHead className="text-center font-bold">Percentage</TableHead>
                                <TableHead className="font-bold">Fee Concession</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.map((student, index) => (
                                <TableRow key={index}>
                                    <TableCell className="text-center">{index + 1}</TableCell>
                                    <TableCell>{student.namme || `${student.AMST_FirstName} ${student.AMST_MiddleName || ''} ${student.Amst_LastName || ''}`}</TableCell>
                                    <TableCell>{student.AMST_AdmNo}</TableCell>
                                    <TableCell>{student.AMST_RegistrationNo}</TableCell>
                                    <TableCell>{student.ASMCL_ClassName}</TableCell>
                                    <TableCell>{student.ASMC_SectionName}</TableCell>
                                    <TableCell className="text-center">{student.classes}</TableCell>
                                    <TableCell className="text-center">{student.attendance}</TableCell>
                                    <TableCell className="text-center font-bold">{student.per}%</TableCell>
                                    <TableCell>{student.FMCC_ConcessionName || '-'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
