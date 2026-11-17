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

export interface MonthlyRow {
    user_id?: number;
    employee_code?: string;
    employee_name?: string;
    designation?: string;
    date_of_joining?: string;
    total_working_days?: number;
    total_absent_days?: number;
    total_present_days?: number;
    total_holiday_punches?: number;
    [key: string]: any;
}

export const employeeMonthlyReportColumns: ColumnDef<MonthlyRow>[] = [
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
        header: ({ column }) => <DataTableColumnHeader column={column} title='Designation' />,
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
        accessorKey: 'total_working_days',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Working Days' />,
        cell: ({ row }) => <div>{row.getValue('total_working_days')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'total_present_days',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Present Days' />,
        cell: ({ row }) => <div>{row.getValue('total_present_days')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'total_absent_days',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Absent Days' />,
        cell: ({ row }) => <div>{row.getValue('total_absent_days')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'total_holiday_punches',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Holiday Punches' />,
        cell: ({ row }) => <div>{row.getValue('total_holiday_punches')}</div>,
        enableSorting: true,
        enableHiding: true
    }
];
