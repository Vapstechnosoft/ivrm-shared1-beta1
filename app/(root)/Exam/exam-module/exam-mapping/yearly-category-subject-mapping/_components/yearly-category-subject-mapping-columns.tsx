'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { IYearlyCategorySubjectMappingViewDetails } from '@/types/exam/exam-module/exam-mapping';
import type { ColumnDef } from '@tanstack/react-table';

export const YearlyCategorySubjectMappingViewDetailsColumns: ColumnDef<IYearlyCategorySubjectMappingViewDetails>[] = [
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl. No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: true
    },
    {
        accessorKey: 'ismS_SubjectName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Subject Name' />,
        cell: ({ row }) => <div>{row.getValue('ismS_SubjectName')}</div>,
        enableSorting: false,
        enableHiding: true
    },
    {
        accessorKey: 'ismS_SubjectCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Subject Code' />,
        cell: ({ row }) => <div>{row.getValue('ismS_SubjectCode')}</div>,
        enableSorting: false,
        enableHiding: true
    }
];
