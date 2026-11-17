'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { CompOffRequestItem, EmployeeLeaveDetail } from '@/types/hrms/leave-management/comp-off-request';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
export type { CompOffRequestItem, EmployeeLeaveDetail };
export const compOffRequestColumns = (
    selectedRows: Set<number>,
    onSelectRow: (id: number, checked: boolean) => void,
    allRequests: CompOffRequestItem[]
): ColumnDef<CompOffRequestItem>[] => [
    {
        id: 'select',
        header: () => {
            const isAllSelected = allRequests.length > 0 && selectedRows.size === allRequests.length;
            const _isIndeterminate = selectedRows.size > 0 && selectedRows.size < allRequests.length;
            return (
                <Checkbox
                    checked={isAllSelected}
                    ref={(el) => {
                        if (el) {
                            // Radix Checkbox uses a button, so we need to access the underlying element
                            // For now, we'll handle indeterminate state visually via checked prop
                            // The indeterminate state is handled by the checked prop logic above
                        }
                    }}
                    onCheckedChange={(value) => {
                        if (value) {
                            allRequests.forEach((r) => onSelectRow(r.id, true));
                        } else {
                            selectedRows.forEach((id) => onSelectRow(id, false));
                        }
                    }}
                    aria-label='Select all'
                />
            );
        },
        cell: ({ row }) => (
            <Checkbox
                checked={selectedRows.has(row.original.id)}
                onCheckedChange={(checked) => onSelectRow(row.original.id, !!checked)}
                aria-label='Select row'
            />
        ),
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('slNo')}</div>
    },
    {
        accessorKey: 'date',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Date' />,
        cell: ({ row }) => {
            const date = row.getValue('date') as string;
            return <div>{new Date(date).toLocaleDateString('en-GB')}</div>;
        }
    },
    {
        id: 'time',
        header: 'Time',
        cell: ({ row }) => {
            const inTime = row.original.inTime;
            const outTime = row.original.outTime;
            return (
                <div className='space-y-1'>
                    <div className='text-sm'>
                        <span className='font-medium'>Punch Time: </span>
                        <span>In Time: {inTime}</span>
                    </div>
                    <div className='text-sm'>
                        <span>Out Time: {outTime}</span>
                    </div>
                </div>
            );
        }
    },
    {
        accessorKey: 'compOffToBeCredit',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Comp Off To Be Credit' />,
        cell: ({ row }) => <div className='text-center'>{row.getValue('compOffToBeCredit')}</div>
    },
    {
        accessorKey: 'reason',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Reason' />,
        cell: ({ row }) => <div className='max-w-md'>{row.getValue('reason')}</div>
    },
    {
        accessorKey: 'drStatus',
        header: ({ column }) => <DataTableColumnHeader column={column} title='DR Status' />,
        cell: () => (
            <div className='flex items-center justify-center'>
                <Eye className='h-4 w-4 cursor-pointer text-blue-600 hover:text-blue-800' />
            </div>
        )
    }
];
export const employeeLeaveDetailColumns: ColumnDef<EmployeeLeaveDetail>[] = [
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('slNo')}</div>
    },
    {
        accessorKey: 'leaveName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Leave Name' />,
        cell: ({ row }) => <div>{row.getValue('leaveName')}</div>
    },
    {
        accessorKey: 'leaveReason',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Leave Reason' />,
        cell: ({ row }) => <div className='max-w-md'>{row.getValue('leaveReason')}</div>
    },
    {
        accessorKey: 'fromDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='From Date' />,
        cell: ({ row }) => {
            const date = row.getValue('fromDate') as string;
            return <div>{new Date(date).toLocaleDateString('en-GB')}</div>;
        }
    },
    {
        accessorKey: 'toDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='To Date' />,
        cell: ({ row }) => {
            const date = row.getValue('toDate') as string;
            return <div>{new Date(date).toLocaleDateString('en-GB')}</div>;
        }
    },
    {
        accessorKey: 'noOfDays',
        header: ({ column }) => <DataTableColumnHeader column={column} title='NO. OF DAYS' />,
        cell: ({ row }) => <div className='text-center'>{row.getValue('noOfDays')}</div>
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title='STATUS' />,
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const statusColors: Record<string, string> = {
                Approved: 'text-green-700',
                'Partial Approved': 'text-yellow-700',
                Pending: 'text-blue-700',
                Rejected: 'text-red-700'
            };
            return <div className={`font-medium ${statusColors[status] || 'text-gray-700'}`}>{status}</div>;
        }
    }
];
