'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { IAvailableBooksReportGridData } from '@/types/library/reports/available-books-report';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export const AvailableBooksReportColumns: ColumnDef<IAvailableBooksReportGridData>[] = [
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
        accessorKey: 'lmb_EntryDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Entry Date' />,
        cell: ({ row }) => {
            const date = row.getValue('lmb_EntryDate') as string;
            return <div>{date ? format(new Date(date), 'dd/MM/yyyy') : '-'}</div>;
        },
        enableSorting: true
    },
    {
        accessorKey: 'lmbano_AccessionNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Accession No' />,
        cell: ({ row }) => <div>{row.getValue('lmbano_AccessionNo')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmb_BookTitle',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Title' />,
        cell: ({ row }) => <div>{row.getValue('lmb_BookTitle')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmb_BookType',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Book Type' />,
        cell: ({ row }) => <div>{row.getValue('lmb_BookType')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmd_DepartmentName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Department' />,
        cell: ({ row }) => <div>{row.getValue('lmd_DepartmentName')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'authorName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Author' />,
        cell: ({ row }) => <div>{row.getValue('authorName')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmp_PublisherName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Publisher' />,
        cell: ({ row }) => <div>{row.getValue('lmp_PublisherName')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lml_LanguageName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Language' />,
        cell: ({ row }) => <div>{row.getValue('lml_LanguageName')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lms_SubjectName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Subject' />,
        cell: ({ row }) => <div>{row.getValue('lms_SubjectName')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmb_PurOrDonated',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Purchased/Donated' />,
        cell: ({ row }) => <div>{row.getValue('lmb_PurOrDonated')}</div>,
        enableSorting: true
    }
];
