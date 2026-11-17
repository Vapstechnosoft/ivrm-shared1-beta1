'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { MasterEventCoe } from '@/types/coe/masterevent';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const masterColumnevent: ColumnDef<MasterEventCoe>[] = [
    {
        accessorKey: 'coemE_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} className='w-full pl-6' title='Sl. No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='w-full pl-6'>{continuousIndex}</div>;
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'coemE_EventName',
        header: ({ column }) => <DataTableColumnHeader column={column} title=' Event Name' />,
        cell: ({ row }) => <div>{row.getValue('coemE_EventName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'coemE_EventDesc',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Event Description' />,
        cell: ({ row }) => <div>{row.getValue('coemE_EventDesc')}</div>,
        enableSorting: true,
        enableHiding: true
    },

    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-start' />,
        accessorFn: (row) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: MasterEventCoe }) {
    const { openEditForm, openToggleForm, openDeleteForm } = useFormContext<MasterEventCoe>();

    const handleEdit = useCallback(
        (data: MasterEventCoe) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: MasterEventCoe) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    const handleDelete = useCallback(
        (data: MasterEventCoe) => {
            openDeleteForm(data);
        },
        [openDeleteForm]
    );

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: true, delete: false }}
            onEdit={handleEdit}
            onToggle={handleToggle}
            toggleConditionKey='coemE_ActiveFlag'
        />
    );
}
