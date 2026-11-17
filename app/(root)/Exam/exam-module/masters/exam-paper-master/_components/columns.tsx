'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterExamPaper } from '@/types/exam/exam-module/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const MasterExamPaperColumns: ColumnDef<IMasterExamPaper>[] = [
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
        accessorKey: 'empatY_PaperTypeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Paper Type Name' />,
        cell: ({ row }) => <div>{row.getValue('empatY_PaperTypeName')}</div>
    },
    {
        accessorKey: 'empatY_Color',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Color' />,
        cell: ({ row }) => <div>{row.getValue('empatY_Color')}</div>
    },
    {
        accessorKey: 'empatY_PaperTypeDescription',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Paper Type Description' />,
        cell: ({ row }) => <div>{row.getValue('empatY_PaperTypeDescription')}</div>
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterExamPaper }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterExamPaper>();

    const handleEdit = useCallback(
        (data: IMasterExamPaper) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterExamPaper) => {
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
            toggleConditionKey='empatY_ActiveFlag' // Adjust based on your backend active flag (if applicable)
        />
    );
}
