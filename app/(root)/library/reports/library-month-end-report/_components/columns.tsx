'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';

export interface MonthEndReportDisplayData {
    TNAME: string;
    COUNT: number;
}

export const LibraryMonthEndReportColumns: ColumnDef<MonthEndReportDisplayData>[] = [
    {
        id: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div>{continuousIndex}</div>;
        },
        enableHiding: true,
        enableSorting: false
    },
    {
        accessorKey: 'TNAME',
        header: ({ column }) => <DataTableColumnHeader column={column} title='DETAILS' />,
        cell: ({ row }) => <div className='font-medium'>{row.original.TNAME}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'COUNT',
        header: ({ column }) => <DataTableColumnHeader column={column} title='COUNT' />,
        cell: ({ row }) => <div>{row.original.COUNT}</div>,
        enableSorting: true
    }
];
