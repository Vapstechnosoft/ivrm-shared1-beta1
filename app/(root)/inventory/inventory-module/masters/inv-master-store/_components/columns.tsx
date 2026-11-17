'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IInvMasterStore } from '@/types/inventory/masters/inv-master-store';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const invMasterStoreColumns: ColumnDef<IInvMasterStore>[] = [
    {
        accessorKey: 'sno',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL.No.' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false
    },
    {
        accessorKey: 'invmS_StoreName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Store Name' />,
        cell: ({ row }) => <div>{row.getValue('invmS_StoreName')}</div>
    },
    {
        accessorKey: 'invmS_StoreLocation',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Store Location' />,
        cell: ({ row }) => <div>{row.getValue('invmS_StoreLocation')}</div>
    },
    {
        accessorKey: 'invmS_ContactPerson',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Contact Person' />,
        cell: ({ row }) => <div>{row.getValue('invmS_ContactPerson') || '-'}</div>
    },
    {
        accessorKey: 'invmS_ContactNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Contact Number' />,
        cell: ({ row }) => <div>{row.getValue('invmS_ContactNo')}</div>
    },
    {
        accessorKey: 'invmS_ActiveFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => {
            const status = row.original.invmS_ActiveFlg;
            return <Badge variant={status ? 'default' : 'destructive'}>{status ? 'Active' : 'Inactive'}</Badge>;
        }
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row) => row,
        enableSorting: false,
        cell: ({ row }) => <InvMasterStoreActionButtons rowData={row.original} />
    }
];

function InvMasterStoreActionButtons({ rowData }: { rowData: IInvMasterStore }) {
    const { openEditForm, openToggleForm } = useFormContext<IInvMasterStore>();

    const handleEdit = useCallback(() => openEditForm(rowData), [openEditForm, rowData]);
    const handleToggle = useCallback(() => openToggleForm(rowData), [openToggleForm, rowData]);

    return (
        <div className='flex justify-center gap-2'>
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: true, delete: false, toggle: true }}
                onEdit={handleEdit}
                onToggle={handleToggle}
                toggleConditionKey='invmS_ActiveFlg'
            />
        </div>
    );
}
