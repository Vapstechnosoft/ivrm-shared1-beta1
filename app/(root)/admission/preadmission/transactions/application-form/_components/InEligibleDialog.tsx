import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { IPreadmissionClassDropdown } from '@/types/admission/preadmission/transactions';
import { format } from 'date-fns';

interface IneligibleClassesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    classes: IPreadmissionClassDropdown[];
    cutOffDate?: Date;
}

export function IneligibleClassesDialog({ open, onOpenChange, classes, cutOffDate = new Date() }: IneligibleClassesDialogProps) {
    // Calculate Maximum Date of Birth (for minimum age requirement)
    const calculateMaxDOB = (years: number, months: number, days: number) => {
        const date = new Date(cutOffDate);
        date.setFullYear(date.getFullYear() - years);
        date.setMonth(date.getMonth() - months);
        date.setDate(date.getDate() - days);
        return format(date, 'dd/MM/yyyy');
    };

    // Calculate Minimum Date of Birth (for maximum age requirement)
    const calculateMinDOB = (years: number, months: number, days: number) => {
        const date = new Date(cutOffDate);
        date.setFullYear(date.getFullYear() - years);
        date.setMonth(date.getMonth() - months);
        date.setDate(date.getDate() - days);
        return format(date, 'dd/MM/yyyy');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[80vh] max-w-4xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>NO Class Is Applicable For Your Age!!</DialogTitle>
                    <DialogDescription>
                        NOTE:Child Date of Birth should be between Maximum and Minimum Date for Respective Class
                    </DialogDescription>
                </DialogHeader>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sl No.</TableHead>
                            <TableHead>Class Name</TableHead>
                            <TableHead>Maximum Date of Birth</TableHead>
                            <TableHead>Minimum Date of Birth</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {classes.map((classItem, index) => (
                            <TableRow key={classItem.asmcL_Id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className='font-medium'>{classItem.asmcL_ClassName}</TableCell>
                                <TableCell>
                                    {calculateMaxDOB(classItem.asmcL_MinAgeYear, classItem.asmcL_MinAgeMonth, classItem.asmcL_MinAgeDays)}
                                </TableCell>
                                <TableCell>
                                    {calculateMinDOB(classItem.asmcL_MaxAgeYear, classItem.asmcL_MaxAgeMonth, classItem.asmcL_MaxAgeDays)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
    );
}
