
'use client';

import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { IReportResponse, IReportRow } from '@/types/staff-portal/student-attendance-report';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ReportGridProps {
    data: IReportResponse;
    isDateWise: boolean;
}

const ReportGrid: React.FC<ReportGridProps> = ({ data, isDateWise }) => {
    const [search, setSearch] = useState('');
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    const rows = data.studentAttendanceList;
    const columnsTest = data.monthList || [];

    const filteredRows = rows.filter(row =>
        row.name.toLowerCase().includes(search.toLowerCase()) ||
        row.AMST_AdmNo.toLowerCase().includes(search.toLowerCase()) ||
        row.AMAY_RollNo.toLowerCase().includes(search.toLowerCase())
    );

    const toggleSelectAll = () => {
        if (selectedRows.length === filteredRows.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(filteredRows.map((_, idx) => idx));
        }
    };

    const toggleRow = (index: number) => {
        if (selectedRows.includes(index)) {
            setSelectedRows(selectedRows.filter(i => i !== index));
        } else {
            setSelectedRows([...selectedRows, index]);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-4 rounded-lg">
                <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Total Records:</span>
                        <Badge variant="outline">{rows.length}</Badge>
                    </div>
                    {search && (
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">Filtered:</span>
                            <Badge variant="secondary">{filteredRows.length}</Badge>
                        </div>
                    )}
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search students..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-12 text-center">
                                <Checkbox
                                    checked={selectedRows.length > 0 && selectedRows.length === filteredRows.length}
                                    onCheckedChange={toggleSelectAll}
                                />
                            </TableHead>
                            <TableHead className="w-16 text-center">SL. NO.</TableHead>
                            <TableHead className="min-w-[200px]">Student Name</TableHead>
                            <TableHead>Adm. No.</TableHead>
                            <TableHead className="text-center">Roll No.</TableHead>

                            {isDateWise ? (
                                <>
                                    {columnsTest.map((col, idx) => (
                                        <TableHead key={idx} className="text-center min-w-[40px] px-1">
                                            {col.day}
                                        </TableHead>
                                    ))}
                                    <TableHead className="text-center font-bold bg-muted/80">Held</TableHead>
                                    <TableHead className="text-center font-bold bg-muted/80">Attd</TableHead>
                                    <TableHead className="text-center font-bold bg-muted/80">%</TableHead>
                                </>
                            ) : (
                                <>
                                    <TableHead className="text-center">Class Held</TableHead>
                                    <TableHead className="text-center">Attendance</TableHead>
                                    <TableHead className="text-center">Percentage (%)</TableHead>
                                    <TableHead>Remarks</TableHead>
                                </>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRows.map((row, index) => (
                            <TableRow key={index} className={cn(selectedRows.includes(index) && "bg-primary/5")}>
                                <TableCell className="text-center">
                                    <Checkbox
                                        checked={selectedRows.includes(index)}
                                        onCheckedChange={() => toggleRow(index)}
                                    />
                                </TableCell>
                                <TableCell className="text-center">{index + 1}</TableCell>
                                <TableCell className="font-medium text-primary">{row.name}</TableCell>
                                <TableCell>{row.AMST_AdmNo}</TableCell>
                                <TableCell className="text-center">{row.AMAY_RollNo}</TableCell>

                                {isDateWise ? (
                                    <>
                                        {columnsTest.map((col, idx) => {
                                            const val = row[col.day];
                                            let colorClass = "";
                                            if (val === 'A') colorClass = "text-destructive font-bold";
                                            if (val === 'P') colorClass = "text-green-600 font-bold";
                                            if (val === 'HO') colorClass = "text-amber-500 font-bold";

                                            return (
                                                <TableCell key={idx} className={cn("text-center text-xs px-1", colorClass)}>
                                                    {val}
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell className="text-center font-bold bg-muted/20">{data.countclass}</TableCell>
                                        <TableCell className="text-center font-bold bg-muted/20">{row.total}</TableCell>
                                        <TableCell className="text-center font-bold bg-muted/20">{row.percentage?.toFixed(2)}%</TableCell>
                                    </>
                                ) : (
                                    <>
                                        <TableCell className="text-center">{row.ASA_ClassHeld?.toFixed(2)}</TableCell>
                                        <TableCell className="text-center">{row.ASA_Class_Attended?.toFixed(2)}</TableCell>
                                        <TableCell className="text-center font-bold">{row.Percentage?.toFixed(2)}%</TableCell>
                                        <TableCell className="text-xs">{row.Remarks}</TableCell>
                                    </>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {isDateWise && (
                <div className="p-4 bg-muted/20 rounded-lg text-xs space-x-4 flex items-center">
                    <span className="font-bold">Legend:</span>
                    <span className="text-green-600 font-bold">P: Present</span>
                    <span className="text-destructive font-bold">A: Absent</span>
                    <span className="text-amber-500 font-bold">HO: Holiday</span>
                    <span className="text-muted-foreground">NE: Not Entered</span>
                </div>
            )}
        </div>
    );
};

export default ReportGrid;
