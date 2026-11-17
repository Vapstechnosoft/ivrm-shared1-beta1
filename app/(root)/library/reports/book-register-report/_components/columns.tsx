'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { IBookRegisterReportGridData } from '@/types/library/reports/book-register-report';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export const BookRegisterReportColumns: ColumnDef<IBookRegisterReportGridData>[] = [
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
        accessorKey: 'lmB_BookType',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Book Type' />,
        cell: ({ row }) => <div>{row.original.lmB_BookType}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmD_DepartmentName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Dept Name' />,
        cell: ({ row }) => <div>{row.original.lmD_DepartmentName}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmB_BookTitle',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Book Title' />,
        cell: ({ row }) => <div>{row.original.lmB_BookTitle}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmP_PublisherName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Publisher Name' />,
        cell: ({ row }) => <div>{row.original.lmP_PublisherName}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmbA_AuthorFirstName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Author Name' />,
        cell: ({ row }) => <div>{row.original.lmbA_AuthorFirstName}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmL_LanguageName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Language Name' />,
        cell: ({ row }) => <div>{row.original.lmL_LanguageName}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmS_SubjectName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Subject Name' />,
        cell: ({ row }) => <div>{row.original.lmS_SubjectName}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmB_EntryDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Entry Date' />,
        cell: ({ row }) => {
            const date = row.original.lmB_EntryDate;
            return <div>{date ? format(new Date(date), 'dd/MM/yyyy') : ''}</div>;
        },
        enableSorting: true
    },
    {
        accessorKey: 'lmB_PurchaseDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Purchase Date' />,
        cell: ({ row }) => {
            const date = row.original.lmB_PurchaseDate;
            return <div>{date ? format(new Date(date), 'dd/MM/yyyy') : ''}</div>;
        },
        enableSorting: true
    },
    {
        accessorKey: 'lmB_ISBNNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='ISBN No.' />,
        cell: ({ row }) => <div>{row.original.lmB_ISBNNo}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmB_PurOrDonated',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Mode Of Book' />,
        cell: ({ row }) => <div>{row.original.lmB_PurOrDonated}</div>,
        enableSorting: true
    }
];
