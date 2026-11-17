'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { cn } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
export interface OverallReportRow {
    employee: string;
    leaveName: string;
    fromDate: string;
    toDate: string;
    status: 'Applied' | 'Approved' | 'Requested' | 'Rejected' | 'PartialApproved';
}
export const overallReportColumns: ColumnDef<OverallReportRow>[] = [
    {
        accessorKey: 'employee',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Employee' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('employee')}</div>
    },
    {
        accessorKey: 'leaveName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Leave' />,
        cell: ({ row }) => <div>{row.getValue('leaveName')}</div>
    },
    {
        accessorKey: 'fromDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='From Date' />,
        cell: ({ row }) => {
            const date = row.getValue('fromDate') as string;
            return <div>{new Date(date).toLocaleDateString()}</div>;
        }
    },
    {
        accessorKey: 'toDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='To Date' />,
        cell: ({ row }) => {
            const date = row.getValue('toDate') as string;
            return <div>{new Date(date).toLocaleDateString()}</div>;
        }
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const statusColors = {
                Applied: 'bg-yellow-100 text-yellow-700',
                Approved: 'bg-green-100 text-green-700',
                Requested: 'bg-blue-100 text-blue-700',
                Rejected: 'bg-red-100 text-red-700',
                PartialApproved: 'bg-purple-100 text-purple-700'
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
    }
];
