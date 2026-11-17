'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { IRigistrationReportList } from '@/types/admission/preadmission/reports';
import type { ColumnDef } from '@tanstack/react-table';

import { format } from 'date-fns';

export const registrationColumns: ColumnDef<IRigistrationReportList>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllRowsSelected() || (table.getIsSomeRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
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
        accessorKey: 'user_Name',
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
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
        cell: ({ row }) => <div>{row.getValue('name')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'email_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
        cell: ({ row }) => <div>{row.getValue('email_Id')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'mob_No',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Mobile No' />,
        cell: ({ row }) => <div>{row.getValue('mob_No')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'created_Date',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Date' />,
        cell: ({ row }) => {
            const raw = row.getValue('created_Date');
            const dateStr = typeof raw === 'string' || typeof raw === 'number' ? raw : '';

            const formattedDate = dateStr ? format(new Date(dateStr), 'dd-MM-yyyy') : '';

            return <div>{formattedDate}</div>;
        },
        enableSorting: true,
        enableHiding: true
    }
];
