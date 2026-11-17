'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ILibLostBookReportGridData } from '@/types/library/reports/lib-lost-book-report';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export const LibLostBookReportColumns: ColumnDef<ILibLostBookReportGridData>[] = [
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
        header: ({ column }) => <DataTableColumnHeader column={column} title='Accession No.' />,
        cell: ({ row }) => <div>{row.original.LMBANO_AccessionNo}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmB_BookTitle',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Book Title' />,
        cell: ({ row }) => <div>{row.original.LMB_BookTitle}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmbanO_AvialableStatus',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Book Status' />,
        cell: ({ row }) => <div>{row.original.LMBANO_AvialableStatus}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmbanO_AmountCollected',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Fine Amount' />,
        cell: ({ row }) => <div>{row.original.LMBANO_AmountCollected}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmbanO_ModeOfPayment',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Payment' />,
        cell: ({ row }) => <div>{row.original.LMBANO_ModeOfPayment}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmbanO_LostDamagedReason',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Reason' />,
        cell: ({ row }) => <div>{row.original.LMBANO_LostDamagedReason}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmbanO_LostDamagedDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Lost Date' />,
        cell: ({ row }) => {
            const date = row.original.LMBANO_LostDamagedDate;
            return <div>{date ? format(new Date(date), 'dd/MM/yyyy') : ''}</div>;
        },
        enableSorting: true
    }
];
