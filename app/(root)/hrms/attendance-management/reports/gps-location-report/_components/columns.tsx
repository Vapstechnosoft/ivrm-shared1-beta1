'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

const formatDate = (date: unknown): string => {
    if (typeof date !== 'string') return 'N/A';
    if (!date) return 'N/A';
    return format(new Date(date), 'dd-MM-yyyy HH:mm');
};

export interface GPSLog {
    user_id?: number;
    employee_name?: string;
    client_name?: string;
    lead_name?: string;
    gps_date?: string;
    address?: string;
    remarks?: string;
    [key: string]: any;
}

export const gpsLocationReportColumns: ColumnDef<GPSLog>[] = [
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
        accessorKey: 'employee_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Name' />,
        cell: ({ row }) => <div>{row.getValue('employee_name')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'client_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Client Name' />,
        cell: ({ row }) => <div>{row.getValue('client_name')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'lead_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Lead Name' />,
        cell: ({ row }) => <div>{row.getValue('lead_name')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'gps_date',
        header: ({ column }) => <DataTableColumnHeader column={column} title='GPS Date' />,
        cell: ({ row }) => {
            const date = row.getValue('gps_date');
            return <div>{formatDate(date)}</div>;
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'address',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Address' />,
        cell: ({ row }) => <div>{row.getValue('address')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'remarks',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Remarks' />,
        cell: ({ row }) => <div>{row.getValue('remarks')}</div>,
        enableSorting: true,
        enableHiding: true
    }
];
