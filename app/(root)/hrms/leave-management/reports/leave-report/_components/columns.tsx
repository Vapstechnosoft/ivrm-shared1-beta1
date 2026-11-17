'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { cn } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
export interface LeaveReportRow {
    slNo: number;
    employeeCode: string;
    employeeName: string;
    leaveName: string;
    fromDate: string;
    toDate: string;
    appliedDays: number;
    leaveStatus: 'Approved' | 'Pending' | 'Rejected';
    leaveBalance: number;
}
export const leaveReportColumns: ColumnDef<LeaveReportRow>[] = [
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
        cell: ({ row }) => <div className='text-center'>{row.getValue('slNo')}</div>
    },
    {
        accessorKey: 'employeeCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Code' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('employeeCode')}</div>
    },
    {
        accessorKey: 'employeeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Name' />,
        cell: ({ row }) => <div>{row.getValue('employeeName')}</div>
    },
    {
        accessorKey: 'leaveName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Leave Name' />,
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
        accessorKey: 'appliedDays',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Applied Days' />,
        cell: ({ row }) => <div className='text-center'>{row.getValue('appliedDays')}</div>
    },
    {
        accessorKey: 'leaveStatus',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Leave Status' />,
        cell: ({ row }) => {
            const status = row.getValue('leaveStatus') as string;
            const statusColors = {
                Approved: 'bg-green-100 text-green-700',
                Pending: 'bg-yellow-100 text-yellow-700',
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
        accessorKey: 'leaveBalance',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Leave Balance' />,
        cell: ({ row }) => <div className='text-center font-semibold'>{row.getValue('leaveBalance')}</div>
    }
];
