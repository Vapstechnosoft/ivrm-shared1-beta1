'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { IExamMarksProcessCondition } from '@/types/exam/exam-module/exam-mapping';
import type { ColumnDef } from '@tanstack/react-table';

export const ExamMarksProcessConditionColumns: ColumnDef<IExamMarksProcessCondition>[] = [
    {
        id: 'slno',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false
    },

    // Academic Year
    {
        accessorKey: 'asmaY_Year',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Academic Year' />
    },

    // ✅ Category Name (ADDED BEFORE EXAM NAME)
    {
        accessorKey: 'emcA_CategoryName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Category Name' />
    },

    // Exam Name
    {
        accessorKey: 'emE_ExamName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Exam Name' />
    },

    // Exam Start Date
    {
        accessorKey: 'eycE_ExamStartDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Exam Start Date' />,
        cell: ({ row }) => {
            const value = row.original.eycE_ExamStartDate;
            return <div>{value ? value.split('T')[0] : '-'}</div>;
        }
    },

    // Exam End Date
    {
        accessorKey: 'eycE_ExamEndDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Exam End Date' />,
        cell: ({ row }) => {
            const value = row.original.eycE_ExamEndDate;
            return <div>{value ? value.split('T')[0] : '-'}</div>;
        }
    },

    // Marks Entry Last Date
    {
        accessorKey: 'eycE_MarksEntryLastDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Marks Entry Last Date' />,
        cell: ({ row }) => {
            const value = row.original.eycE_MarksEntryLastDate;
            return <div>{value ? value.split('T')[0] : '-'}</div>;
        }
    },

    // Marks Process Last Date
    {
        accessorKey: 'eycE_MarksProcessLastDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Marks Process Last Date' />,
        cell: ({ row }) => {
            const value = row.original.eycE_MarksProcessLastDate;
            return <div>{value ? value.split('T')[0] : '-'}</div>;
        }
    },

    // Marks Publish Date
    {
        accessorKey: 'eycE_MarksPublishDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Marks Publish Date' />,
        cell: ({ row }) => {
            const value = row.original.eycE_MarksPublishDate;
            return <div>{value ? value.split('T')[0] : '-'}</div>;
        }
    }
];
