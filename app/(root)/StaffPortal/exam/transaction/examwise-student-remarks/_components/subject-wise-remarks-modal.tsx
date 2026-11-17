'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import type { ISubjectWiseRemark } from '@/types/staff-portal/examwise-student-remarks';

interface SubjectWiseRemarksModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    studentName: string;
    remarksList: ISubjectWiseRemark[];
}

export default function SubjectWiseRemarksModal({
    open,
    onOpenChange,
    studentName,
    remarksList
}: SubjectWiseRemarksModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{studentName} : Subject Wise Remarks Details</DialogTitle>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">Sl.No</TableHead>
                                <TableHead>Subject Name</TableHead>
                                <TableHead>Remarks</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {remarksList.length > 0 ? (
                                remarksList.map((r, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="text-center">{i + 1}</TableCell>
                                        <TableCell>{r.ismS_SubjectName}</TableCell>
                                        <TableCell>
                                            <Textarea value={r.espcsR_Remarks} disabled rows={3} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center">No remarks found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    );
}
