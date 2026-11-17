'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ICLGTransactionCountReportGridData } from '@/types/library/reports/clg-transaction-count-report';
import type { ColumnDef } from '@tanstack/react-table';

// Columns for Detailed View (College level: Course, Branch, etc.)
export const CLGTransactionCountColumns: ColumnDef<ICLGTransactionCountReportGridData>[] = [
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
        accessorKey: 'amcO_CourseName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Course Name' />,
        cell: ({ row }) => <div>{row.original.ASMCL_CourseName || row.original.ASMCL_CourseName}</div>, // Handling potential property names
        enableSorting: true
    },
    {
        accessorKey: 'amB_BranchName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Branch Name' />,
        cell: ({ row }) => <div>{row.original.AMB_BranchName}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'amsE_SEMName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Semester' />,
        cell: ({ row }) => <div>{row.original.AMSE_SEMName}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'acmS_SectionName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Section' />,
        cell: ({ row }) => <div>{row.original.ACMS_SectionName}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'seccount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Count' />,
        cell: ({ row }) => <div>{row.original.STDCOUNT || row.original.seccount}</div>,
        enableSorting: true
    }
];

// Columns for Status Count View (Transaction Type vs Count)
export const CLGTransactionStatusColumns: ColumnDef<ICLGTransactionCountReportGridData>[] = [
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
        accessorKey: 'lbtR_Status',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Transaction Type' />,
        cell: ({ row }) => <div>{row.original.LBTR_Status}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'seccount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='No. Of Copies' />,
        cell: ({ row }) => <div>{row.original.seccount}</div>,
        enableSorting: true
    }
];
