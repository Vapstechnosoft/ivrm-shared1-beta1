'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';
// Employee Advance Record
export interface EmployeeAdvanceRecord {
    id?: string;
    employeeCode: string;
    employeeName: string;
    groupType: string;
    department: string;
    designation: string;
    advanceRequestDate: string;
    advanceType: 'Salary Advance' | 'Festival Advance' | 'Medical Advance' | 'Emergency Advance' | 'Travel Advance';
    advanceAmount: number;
    approvedAmount: number;
    advanceReason: string;
    approvalDate: string;
    approvedBy: string;
    recoveryStartDate: string;
    recoveryEndDate: string;
    totalInstallments: number;
    installmentAmount: number;
    recoveredAmount: number;
    remainingAmount: number;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Partially Recovered' | 'Fully Recovered';
    month: string;
    year: string;
    basicSalary: number;
    advancePercentage: number;
}
// Advance Type Summary
export interface AdvanceTypeSummary {
    advanceType: string;
    totalRequests: number;
    totalAmount: number;
    approvedRequests: number;
    approvedAmount: number;
    recoveredAmount: number;
    remainingAmount: number;
}
// Main table columns
export const advanceReportColumns: ColumnDef<EmployeeAdvanceRecord>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL.No.' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='text-center'>{continuousIndex}</div>;
        },
        enableSorting: false,
        enableHiding: false,
        size: 80
    },
    {
        accessorKey: 'employeeCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Code' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('employeeCode')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'employeeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Name' />,
        cell: ({ row }) => <div>{row.getValue('employeeName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'department',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Department' />,
        cell: ({ row }) => <div className='text-sm'>{row.getValue('department')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'advanceType',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Advance Type' />,
        cell: ({ row }) => {
            const type = row.getValue('advanceType') as string;
            return (
                <Badge variant='outline' className='text-xs'>
                    {type}
                </Badge>
            );
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'advanceAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Advance Amount' />,
        cell: ({ row }) => <div>₹{(row.getValue('advanceAmount') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'approvedAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Approved Amount' />,
        cell: ({ row }) => <div className='text-green-600'>₹{(row.getValue('approvedAmount') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'recoveredAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Recovered Amount' />,
        cell: ({ row }) => <div className='text-blue-600'>₹{(row.getValue('recoveredAmount') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'remainingAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Remaining Amount' />,
        cell: ({ row }) => <div className='text-orange-600'>₹{(row.getValue('remainingAmount') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const variant =
                status === 'Approved'
                    ? 'default'
                    : status === 'Pending'
                      ? 'secondary'
                      : status === 'Rejected'
                        ? 'destructive'
                        : status === 'Fully Recovered'
                          ? 'default'
                          : 'outline';
            return <Badge variant={variant}>{status}</Badge>;
        },
        enableSorting: true,
        enableHiding: true
    }
];
// Advance type summary columns
export const advanceTypeSummaryColumns: ColumnDef<AdvanceTypeSummary>[] = [
    {
        accessorKey: 'advanceType',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Advance Type' />,
        cell: ({ row }) => <div className='font-semibold'>{row.getValue('advanceType')}</div>,
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'totalRequests',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Requests' />,
        cell: ({ row }) => <div className='text-center'>{row.getValue('totalRequests')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'totalAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Amount' />,
        cell: ({ row }) => <div>₹{(row.getValue('totalAmount') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'approvedRequests',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Approved Requests' />,
        cell: ({ row }) => <div className='text-center text-green-600'>{row.getValue('approvedRequests')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'approvedAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Approved Amount' />,
        cell: ({ row }) => <div className='text-green-600'>₹{(row.getValue('approvedAmount') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'recoveredAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Recovered Amount' />,
        cell: ({ row }) => <div className='text-blue-600'>₹{(row.getValue('recoveredAmount') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'remainingAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Remaining Amount' />,
        cell: ({ row }) => <div className='text-orange-600'>₹{(row.getValue('remainingAmount') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    }
];
