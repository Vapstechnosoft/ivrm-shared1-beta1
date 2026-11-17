'use client';
import { getStatusBadge } from '@/components/extras/helpers/helper';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterLocation } from '@/types/transport/transport-module/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const masterLocationColumns: ColumnDef<IMasterLocation>[] = [
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
        accessorKey: 'trmL_LocationName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Location/Boarding Point Name' />,
        cell: ({ row }) => <div>{row.original.trmL_LocationName}</div>
    },
    {
        accessorKey: 'trmL_Longitude',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Longitude' />,
        cell: ({ row }) => <div>{row.original.trmL_Longitude}</div>
    },
    {
        accessorKey: 'trmL_Latitude',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Latitude' />,
        cell: ({ row }) => <div>{row.original.trmL_Latitude}</div>
    },
    {
        accessorKey: 'trmL_ActiveFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => getStatusBadge(row.original.trmL_ActiveFlg ? 'active' : 'inactive')
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Action' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterLocation }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterLocation>();

    const handleEdit = useCallback(
        (data: IMasterLocation) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterLocation) => {
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
            toggleConditionKey='trmL_ActiveFlg'
        />
    );
}
