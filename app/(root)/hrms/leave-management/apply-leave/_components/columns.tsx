'use client';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';

// Leave Balance Row
export interface LeaveBalanceRow {
    id: number;
    leaveName: string;
    leaveCode: string;
    totalLeaves: number;
    balance: number;
}

// Leave History Row
export interface LeaveHistoryRow {
    id: number;
    employeeName?: string;
    leaveType?: string;
    leaveName?: string;
    leaveReason?: string;
    fromDate: string | Date;
    toDate: string | Date;
    noOfDays?: number;
    days?: number;
    totalDays?: number;
    status: string;
    remark?: string;
    remarks?: string;
    document?: string;
}

// Apply Leave Form Data
export type ApplyLeave = {
    employeeName: string;
    designation: string;
    doj: string;
    leaveType?: string;
    fromDate?: string;
    toDate?: string;
    numDays?: number;
    reason: string;
    contactNumber?: string;
    dateReportingBack?: string;
    inTime?: string;
    outTime?: string;
    file?: FileList;
};

// Table columns for Leave Balance
export const leaveBalanceColumns: ColumnDef<LeaveBalanceRow>[] = [
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='font-medium text-center'>{continuousIndex}</div>;
        }
    },
    {
        accessorKey: 'leaveName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Leave Type' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('leaveName')}</div>
    },
    {
        accessorKey: 'totalLeaves',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total' />,
        cell: ({ row }) => <div className='text-center'>{row.getValue('totalLeaves')}</div>
    },
    {
        accessorKey: 'balance',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Balance' />,
        cell: ({ row }) => <div className='text-center font-semibold'>{row.getValue('balance')}</div>
    }
];

// Table columns for Leave History - function to accept onDelete callback
export const createLeaveHistoryColumns = (onDelete?: (id: number) => void): ColumnDef<LeaveHistoryRow>[] => [
    {
        accessorKey: 'sno',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL.NO.' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='text-center'>{continuousIndex}</div>;
        }
    },
    {
        accessorKey: 'leaveType',
        header: ({ column }) => <DataTableColumnHeader column={column} title='LEAVE NAME' />,
        cell: ({ row }) => <div className='font-medium'>{row.original.leaveType || row.original.leaveName || '-'}</div>
    },
    {
        accessorKey: 'leaveReason',
        header: ({ column }) => <DataTableColumnHeader column={column} title='LEAVE REASON' />,
        cell: ({ row }) => <div className='max-w-xs truncate'>{row.original.leaveReason || row.original.remark || '-'}</div>
    },
    {
        accessorKey: 'fromDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='From Date' />,
        cell: ({ row }) => {
            const date = row.original.fromDate;
            return <div>{date ? new Date(date).toLocaleDateString('en-GB') : '-'}</div>;
        }
    },
    {
        accessorKey: 'toDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='To Date' />,
        cell: ({ row }) => {
            const date = row.original.toDate;
            return <div>{date ? new Date(date).toLocaleDateString('en-GB') : '-'}</div>;
        }
    },
    {
        accessorKey: 'days',
        header: ({ column }) => <DataTableColumnHeader column={column} title='NO. OF DAYS' />,
        cell: ({ row }) => <div className='text-center'>{row.original.days || row.original.noOfDays || row.original.totalDays || '-'}</div>
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title='STATUS' />,
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const statusColors: Record<string, string> = {
                Applied: 'bg-yellow-100 text-yellow-700',
                Approved: 'bg-green-100 text-green-700',
                Rejected: 'bg-red-100 text-red-700',
                'Partial Approved': 'bg-blue-100 text-blue-700',
                Pending: 'bg-orange-100 text-orange-700'
            };
            return (
                <span
                    className={`inline-flex rounded-full px-2 py-1 font-medium text-xs ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'
                        }`}>
                    {status}
                </span>
            );
        }
    },
    {
        accessorKey: 'remarks',
        header: ({ column }) => <DataTableColumnHeader column={column} title='REMARK' />,
        cell: ({ row }) => <div className='max-w-xs truncate'>{row.original.remarks || row.original.remark || '-'}</div>
    },
    {
        accessorKey: 'document',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Document' />,
        cell: ({ row }) => {
            const document = row.getValue('document') as string;
            return document ? (
                <a href={document} target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>
                    View
                </a>
            ) : (
                <div>-</div>
            );
        }
    },
    {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => {
            const status = row.original.status;
            const canDelete = status === 'Applied';

            if (!canDelete) {
                return <div className='text-center'>--</div>;
            }

            return (
                <div className='flex justify-center'>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => onDelete?.(row.original.id)}
                        className='h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10'>
                        <Trash2 className='h-4 w-4' />
                    </Button>
                </div>
            );
        }
    }
];

// Default export for backward compatibility
export const leaveHistoryColumns = createLeaveHistoryColumns();
