'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IExamSubjectGroupingDetails } from '@/types/exam/exam-module/exam-mapping';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const ExamSubjectGroupingDetailsColumns: ColumnDef<IExamSubjectGroupingDetails>[] = [
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: true
    },
    {
        accessorKey: 'emcA_CategoryName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Exam Category' />,
        cell: ({ row }) => <div>{row.getValue('emcA_CategoryName')}</div>,
        enableHiding: true,
        enableSorting: false
    },
    {
        accessorKey: 'esG_SubjectGroupName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Group Name' />,
        cell: ({ row }) => <div>{row.getValue('esG_SubjectGroupName')}</div>,
        enableHiding: true,
        enableSorting: false
    },
    {
        accessorKey: 'emE_ExamName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Exam Name' />,
        cell: ({ row }) => <div>{row.getValue('emE_ExamName')}</div>,
        enableHiding: true,
        enableSorting: false
    },
    {
        accessorKey: 'ismS_SubjectName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Subject Name' />,
        cell: ({ row }) => <div>{row.getValue('ismS_SubjectName')}</div>,
        enableHiding: true,
        enableSorting: false
    },
    {
        accessorKey: 'esG_GroupMinMarks',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Min Marks' />,
        cell: ({ row }) => <div>{row.getValue('esG_GroupMinMarks')}</div>,
        enableHiding: true,
        enableSorting: false
    },
    {
        accessorKey: 'esG_GroupMaxMarks',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Max Marks' />,
        cell: ({ row }) => <div>{row.getValue('esG_GroupMaxMarks')}</div>,
        enableHiding: true,
        enableSorting: false
    },
    {
        accessorKey: 'esG_CompulsoryFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Compulsory' />,
        cell: ({ row }) => <div>{row.getValue('esG_CompulsoryFlag') === 'Y' ? 'Yes' : 'No'}</div>,
        enableHiding: true,
        enableSorting: false
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Active Status' className='text-center' />,
        accessorFn: (row) => row,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
        enableHiding: true,
        enableSorting: false
    }
];

function ActionButtonsCell({ rowData }: { rowData: IExamSubjectGroupingDetails }) {
    const { openToggleForm } = useFormContext<IExamSubjectGroupingDetails>();

    const handleToggle = useCallback(() => openToggleForm(rowData), [openToggleForm, rowData]);

    return (
        <div className='flex justify-center'>
            <ActionButtons rowData={rowData} buttons={{ toggle: true }} onToggle={handleToggle} toggleConditionKey='esgS_ActiveFlag' />
        </div>
    );
}
