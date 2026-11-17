'use client';

import { DataTableColumnHeader as ColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterMainMenu } from '@/types/super-admin/super-admin-module/general-setting/master-main-menu';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const columns: ColumnDef<IMasterMainMenu>[] = [
    {
        id: 'serialNumber',
        header: ({ column }) => <ColumnHeader column={column} title='SL.NO' />,
        cell: ({ row }) => <div className='text-center'>{row.index + 1}</div>,
        enableSorting: false,
    },
    {
        accessorKey: 'modulename',
        header: ({ column }) => <ColumnHeader column={column} title='Module Name' />,
    },
    {
        accessorKey: 'ivrmmM_MenuName',
        header: ({ column }) => <ColumnHeader column={column} title='Main Menu Name' />,
    },
    {
        id: 'actions',
        header: ({ column }) => <ColumnHeader column={column} title='Edit/Delete' className='text-center' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
        enableSorting: false,
    },
];

function ActionButtonsCell({ rowData }: { rowData: IMasterMainMenu }) {
    const { openEditForm, openDeleteForm } = useFormContext<IMasterMainMenu>();

    const handleEdit = useCallback(
        (data: IMasterMainMenu) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleDelete = useCallback(
        (data: IMasterMainMenu) => {
            openDeleteForm(data);
        },
        [openDeleteForm]
    );

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, delete: true, toggle: false }}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );
}
