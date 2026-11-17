'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAttendanceEntry } from '@/hooks/staff-portal/useAttendanceEntry';
import { Search, Trash } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';

interface ViewHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    yearId: number;
    classId: number;
    sectionId: number;
    entryType: string | undefined;
    viewHistoryMutation: any;
}

const ViewHistoryModal: React.FC<ViewHistoryModalProps> = ({
    isOpen,
    onClose,
    yearId,
    classId,
    sectionId,
    entryType,
    viewHistoryMutation
}) => {
    const [history, setHistory] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const { deleteRecordWise } = useAttendanceEntry(yearId);

    useEffect(() => {
        if (isOpen) {
            const data = {
                ASMAY_Id: yearId,
                ASMCL_Id: classId,
                ASMS_Id: sectionId,
                att_entry_type: entryType
            };
            viewHistoryMutation.mutate(data, {
                onSuccess: (res: any) => {
                    if (res?.viewStudentPeriodWiseAttDetails) {
                        setHistory(res.viewStudentPeriodWiseAttDetails);
                    }
                }
            });
        }
    }, [isOpen]);

    const handleDelete = (record: any) => {
        const data = {
            ASMAY_Id: yearId,
            ASMCL_Id: classId,
            ASMS_Id: sectionId,
            ASA_Id: record.ASA_Id,
            att_entry_type: entryType
        };

        if (confirm('Do You Want To Delete The Selected Attendance Details?')) {
            deleteRecordWise.mutate(data, {
                onSuccess: (res: any) => {
                    if (res.returnval) {
                        if (res.viewStudentPeriodWiseAttDetails) {
                            setHistory(res.viewStudentPeriodWiseAttDetails);
                        } else {
                            onClose();
                        }
                    }
                }
            });
        }
    };

    const filteredHistory = history.filter(
        (item) =>
            item.ASA_FROMDATE.toLowerCase().includes(search.toLowerCase()) ||
            item.EMPLOYEENAME.toLowerCase().includes(search.toLowerCase()) ||
            item.ISMS_SUBJECTNAME.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='max-h-[90vh] max-w-7xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>Attendance Details</DialogTitle>
                    <DialogDescription>View and manage historical attendance records for the selected filters.</DialogDescription>
                </DialogHeader>

                <div className='space-y-4'>
                    <div className='flex justify-end'>
                        <div className='relative w-72'>
                            <Search className='absolute top-2.5 left-2 h-4 w-4 text-muted-foreground' />
                            <Input
                                placeholder='Search history...'
                                className='pl-8'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className='rounded-md border'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='w-12'>Sl.No</TableHead>
                                    <TableHead>Attendance Details</TableHead>
                                    <TableHead>Attendance Date</TableHead>
                                    <TableHead>Entry Date</TableHead>
                                    {entryType === 'period' && (
                                        <>
                                            <TableHead>Subject</TableHead>
                                            <TableHead>Period</TableHead>
                                        </>
                                    )}
                                    <TableHead>Entry By</TableHead>
                                    {entryType === 'period' && (
                                        <>
                                            <TableHead className='text-right'>Total</TableHead>
                                            <TableHead className='text-right'>Present</TableHead>
                                            <TableHead className='text-right'>Absent</TableHead>
                                        </>
                                    )}
                                    <TableHead className='text-center'>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredHistory.map((record, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <div className='space-y-1 font-medium text-xs'>
                                                <div>Year: {record.ASMAY_Year}</div>
                                                <div>Class: {record.ASMCL_ClassName}</div>
                                                <div>Section: {record.ASMC_SectionName}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{record.ASA_FROMDATE}</TableCell>
                                        <TableCell>{record.ASA_Entry_DateTime}</TableCell>
                                        {entryType === 'period' && (
                                            <>
                                                <TableCell>{record.ISMS_SUBJECTNAME}</TableCell>
                                                <TableCell>{record.TTMP_PeriodName}</TableCell>
                                            </>
                                        )}
                                        <TableCell>{record.EMPLOYEENAME}</TableCell>
                                        {entryType === 'period' && (
                                            <>
                                                <TableCell className='text-right'>{record.TotalCount}</TableCell>
                                                <TableCell className='text-right'>{record.PresentCount}</TableCell>
                                                <TableCell className='text-right'>{record.AbsentCount}</TableCell>
                                            </>
                                        )}
                                        <TableCell className='text-center'>
                                            {record.DELETE_FLAG === 1 && (
                                                <Button variant='ghost' size='icon' onClick={() => handleDelete(record)}>
                                                    <Trash className='h-4 w-4 text-destructive' />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewHistoryModal;
