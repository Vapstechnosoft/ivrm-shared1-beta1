'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IInvMasterUOM } from '@/types/inventory/masters/inv-master-uom';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const InvMasterUOMColumns: ColumnDef<IInvMasterUOM>[] = [
    {
        accessorKey: 'invmuoM_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='pl-6'>{continuousIndex}</div>;
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'invmuoM_UOMName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='UOM Name' />,
        cell: ({ row }) => <div>{row.getValue('invmuoM_UOMName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'invmuoM_UOMAliasName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Alias Name' />,
        cell: ({ row }) => <div>{row.getValue('invmuoM_UOMAliasName') || '-'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'invmuoM_Qty',
        header: ({ column }) => <DataTableColumnHeader column={column} title='UOM Quantity' />,
        cell: ({ row }) => <div>{row.getValue('invmuoM_Qty')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <UOMActionButtonsCell rowData={row.original} />
    }
];

function UOMActionButtonsCell({ rowData }: { rowData: IInvMasterUOM }) {
    const { openEditForm, openToggleForm } = useFormContext<IInvMasterUOM>();

    const handleEdit = useCallback(
        (data: IInvMasterUOM) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IInvMasterUOM) => {
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
            toggleConditionKey='invmuoM_ActiveFlg'
        />
    );
}
