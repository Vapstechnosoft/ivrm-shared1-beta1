'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

export interface DepartmentBreakdownItem {
    hrmD_Id: number;
    dept: string;
    netamount: number;
}

interface DepartmentBreakdownDialogProps {
    isOpen: boolean;
    onClose: () => void;
    monthName: string;
    year: string;
    data: DepartmentBreakdownItem[];
    isLoading: boolean;
}

export function DepartmentBreakdownDialog({
    isOpen,
    onClose,
    monthName,
    year,
    data,
    isLoading
}: DepartmentBreakdownDialogProps) {
    const totalNetAmount = data?.reduce((sum: number, item: DepartmentBreakdownItem) => sum + item.netamount, 0) || 0;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center text-blue-700">
                        Department-wise Salary Breakdown
                    </DialogTitle>
                    <DialogDescription className="text-center text-lg font-medium text-slate-600">
                        For the month of {monthName}, {year}
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex h-[400px] flex-col items-center justify-center space-y-4">
                        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                        <p className="text-muted-foreground animate-pulse font-medium text-lg">
                            Fetching department details...
                        </p>
                    </div>
                ) : data && data.length > 0 ? (
                    <div className="space-y-8 py-4">
                        {/* Summary Table */}
                        <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead className="font-bold text-slate-700 w-[100px] text-center">SL. No.</TableHead>
                                        <TableHead className="font-bold text-slate-700">Department</TableHead>
                                        <TableHead className="font-bold text-slate-700 text-right">Net Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((item: DepartmentBreakdownItem, index: number) => (
                                        <TableRow key={item.hrmD_Id || index} className="hover:bg-slate-50 transition-colors">
                                            <TableCell className="text-center font-medium">{index + 1}</TableCell>
                                            <TableCell className="font-semibold text-slate-800">{item.dept}</TableCell>
                                            <TableCell className="text-right font-bold text-blue-600">
                                                ₹ {item.netamount.toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="bg-blue-50 font-bold border-t-2 border-blue-100">
                                        <TableCell colSpan={2} className="text-right text-blue-900 text-lg uppercase">
                                            Grand Total
                                        </TableCell>
                                        <TableCell className="text-right text-blue-800 text-xl">
                                            ₹ {totalNetAmount.toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-[300px] items-center justify-center rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 m-4">
                        <div className="text-center space-y-3">
                            <p className="text-slate-500 font-bold text-xl">No department data found</p>
                            <p className="text-slate-400 font-medium">
                                There are no salary records for departments in {monthName}.
                            </p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
