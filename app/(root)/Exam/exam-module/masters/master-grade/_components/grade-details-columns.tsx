'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { IGradeDetails } from '@/types/exam/exam-module/masters';
import type { ColumnDef } from '@tanstack/react-table';

export const GradeDetailsColumns: ColumnDef<IGradeDetails>[] = [
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div>{continuousIndex}</div>;
        },
        enableSorting: false,
        enableHiding: true
    },
    {
        accessorKey: 'emgD_Name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Grade Name' />,
        cell: ({ row }) => <div>{row.getValue('emgD_Name')}</div>,
        enableSorting: false,
        enableHiding: true
    },
    {
        accessorKey: 'emgD_From',
        header: ({ column }) => <DataTableColumnHeader column={column} title='From' />,
        cell: ({ row }) => <div>{row.getValue('emgD_From')}</div>,
        enableSorting: false,
        enableHiding: true
    },
    {
        accessorKey: 'emgD_To',
        header: ({ column }) => <DataTableColumnHeader column={column} title='To' />,
        cell: ({ row }) => <div>{row.getValue('emgD_To')}</div>,
        enableSorting: false
    },
    {
        accessorKey: 'emgD_GradePoints',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Grade Points' />,
        cell: ({ row }) => <div>{row.getValue('emgD_GradePoints')}</div>,
        enableSorting: false,
        enableHiding: true
    },
    {
        accessorKey: 'emgD_Remarks',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Remarks' />,
        cell: ({ row }) => <div>{row.getValue('emgD_Remarks')}</div>,
        enableSorting: false,
        enableHiding: true
    }
];
