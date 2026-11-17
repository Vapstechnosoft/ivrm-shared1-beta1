'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

const formatDate = (date: unknown): string => {
    if (typeof date !== 'string') return 'N/A';
    if (!date) return 'N/A';
    return format(new Date(date), 'dd-MM-yyyy');
};

import type { BaseEntity } from '@/lib/localdb';

export interface InOutRow extends BaseEntity {
    user_id?: number;
    user_name?: string;
    employee_code?: string;
    date?: string;
    time_in?: string;
    time_out?: string;
    branch?: string;
    department?: string;
    designation?: string;
    type?: string;
    employeeCode?: string;
    employeeName?: string;
    timeIn?: string;
    timeOut?: string;
    [key: string]: any;
}

export const employeeInOutReportColumns: ColumnDef<InOutRow>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label='Select all'
            />
        ),
        cell: ({ row }) => (
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 24
    },
    {
        accessorKey: 'user_id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='w-full pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='w-full pl-6'>{continuousIndex}</div>;
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'user_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Name' />,
        cell: ({ row }) => <div>{row.getValue('user_name')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'employee_code',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Code' />,
        cell: ({ row }) => <div>{row.getValue('employee_code')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'date',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Date' />,
        cell: ({ row }) => {
            const date = row.getValue('date');
            return <div>{formatDate(date)}</div>;
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'time_in',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Time In' />,
        cell: ({ row }) => <div>{row.getValue('time_in')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'time_out',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Time Out' />,
        cell: ({ row }) => <div>{row.getValue('time_out')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'department',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Department' />,
        cell: ({ row }) => <div>{row.getValue('department')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'designation',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Designation' />,
        cell: ({ row }) => <div>{row.getValue('designation')}</div>,
        enableSorting: true,
        enableHiding: true
    }
];
