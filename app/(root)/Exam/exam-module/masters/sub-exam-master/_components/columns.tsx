'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterSubExam } from '@/types/exam/exam-module/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const MasterSubExamColumns: ColumnDef<IMasterSubExam>[] = [
    {
        accessorKey: 'slNo',
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
        accessorKey: 'emsE_SubExamName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sub Exam Name' />,
        cell: ({ row }) => <div>{row.getValue('emsE_SubExamName')}</div>
    },
    {
        accessorKey: 'emsE_SubExamCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sub Exam Code' />,
        cell: ({ row }) => <div>{row.getValue('emsE_SubExamCode')}</div>
    },
    {
        accessorKey: 'emsE_SubExamOrder',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sub Exam Order' />,
        cell: ({ row }) => <div>{row.getValue('emsE_SubExamOrder')}</div>
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterSubExam }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterSubExam>();

    const handleEdit = useCallback(
        (data: IMasterSubExam) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterSubExam) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: true, delete: false }}
            onEdit={handleEdit}
            onToggle={handleToggle}
            toggleConditionKey='emsE_ActiveFlag'
        />
    );
}
