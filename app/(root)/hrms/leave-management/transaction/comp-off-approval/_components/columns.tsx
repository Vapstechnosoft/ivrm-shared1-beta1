'use client';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { BaseEntity } from '@/lib/localdb';
import { cn } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { Check, X } from 'lucide-react';
export interface CompOffApproval extends BaseEntity {
    employeeName: string;
    date: string;
    time: string;
    compOffToBeCredit: number;
    reason: string;
    hrStatus: 'Pending' | 'Approved' | 'Rejected';
    approverRemarks?: string;
    remark?: string;
}
interface CompOffApprovalColumnsProps {
    onApprove: (row: CompOffApproval) => void;
    onReject: (row: CompOffApproval) => void;
}
export const getCompOffApprovalColumns = ({ onApprove, onReject }: CompOffApprovalColumnsProps): ColumnDef<CompOffApproval>[] => [
    {
        accessorKey: 'employeeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Name' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('employeeName')}</div>
    },
    {
        accessorKey: 'date',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Date' />,
        cell: ({ row }) => {
            const date = row.getValue('date') as string;
            return <div>{new Date(date).toLocaleDateString()}</div>;
        }
    },
    {
        accessorKey: 'time',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Time' />,
        cell: ({ row }) => <div>{row.getValue('time')}</div>
    },
    {
        accessorKey: 'compOffToBeCredit',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Comp Off to be Credit' />,
        cell: ({ row }) => <div className='text-center'>{row.getValue('compOffToBeCredit')}</div>
    },
    {
        accessorKey: 'reason',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Reason' />,
        cell: ({ row }) => <div className='max-w-xs truncate'>{row.getValue('reason')}</div>
    },
    {
        accessorKey: 'hrStatus',
        header: ({ column }) => <DataTableColumnHeader column={column} title='HR Status' />,
        cell: ({ row }) => {
            const status = row.getValue('hrStatus') as string;
            const statusColors = {
                Pending: 'bg-yellow-100 text-yellow-700',
                Approved: 'bg-green-100 text-green-700',
                Rejected: 'bg-red-100 text-red-700'
            };
            return (
                <span
                    className={cn(
                        'inline-flex rounded-full px-2 py-1 font-medium text-xs',
                        statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'
                    )}>
                    {status}
                </span>
            );
        }
    },
    {
        accessorKey: 'approverRemarks',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Approver Remarks' />,
        cell: ({ row }) => <div className='max-w-xs truncate text-sm'>{row.getValue('approverRemarks') || '-'}</div>
    },
    {
        accessorKey: 'remark',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Remark' />,
        cell: ({ row }) => <div className='max-w-xs truncate text-sm'>{row.getValue('remark') || '-'}</div>
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const entity = row.original;
            return (
                <div className='flex gap-2'>
                    <Button size='sm' onClick={() => onApprove(entity)} disabled={entity.hrStatus === 'Approved'}>
                        <Check className='mr-1 h-4 w-4' /> Approve
                    </Button>
                    <Button size='sm' variant='destructive' onClick={() => onReject(entity)} disabled={entity.hrStatus === 'Rejected'}>
                        <X className='mr-1 h-4 w-4' /> Reject
                    </Button>
                </div>
            );
        }
    }
];
