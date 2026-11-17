import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { StudentAttendanceDetail } from '@/server/admission/preadmission/attendance-entry/student_attendance';
import { Loader2, Trash2 } from 'lucide-react';

interface AttendanceDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: StudentAttendanceDetail[];
    isLoading: boolean;
    onDelete: (id: number) => void;
    isDeleting: boolean;
}

export const AttendanceDetailsModal = ({ isOpen, onClose, data, isLoading, onDelete, isDeleting }: AttendanceDetailsModalProps) => {
    const handleDelete = (id: number) => {
        // Since we are inside a modal, maybe a simple confirm is okay, but toast can also be used for success/error.
        // User asked: "instead of alert show the error in toast and all"
        // Confirm dialog is UI pattern, but let's stick to browser native confirm for safety or just call delete.
        // Better to use sonner for feedback.
        if (confirm('Are you sure you want to delete this record?')) {
            onDelete(id);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='max-w-6xl'>
                <DialogHeader>
                    <DialogTitle className='text-blue-900 text-xl'>Period Wise Attendance Details</DialogTitle>
                </DialogHeader>

                <div className='max-h-[60vh] overflow-y-auto'>
                    {isLoading ? (
                        <div className='flex h-40 items-center justify-center'>
                            <Loader2 className='h-8 w-8 animate-spin text-primary' />
                        </div>
                    ) : data.length === 0 ? (
                        <div className='flex h-40 items-center justify-center text-muted-foreground'>No Data Found</div>
                    ) : (
                        <div className='rounded-md border'>
                            <Table>
                                <TableHeader className='bg-blue-800'>
                                    <TableRow className='hover:bg-blue-900'>
                                        <TableHead className='w-[60px] text-white'>S.NO</TableHead>
                                        <TableHead className='text-white'>Academic Year</TableHead>
                                        <TableHead className='text-white'>Class</TableHead>
                                        <TableHead className='text-white'>Section</TableHead>
                                        <TableHead className='text-white'>Date</TableHead>
                                        <TableHead className='text-white'>Staff Name</TableHead>
                                        <TableHead className='text-center text-white'>Total</TableHead>
                                        <TableHead className='text-center text-white'>Present</TableHead>
                                        <TableHead className='text-center text-white'>Absent</TableHead>
                                        <TableHead className='text-center text-white'>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((item, index) => (
                                        <TableRow key={item.asA_Id}>
                                            <TableCell className='font-medium'>{index + 1}</TableCell>
                                            <TableCell>{item.asmaY_Year}</TableCell>
                                            <TableCell>{item.asmcL_ClassName}</TableCell>
                                            <TableCell>{item.asmC_SectionName}</TableCell>
                                            <TableCell>{item.asA_Entry_DateTime}</TableCell>
                                            <TableCell>{item.employeename}</TableCell>
                                            <TableCell className='text-center'>{item.totalCount}</TableCell>
                                            <TableCell className='text-center'>{item.presentCount}</TableCell>
                                            <TableCell className='text-center'>{item.absentCount}</TableCell>
                                            <TableCell className='text-center'>
                                                {item.deletE_FLAG === 1 && (
                                                    <Button
                                                        variant='destructive'
                                                        size='icon'
                                                        className='h-8 w-8'
                                                        onClick={() => handleDelete(item.asA_Id)}
                                                        disabled={isDeleting}>
                                                        {isDeleting ? (
                                                            <Loader2 className='h-4 w-4 animate-spin' />
                                                        ) : (
                                                            <Trash2 className='h-4 w-4' />
                                                        )}
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
