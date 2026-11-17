'use client';

import { DataTable } from '@/components/ui/data-table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface TransferCertificate {
    ASTC_Id: number;
    ASTC_Date: string;
    ASTC_Reason: string;
    ASTC_Result: string;
    // Student info would involve joins, assuming flattened data or separate call
    StudentName?: string;
}

export default function TransferCertificateApproval({ data, onApprove, onReject }: { data: TransferCertificate[], onApprove: (id: number) => void, onReject: (id: number) => void }) {
    const columns: ColumnDef<TransferCertificate>[] = [
        {
            accessorKey: 'StudentName',
            header: 'Student Name',
            cell: ({ row }) => row.original.StudentName || 'Unknown',
        },
        {
            accessorKey: 'ASTC_Date',
            header: 'Applied Date',
            cell: ({ row }) => {
                const date = new Date(row.getValue('ASTC_Date'));
                return <div>{date.toLocaleDateString()}</div>
            }
        },
        {
            accessorKey: 'ASTC_Reason',
            header: 'Reason',
        },
        {
            accessorKey: 'ASTC_Result',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.getValue('ASTC_Result') as string;
                return <Badge variant={status === 'Approved' ? 'success' : status === 'Rejected' ? 'destructive' : 'default'}>{status || 'Pending'}</Badge>
            }
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => onApprove(item.ASTC_Id)}>
                            <Check className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => onReject(item.ASTC_Id)}>
                            <X className="h-4 w-4 mr-1" /> Reject
                        </Button>
                    </div>
                );
            }
        }
    ];

    return (
        <DataTable columns={columns} data={data} totalItems={data.length} />
    );
}
