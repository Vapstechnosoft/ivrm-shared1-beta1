'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IInvMasterSupplier } from '@/types/inventory/masters/inv-master-supplier';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const invMasterSupplierColumns: ColumnDef<IInvMasterSupplier>[] = [
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
        accessorKey: 'invmS_SupplierName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Supplier Name' />,
        cell: ({ row }) => <div>{row.getValue('invmS_SupplierName')}</div>
    },
    {
        accessorKey: 'invmS_SupplierCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Supplier Code' />,
        cell: ({ row }) => <div>{row.getValue('invmS_SupplierCode') || '-'}</div>
    },
    {
        accessorKey: 'invmS_SupplierConatctPerson',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Contact Person' />,
        cell: ({ row }) => <div>{row.getValue('invmS_SupplierConatctPerson') || '-'}</div>
    },
    {
        accessorKey: 'invmS_SupplierConatctNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Contact Number' />,
        cell: ({ row }) => <div>{row.getValue('invmS_SupplierConatctNo')}</div>
    },
    {
        accessorKey: 'invmS_EmailId',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Email-ID' />,
        cell: ({ row }) => <div className="lowercase">{row.getValue('invmS_EmailId')}</div>
    },
    {
        accessorKey: 'invmS_GSTNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='GST No.' />,
        cell: ({ row }) => <div>{row.getValue('invmS_GSTNo') || '-'}</div>
    },
    {
        accessorKey: 'invmS_SupplierAddress',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Supplier Address' />,
        cell: ({ row }) => (
            <div className="max-w-[200px] truncate" title={row.getValue('invmS_SupplierAddress')}>
                {row.getValue('invmS_SupplierAddress') || '-'}
            </div>
        )
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
        cell: ({ row }) => <InvMasterSupplierActionButtons rowData={row.original} />
    }
];

function InvMasterSupplierActionButtons({ rowData }: { rowData: IInvMasterSupplier }) {
    const { openEditForm, openToggleForm } = useFormContext<IInvMasterSupplier>();

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
