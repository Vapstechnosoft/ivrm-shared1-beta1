'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ICOEData } from '@/types/student-portal/masters/attendance-details';
import type { ColumnDef } from '@tanstack/react-table';

export const coeColumns: ColumnDef<ICOEData>[] = [
    {
        accessorKey: 'lmaL_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl. No' className='w-full pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;

            return <div className='w-full pl-6'>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },

    {
        accessorKey: 'coemE_EventName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Event Name' />,
        cell: ({ row }) => <div>{row.getValue('coemE_EventName')}</div>
    },
    {
        accessorKey: 'coemE_EventDesc',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Event Description' />,
        cell: ({ row }) => <div>{row.getValue('coemE_EventDesc')}</div>
    },
    {
        accessorKey: 'coeE_EStartDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Start Date' />,
        cell: ({ row }) => <div>{formatDate(row.getValue('coeE_EStartDate'))}</div>
    },
    {
        accessorKey: 'coeE_EEndDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='End Date' />,
        cell: ({ row }) => <div>{formatDate(row.getValue('coeE_EEndDate'))}</div>
    }
];

const formatDate = (value: string | number | Date) => {
    if (!value) return '-';
    const d = new Date(value);
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
};
