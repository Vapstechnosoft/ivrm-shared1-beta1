'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterSubSubject } from '@/types/exam/exam-module/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const subSubjectColumns: ColumnDef<IMasterSubSubject>[] = [
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
        accessorKey: 'emsS_SubSubjectName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SubSubject Name' />,
        cell: ({ row }) => <div>{row.getValue('emsS_SubSubjectName')}</div>
    },
    {
        accessorKey: 'emsS_SubSubjectCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SubSubject Code' />,
        cell: ({ row }) => <div>{row.getValue('emsS_SubSubjectCode')}</div>
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterSubSubject }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterSubSubject>();

    const handleEdit = useCallback(
        (data: IMasterSubSubject) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterSubSubject) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    return (
        <div className='flex items-center justify-center py-1'>
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: true, toggle: true, delete: false }}
                onEdit={handleEdit}
                onToggle={handleToggle}
                toggleConditionKey='emsS_ActiveFlag'
            />
        </div>
    );
}
