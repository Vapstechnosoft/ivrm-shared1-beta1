'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface SavedRemarksListProps {
    // In legacy, this data source is `loaddata` which comes from `studentdataload`.
    // We didn't define a type for typical saved list columns in legacy gridOptions, it showed year, class, section, exam.
    // Let's assume input is similar to that.
    savedList: any[];
    onEdit: (item: any) => void;
}

export default function SavedRemarksList({ savedList, onEdit }: SavedRemarksListProps) {
    if (!savedList || savedList.length === 0) return null;

    return (
        <Card className="mt-6">
            <CardHeader><CardTitle>Exam Student Wise Remarks Details</CardTitle></CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">SL NO</TableHead>
                                <TableHead>Academic Year</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Section</TableHead>
                                <TableHead>Exam</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {savedList.map((item, i) => (
                                <TableRow key={i}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell>{item.asmaY_Year}</TableCell>
                                    <TableCell>{item.asmcL_ClassName}</TableCell>
                                    <TableCell>{item.asmC_SectionName}</TableCell>
                                    <TableCell>{item.emE_ExamName}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                                            <Edit className="h-4 w-4 text-blue-600" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
