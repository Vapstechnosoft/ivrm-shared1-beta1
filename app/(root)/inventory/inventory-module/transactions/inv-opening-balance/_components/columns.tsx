'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IInvOpeningBalance } from '@/types/inventory/transactions/inv-opening-balance';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useCallback } from 'react';

export const invOpeningBalanceColumns: ColumnDef<IInvOpeningBalance>[] = [
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
        header: ({ column }) => <DataTableColumnHeader column={column} title='Store' />,
        cell: ({ row }) => <div>{row.getValue('invmS_StoreName')}</div>
    },
    {
        accessorKey: 'invmI_ItemName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Item' />,
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.getValue('invmI_ItemName')}</span>
                <span className="text-[10px] text-muted-foreground">{row.original.invmuoM_UOMName}</span>
            </div>
        )
    },
    {
        accessorKey: 'invoB_BatchNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Batch No' />,
        cell: ({ row }) => <div>{row.getValue('invoB_BatchNo') || 'N/A'}</div>
    },
    {
        accessorKey: 'invoB_Qty',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Quantity' className='justify-end' />,
        cell: ({ row }) => (
            <div className='text-right'>
                {Number(row.getValue('invoB_Qty')).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
        )
    },
    {
        accessorKey: 'invoB_PurchaseDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Purchase Date' />,
        cell: ({ row }) => {
            const date = row.original.invoB_PurchaseDate;
            return <div>{date ? format(new Date(date), 'dd-MM-yyyy') : '-'}</div>;
        }
    },
    {
        accessorKey: 'invoB_PurchaseRate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Rate' className='justify-end' />,
        cell: ({ row }) => (
            <div className='text-right'>
                {Number(row.getValue('invoB_PurchaseRate')).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
        )
    },
    {
        accessorKey: 'invoB_TAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total' className='justify-end' />,
        cell: ({ row }) => (
            <div className='text-right font-medium'>
                {Number(row.getValue('invoB_TAmount')).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
        )
    },
    {
        accessorKey: 'invoB_ActiveFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => {
            const status = row.original.invoB_ActiveFlg;
            return <Badge variant={status ? 'default' : 'destructive'}>{status ? 'Active' : 'Inactive'}</Badge>;
        }
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='justify-center' />,
        accessorFn: (row) => row,
        cell: ({ row }) => <InvOpeningBalanceActionButtons rowData={row.original} />
    }
];

function InvOpeningBalanceActionButtons({ rowData }: { rowData: IInvOpeningBalance }) {
    const { openEditForm, openToggleForm } = useFormContext<IInvOpeningBalance>();

    const handleEdit = useCallback(() => openEditForm(rowData), [openEditForm, rowData]);
    const handleToggle = useCallback(() => openToggleForm(rowData), [openToggleForm, rowData]);

    return (
        <div className='flex justify-center'>
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: true, delete: false, toggle: true }}
                onEdit={handleEdit}
                onToggle={handleToggle}
                toggleConditionKey='invoB_ActiveFlg'
            />
        </div>
    );
}

