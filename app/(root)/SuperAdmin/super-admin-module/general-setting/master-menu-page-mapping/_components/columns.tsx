'use client';

import { ActionButtons } from '@/components/ui/form/action-buttons';
import { DataTableColumnHeader as ColumnHeader } from '@/components/ui/data-table-column-header';
import { ColumnDef } from '@tanstack/react-table';
import { IMasterMenuPageMappingDTO } from '@/types/super-admin/super-admin-module/general-setting/master-menu-page-mapping';
import { useFormContext } from '@/components/ui/form/form-provider';
import { useCallback } from 'react';

export const columns: ColumnDef<IMasterMenuPageMappingDTO>[] = [
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
        accessorKey: 'submenuname',
        header: ({ column }) => <ColumnHeader column={column} title='Sub Menu Name' />,
    },
    {
        accessorKey: 'modulename',
        header: ({ column }) => <ColumnHeader column={column} title='Module Name' />,
    },
    {
        accessorKey: 'pagename',
        header: ({ column }) => <ColumnHeader column={column} title='Page Name' />,
    },
    {
        id: 'actions',
        header: ({ column }) => <ColumnHeader column={column} title='Delete' className='text-center' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
        enableSorting: false,
    },
];

function ActionButtonsCell({ rowData }: { rowData: IMasterMenuPageMappingDTO }) {
    // We need to verify if useFormContext is available. It is wrapped in page.tsx.
    const { openDeleteForm } = useFormContext<IMasterMenuPageMappingDTO>();

    const handleDelete = useCallback(
        (data: IMasterMenuPageMappingDTO) => {
            openDeleteForm(data);
        },
        [openDeleteForm]
    );

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: false, delete: true, toggle: false }}
            onDelete={handleDelete}
        />
    );
}
