'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { IBookArrivalReportGridData } from '@/types/library/reports/book-arrival-report';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export const BookArrivalReportColumns: ColumnDef<IBookArrivalReportGridData>[] = [
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
        accessorKey: 'lmd_DepartmentName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Department Name' />,
        cell: ({ row }) => <div>{row.getValue('lmd_DepartmentName')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'authorName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Author Name' />,
        cell: ({ row }) => <div>{row.getValue('authorName')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmb_BookType',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Book Type' />,
        cell: ({ row }) => <div>{row.getValue('lmb_BookType')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmb_CallNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='CallNo' />,
        cell: ({ row }) => <div>{row.getValue('lmb_CallNo')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmb_PurchaseDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Purchase Date' />,
        cell: ({ row }) => {
            const date = row.getValue('lmb_PurchaseDate') as string;
            return <div>{date ? format(new Date(date), 'dd-MM-yyyy') : '-'}</div>;
        },
        enableSorting: true
    },
    {
        accessorKey: 'lmb_EntryDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Entry Date' />,
        cell: ({ row }) => {
            const date = row.getValue('lmb_EntryDate') as string;
            return <div>{date ? format(new Date(date), 'dd-MM-yyyy') : '-'}</div>;
        },
        enableSorting: true
    },
    {
        accessorKey: 'lml_LanguageName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Language Name' />,
        cell: ({ row }) => <div>{row.getValue('lml_LanguageName')}</div>,
        enableSorting: true
    }
];
