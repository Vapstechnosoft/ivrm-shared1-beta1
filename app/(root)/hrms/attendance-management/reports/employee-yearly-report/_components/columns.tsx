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

export interface YearRow {
    user_id?: number;
    employee_code?: string;
    employee_name?: string;
    designation?: string;
    date_of_joining?: string;
    january?: number;
    total_present?: number;
    total_worked_on_holidays?: number;
    [key: string]: any;
}

export const employeeYearlyReportColumns: ColumnDef<YearRow>[] = [
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
        accessorKey: 'employee_code',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Code' />,
        cell: ({ row }) => <div>{row.getValue('employee_code')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'employee_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Name' />,
        cell: ({ row }) => <div>{row.getValue('employee_name')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'designation',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Designation' />,
        cell: ({ row }) => <div>{row.getValue('designation')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'date_of_joining',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Date of Joining' />,
        cell: ({ row }) => {
            const date = row.getValue('date_of_joining');
            return <div>{formatDate(date)}</div>;
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'january',
        header: ({ column }) => <DataTableColumnHeader column={column} title='January' />,
        cell: ({ row }) => <div>{row.getValue('january')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'total_present',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Present' />,
        cell: ({ row }) => <div>{row.getValue('total_present')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'total_worked_on_holidays',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Worked on Holidays' />,
        cell: ({ row }) => <div>{row.getValue('total_worked_on_holidays')}</div>,
        enableSorting: true,
        enableHiding: true
    }
];
