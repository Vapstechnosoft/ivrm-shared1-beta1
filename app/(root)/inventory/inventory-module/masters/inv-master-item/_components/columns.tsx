'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IInvMasterItem } from '@/types/inventory/masters/inv-master-item';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const invMasterItemColumns: ColumnDef<IInvMasterItem>[] = [
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
        accessorKey: 'invmG_GroupName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Group Name' />,
        cell: ({ row }) => <div>{row.getValue('invmG_GroupName') || '-'}</div>
    },
    {
        accessorKey: 'invmuoM_UOMName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='UOM' />,
        cell: ({ row }) => <div>{row.getValue('invmuoM_UOMName') || '-'}</div>
    },
    {
        accessorKey: 'invmI_ItemName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Item Name' />,
        cell: ({ row }) => <div>{row.getValue('invmI_ItemName')}</div>
    },
    {
        accessorKey: 'invmI_ItemCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Item Code' />,
        cell: ({ row }) => <div>{row.getValue('invmI_ItemCode') || '-'}</div>
    },
    {
        accessorKey: 'invmI_ReorderStock',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Re-Order Stock' />,
        cell: ({ row }) => <div>{row.getValue('invmI_ReorderStock') ?? 0}</div>
    },
    {
        accessorKey: 'invmI_HSNCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='HSN Code' />,
        cell: ({ row }) => <div>{row.getValue('invmI_HSNCode') || '-'}</div>
    },
    {
        accessorKey: 'invmI_ActiveFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => {
            const status = row.original.invmI_ActiveFlg;
            return <Badge variant={status ? 'default' : 'destructive'}>{status ? 'Active' : 'Inactive'}</Badge>;
        }
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row) => row,
        enableSorting: false,
        cell: ({ row }) => <InvMasterItemActionButtons rowData={row.original} />
    }
];

function InvMasterItemActionButtons({ rowData }: { rowData: IInvMasterItem }) {
    const { openEditForm, openToggleForm } = useFormContext<IInvMasterItem>();

    const handleEdit = useCallback(() => openEditForm(rowData), [openEditForm, rowData]);
    const handleToggle = useCallback(() => openToggleForm(rowData), [openToggleForm, rowData]);

    return (
        <div className='flex justify-center gap-2 text-center'>
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: true, delete: false, toggle: true }}
                onEdit={handleEdit}
                onToggle={handleToggle}
                toggleConditionKey='invmI_ActiveFlg'
            />
            {rowData.invmI_TaxAplFlg && (
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => (window as any).openTaxModal?.(rowData)}>
                    Tax
                </Badge>
            )}
        </div>
    );
}
