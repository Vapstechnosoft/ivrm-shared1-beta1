'use client';
import { getStatusBadge } from '@/components/extras/helpers/helper';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterExam } from '@/types/exam/exam-module/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const MasterExamColumns: ColumnDef<IMasterExam>[] = [
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
        accessorKey: 'emE_ExamName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Exam Name' />,
        cell: ({ row }) => <div>{row.getValue('emE_ExamName')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'emE_IVRSExamName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='IVRS Exam Name' />,
        cell: ({ row }) => <div>{row.getValue('emE_IVRSExamName')}</div>
    },
    {
        accessorKey: 'emE_ExamDescription',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Exam Description' />,
        cell: ({ row }) => <div>{row.getValue('emE_ExamDescription')}</div>
    },
    {
        accessorKey: 'emE_ExamCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Exam Code' />,
        cell: ({ row }) => <div>{row.getValue('emE_ExamCode')}</div>
    },
    {
        accessorKey: 'emE_FinalExamFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Final Exam Flag' />,
        cell: ({ row }) => getStatusBadge(row.getValue('emE_FinalExamFlag') === true ? 'yes' : 'no')
    },
    {
        accessorKey: 'emE_ExamOrder',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Exam Order' />,
        cell: ({ row }) => <div>{row.getValue('emE_ExamOrder')}</div>
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterExam }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterExam>();

    const handleEdit = useCallback(
        (data: IMasterExam) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterExam) => {
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
            toggleConditionKey='emE_ActiveFlag'
        />
    );
}
