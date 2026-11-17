'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterPublisherList } from '@/types/library/masters/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const masterPublisherColumns: ColumnDef<IMasterPublisherList>[] = [
    {
        accessorKey: 'lmaL_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl. No' className='w-full pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;

            return <div className='w-full pl-6'>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'lmP_PublisherName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Publisher Name' />,
        cell: ({ row }) => <div>{row.getValue('lmP_PublisherName')}</div>
    },
    {
        accessorKey: 'lmP_EMailId',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
        cell: ({ row }) => <div>{row.getValue('lmP_EMailId')}</div>
    },
    {
        accessorKey: 'lmP_MobileNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Mobile No' />,
        cell: ({ row }) => <div>{row.getValue('lmP_MobileNo')}</div>
    },
    {
        accessorKey: 'lmP_Address',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Address' />,
        cell: ({ row }) => <div>{row.getValue('lmP_Address')}</div>
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-start' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
        enableSorting: false
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterPublisherList }) {
    const { openToggleForm, openEditForm } = useFormContext<IMasterPublisherList>();

    const handleToggle = useCallback(
        (data: IMasterPublisherList) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    const handleEdit = useCallback((data: IMasterPublisherList) => openEditForm(data), [openEditForm]);
    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: true, delete: false }}
            onToggle={handleToggle}
            onEdit={handleEdit}
            toggleConditionKey='lmP_ActiveFlg'
        />
    );
}
