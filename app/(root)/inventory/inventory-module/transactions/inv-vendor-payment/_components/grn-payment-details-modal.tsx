'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatDate } from "date-fns";

interface GRNPaymentDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any[];
    grnNo: string;
}

export function GRNPaymentDetailsModal({ isOpen, onClose, data, grnNo }: GRNPaymentDetailsModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Payment Details for GRN: {grnNo}</DialogTitle>
                </DialogHeader>
                <div className="mt-4 max-h-[60vh] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">SL.No.</TableHead>
                                <TableHead>Mode of Payment</TableHead>
                                <TableHead>Payment Date</TableHead>
                                <TableHead className="text-right">Purchase Value</TableHead>
                                <TableHead className="text-right">Amount Paid</TableHead>
                                <TableHead className="text-right">Total Paid</TableHead>
                                <TableHead className="text-right">Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data && data.length > 0 ? (
                                data.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item.invspT_ModeOfPayment}</TableCell>
                                        <TableCell>{item.invspT_PaymentDate ? formatDate(new Date(item.invspT_PaymentDate), 'dd-MM-yyyy') : '-'}</TableCell>
                                        <TableCell className="text-right">{item.invmgrN_PurchaseValue}</TableCell>
                                        <TableCell className="text-right font-medium text-green-600">{item.invsptgrN_Amount}</TableCell>
                                        <TableCell className="text-right">{item.invmgrN_TotalPaid}</TableCell>
                                        <TableCell className="text-right">{item.invmgrN_TotalBalance}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                                        No payment history found for this GRN.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    );
}
