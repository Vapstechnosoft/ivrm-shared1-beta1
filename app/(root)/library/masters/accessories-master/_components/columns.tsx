'use client';

import { getStatusBadge } from '@/components/extras/helpers/helper';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterAccessories } from '@/types/library/masters/accessories';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const MasterAccessoriesColumns: ColumnDef<IMasterAccessories>[] = [
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
        accessorKey: 'lmaC_AccessoriesName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Accessories Name' />,
        cell: ({ row }) => <div>{row.getValue('lmaC_AccessoriesName')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmaC_AccessoriesDesc',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Description' />,
        cell: ({ row }) => <div>{row.getValue('lmaC_AccessoriesDesc')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmaC_ActiveFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => getStatusBadge(row.getValue('lmaC_ActiveFlg') === true ? 'yes' : 'no')
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterAccessories }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterAccessories>();

    const handleEdit = useCallback(
        (data: IMasterAccessories) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterAccessories) => {
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
            toggleConditionKey='lmaC_ActiveFlg'
        />
    );
}
