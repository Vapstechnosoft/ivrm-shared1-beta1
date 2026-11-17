'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { cn } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
export interface HeadWiseRecord {
    id?: number;
    createdAt?: string;
    salaryHead: string;
    headType: 'Earning' | 'Deduction';
    groupType: string;
    departmentName: string;
    totalEmployees: number;
    totalAmount: number;
    averageAmount: number;
    maxAmount: number;
    minAmount: number;
    month: string;
    year: string;
}
export const headWiseReportColumns: ColumnDef<HeadWiseRecord>[] = [
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
        accessorKey: 'salaryHead',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Salary Head' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('salaryHead')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'headType',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Type' />,
        cell: ({ row }) => {
            const type = row.getValue('headType') as string;
            return (
                <span
                    className={cn(
                        'rounded-full px-2 py-1 font-medium text-xs',
                        type === 'Earning' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    )}>
                    {type}
                </span>
            );
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'groupType',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Group Type' />,
        cell: ({ row }) => <div>{row.getValue('groupType')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'departmentName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Department' />,
        cell: ({ row }) => <div>{row.getValue('departmentName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'totalEmployees',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Employees' />,
        cell: ({ row }) => <div className='text-center'>{row.getValue('totalEmployees')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'totalAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Amount' />,
        cell: ({ row }) => <div className='font-semibold'>₹{(row.getValue('totalAmount') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'averageAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Average Amount' />,
        cell: ({ row }) => <div>₹{(row.getValue('averageAmount') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'maxAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Max Amount' />,
        cell: ({ row }) => <div className='text-green-600'>₹{(row.getValue('maxAmount') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'minAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Min Amount' />,
        cell: ({ row }) => <div className='text-orange-600'>₹{(row.getValue('minAmount') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    }
];
