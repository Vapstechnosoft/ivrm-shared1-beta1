'use client';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { cn } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { Check, X } from 'lucide-react';
// Leave Approval Row
export interface LeaveApprovalRow {
    id?: string | number;
    hrmE_Id: number;
    hrelaP_Id: number;
    slNo?: number;
    employeeCode: string;
    employeeName: string;
    leaveName: string;
    fromDate: string;
    toDate: string;
    totalDays: number;
    leaveStatus: 'Applied' | 'Approved' | 'Rejected' | 'Pending' | string;
    remark?: string;
}
interface LeaveApprovalColumnsProps {
    onApprove: (row: LeaveApprovalRow) => void;
    onReject: (row: LeaveApprovalRow) => void;
    onViewBalance: (row: LeaveApprovalRow) => void;
}
export const getLeaveApprovalColumns = ({ onApprove, onReject, onViewBalance }: LeaveApprovalColumnsProps): ColumnDef<LeaveApprovalRow>[] => [
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='text-center'>{row.getValue('slNo') || continuousIndex}</div>;
        }
    },
    {
        accessorKey: 'employeeCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Code' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('employeeCode')}</div>
    },
    {
        accessorKey: 'employeeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Name' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('employeeName')}</div>
    },
    {
        accessorKey: 'leaveName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Leave Name' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('leaveName')}</div>
    },
    {
        accessorKey: 'fromDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='From Date' />,
        cell: ({ row }) => {
            const date = row.getValue('fromDate') as string;
            return <div>{date ? new Date(date).toLocaleDateString('en-GB') : '-'}</div>;
        }
    },
    {
        accessorKey: 'toDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='To Date' />,
        cell: ({ row }) => {
            const date = row.getValue('toDate') as string;
            return <div>{date ? new Date(date).toLocaleDateString('en-GB') : '-'}</div>;
        }
    },
    {
        accessorKey: 'totalDays',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Days' />,
        cell: ({ row }) => <div className='text-center'>{row.getValue('totalDays')}</div>
    },
    {
        accessorKey: 'leaveStatus',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Leave Status' />,
        cell: ({ row }) => {
            const status = row.getValue('leaveStatus') as string;
            const statusColors: Record<string, string> = {
                Applied: 'bg-yellow-100 text-yellow-700',
                Approved: 'bg-green-100 text-green-700',
                Rejected: 'bg-red-100 text-red-700',
                Pending: 'bg-blue-100 text-blue-700'
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
        accessorKey: 'remark',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Remark' />,
        cell: ({ row }) => <div className='max-w-xs'>{row.getValue('remark') || '-'}</div>
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const entity = row.original;
            const isPending = entity.leaveStatus === 'Applied' || entity.leaveStatus === 'Pending';
            return (
                <div className='flex items-center gap-2'>
                    {isPending && (
                        <>
                            <Button variant='outline' size='sm' onClick={() => onApprove(entity)} className='text-green-700' title='Approve'>
                                <Check className='h-4 w-4' />
                            </Button>
                            <Button variant='outline' size='sm' onClick={() => onReject(entity)} className='text-red-700' title='Reject'>
                                <X className='h-4 w-4' />
                            </Button>
                        </>
                    )}
                    <Button variant='outline' size='sm' onClick={() => onViewBalance(entity)} className='text-blue-700' title='View Balance History'>
                        View Balance
                    </Button>
                </div>
            );
        }
    }
];
