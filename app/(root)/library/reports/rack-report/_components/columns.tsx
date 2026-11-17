'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { IRackReportGridData } from '@/types/library/reports/rack-report';
import type { ColumnDef } from '@tanstack/react-table';

export const RackReportColumns: ColumnDef<IRackReportGridData>[] = [
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
        accessorKey: 'lmbano_AccessionNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Accession No' />,
        cell: ({ row }) => <div>{row.getValue('lmbano_AccessionNo')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmb_BookTitle',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Book Title' />,
        cell: ({ row }) => <div>{row.getValue('lmb_BookTitle')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'rack_Name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Rack Name' />,
        cell: ({ row }) => <div>{row.getValue('rack_Name')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmra_FloorName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Floor Name' />,
        cell: ({ row }) => <div>{row.getValue('lmra_FloorName')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmb_BookType',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Book Type' />,
        cell: ({ row }) => <div>{row.getValue('lmb_BookType')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'rack_Location',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Location' />,
        cell: ({ row }) => <div>{row.getValue('rack_Location')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmbano_AvialableStatus',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Book Status' />,
        cell: ({ row }) => <div>{row.getValue('lmbano_AvialableStatus')}</div>,
        enableSorting: true
    }
];
