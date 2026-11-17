'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table/data-table';
import { Edit, Trash2 } from 'lucide-react';

interface TransferCertificate {
    ASTC_Id: number;
    ASTC_Date: string;
    ASTC_Reason: string;
    ASTC_Result: string; // Status
}

export default function TransferCertificateList({ data, onEdit, onDeactivate }: { data: TransferCertificate[], onEdit: (id: number) => void, onDeactivate: (id: number) => void }) {

    const columns: ColumnDef<TransferCertificate>[] = [
        {
            accessorKey: 'ASTC_Date',
            header: 'Date',
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
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(item.ASTC_Id)} title="Edit">
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDeactivate(item.ASTC_Id)} title="Deactivate">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )
            }
        }
    ];

    return (
        <DataTable columns={columns} data={data} totalItems={data.length} />
    );
}
