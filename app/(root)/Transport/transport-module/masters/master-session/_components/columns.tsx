'use client';
import { getStatusBadge } from '@/components/extras/helpers/helper';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterSession } from '@/types/transport/transport-module/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const sessionColumns: ColumnDef<IMasterSession>[] = [
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL.No.' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div>{continuousIndex}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'trmS_SessionName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Session Name' />,
        cell: ({ row }) => <div>{row.original.trmS_SessionName}</div>
    },
    {
        accessorKey: 'trmS_SessionDesc',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Session Description' />,
        cell: ({ row }) => <div>{row.original.trmS_SessionDesc}</div>
    },
    {
        accessorKey: 'trmS_Flag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Pick Up / Drop' />,
        cell: ({ row }) => <div>{row.original.trmS_Flag}</div>
    },
    {
        accessorKey: 'trmS_ActiveFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => getStatusBadge(row.original.trmS_ActiveFlg ? 'active' : 'inactive')
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Action' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterSession }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterSession>();

    const handleEdit = useCallback(
        (data: IMasterSession) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterSession) => {
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
            toggleConditionKey='trmS_ActiveFlg'
        />
    );
}
