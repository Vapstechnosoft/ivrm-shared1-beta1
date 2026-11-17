'use client';

import { getStatusBadge } from '@/components/extras/helpers/helper';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IExamSubjectGroupMapping } from '@/types/exam/exam-module/exam-mapping';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useCallback } from 'react';

export const ExamSubjectGroupMappingColumns: ColumnDef<IExamSubjectGroupMapping>[] = [
    // Row Selection
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label='Select all'
            />
        ),
        cell: ({ row }) => (
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 24
    },

    // Serial Number
    {
        accessorKey: 'esG_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableHiding: true,
        enableSorting: false
    },

    // Academic Year
    {
        accessorKey: 'asmaY_Year',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Year' />,
        cell: ({ row }) => <div>{row.getValue('asmaY_Year')}</div>
    },

    // Category
    {
        accessorKey: 'emcA_CategoryName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Category' />,
        cell: ({ row }) => <div>{row.getValue('emcA_CategoryName')}</div>
    },

    // Exam Name
    {
        accessorKey: 'emE_ExamName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Exam' />,
        cell: ({ row }) => <div>{row.getValue('emE_ExamName') || '-'}</div>
    },

    // Group Name
    {
        accessorKey: 'esG_SubjectGroupName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Group Name' />,
        cell: ({ row }) => <div>{row.getValue('esG_SubjectGroupName')}</div>
    },

    // Min Marks
    {
        accessorKey: 'esG_GroupMinMarks',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Min Marks' />,
        cell: ({ row }) => <div>{row.getValue('esG_GroupMinMarks')}</div>
    },

    // Max Marks
    {
        accessorKey: 'esG_GroupMaxMarks',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Max Marks' />,
        cell: ({ row }) => <div>{row.getValue('esG_GroupMaxMarks')}</div>
    },

    // Compulsory Flag
    {
        accessorKey: 'esG_CompulsoryFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Compulsory' />,
        cell: ({ row }) => getStatusBadge(row.getValue('esG_CompulsoryFlag') === 'Y' ? 'yes' : 'no')
    },

    // Actions - Only Edit
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IExamSubjectGroupMapping }) {
    const { openEditForm } = useFormContext<IExamSubjectGroupMapping>();
    const { openDetailsView } = useFormContext<IExamSubjectGroupMapping>();
    const handleEdit = useCallback(() => openEditForm(rowData), [openEditForm, rowData]);
    const handleView = useCallback(() => openDetailsView(rowData), [openDetailsView, rowData]);

    return (
        <div className='flex justify-center gap-2'>
            <button type='button' onClick={handleView} className='rounded-md p-2 transition hover:bg-muted' title='View Mapping Details'>
                <Eye className='h-4 w-4 text-blue-600' />
            </button>
            <ActionButtons rowData={rowData} buttons={{ edit: false, delete: false, toggle: false }} onEdit={handleEdit} />
        </div>
    );
}
