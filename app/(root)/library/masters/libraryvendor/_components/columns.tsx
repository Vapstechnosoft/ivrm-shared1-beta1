'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterVendorList } from '@/types/library/masters/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const masterVendorColumns: ColumnDef<IMasterVendorList>[] = [
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
        accessorKey: 'lmV_VendorName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Vendor Name' />,
        cell: ({ row }) => <div>{row.getValue('lmV_VendorName')}</div>
    },

    {
        accessorKey: 'lmV_EMailId',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
        cell: ({ row }) => <div>{row.getValue('lmV_EMailId')}</div>
    },

    {
        accessorKey: 'lmV_MobileNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Mobile No' />,
        cell: ({ row }) => <div>{row.getValue('lmV_MobileNo')}</div>
    },

    {
        accessorKey: 'lmV_Address',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Address' />,
        cell: ({ row }) => <div>{row.getValue('lmV_Address')}</div>
    },

    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-start' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
        enableSorting: false
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterVendorList }) {
    const { openToggleForm, openEditForm } = useFormContext<IMasterVendorList>();

    const handleToggle = useCallback(
        (data: IMasterVendorList) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    const handleEdit = useCallback((data: IMasterVendorList) => openEditForm(data), [openEditForm]);

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: true, delete: false }}
            onToggle={handleToggle}
            onEdit={handleEdit}
            toggleConditionKey='lmV_ActiveFlg'
        />
    );
}
