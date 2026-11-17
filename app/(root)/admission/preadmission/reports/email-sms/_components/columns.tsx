'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { IRigistrationReportList } from '@/types/admission/preadmission/reports';
import type { ColumnDef } from '@tanstack/react-table';

export const registrationColumns: ColumnDef<IRigistrationReportList>[] = [
    {
        accessorKey: 'rowNumber',
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
        accessorKey: 'smsCount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SMS Count' />,
        cell: ({ row }) => <div>{row.getValue('smsCount')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'emailCount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Email Count' />,
        cell: ({ row }) => <div>{row.getValue('emailCount')}</div>,
        enableSorting: true,
        enableHiding: true
    }
];
