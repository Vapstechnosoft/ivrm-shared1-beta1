'use client';

import { DataTableColumnHeader as ColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterSubMenu } from '@/types/super-admin/super-admin-module/general-setting/master-sub-menu';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const columns: ColumnDef<IMasterSubMenu>[] = [
    {
        id: 'serialNumber',
        header: ({ column }) => <ColumnHeader column={column} title='SL.NO' />,
        cell: ({ row, table }) => {
            const { pageIndex, pageSize } = table.getState().pagination;
            return <div className='text-center'>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
    },
    {
        accessorKey: 'modulename',
        header: ({ column }) => <ColumnHeader column={column} title='Module Name' />,
    },
    {
        accessorKey: 'mainMenuName', // Or ivrmmM_MenuName? Legacy grid says ivrmmM_MenuName but type usually maps to something else. I added mainMenuName to interface.
        header: ({ column }) => <ColumnHeader column={column} title='Main Menu Name' />,
    },
    {
        accessorKey: 'ivrmmS_SubMenuName', // Legacy: subMenuName. Adjust if API differs.
        header: ({ column }) => <ColumnHeader column={column} title='Sub Menu Name' />,
    },
    {
        accessorKey: 'ivrmmS_Order', // Legacy: ivrmmM_MenuOrder. Adjust if API differs.
        header: ({ column }) => <ColumnHeader column={column} title='Sub Menu Order' />,
    },
    {
        id: 'actions',
        header: ({ column }) => <ColumnHeader column={column} title='Edit/Delete' className='text-center' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
        enableSorting: false,
    },
];

function ActionButtonsCell({ rowData }: { rowData: IMasterSubMenu }) {
    const { openEditForm, openDeleteForm } = useFormContext<IMasterSubMenu>();

    const handleEdit = useCallback(
        (data: IMasterSubMenu) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleDelete = useCallback(
        (data: IMasterSubMenu) => {
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
