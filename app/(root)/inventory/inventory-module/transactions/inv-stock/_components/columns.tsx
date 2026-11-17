
'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { InvStock } from '@/types/inventory/transactions/inv-stock';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useCallback } from 'react';

export const invStockColumns: ColumnDef<InvStock>[] = [
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
        cell: ({ row }) => <div>{row.getValue('invmI_ItemName')}</div>
    },
    {
        accessorKey: 'invstO_BatchNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Batch No.' />,
        cell: ({ row }) => <div>{row.getValue('invstO_BatchNo')}</div>
    },
    {
        accessorKey: 'invstO_PurchaseDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Purchase Date' />,
        cell: ({ row }) => {
            const date = row.getValue('invstO_PurchaseDate') as string;
            return <div>{date ? format(new Date(date), 'dd/MM/yyyy') : '-'}</div>;
        }
    },
    {
        accessorKey: 'invstO_PurchaseRate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Purchase Rate' />,
        cell: ({ row }) => <div className="text-right">{row.getValue('invstO_PurchaseRate')}</div>
    },
    {
        accessorKey: 'invstO_SalesRate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sales Rate' />,
        cell: ({ row }) => <div className="text-right">{row.getValue('invstO_SalesRate')}</div>
    },
    {
        accessorKey: 'invstO_AvaiableStock',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Available Stock' />,
        cell: ({ row }) => <div className="text-right font-bold text-primary">{row.getValue('invstO_AvaiableStock')}</div>
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsClient rowData={row.original} />
    }
];

function ActionButtonsClient({ rowData }: { rowData: InvStock }) {
    const { openEditForm } = useFormContext<InvStock>();

    const handleEdit = useCallback(() => openEditForm(rowData), [openEditForm, rowData]);

    return (
        <div className='flex justify-center gap-2'>
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: true, delete: false, toggle: false }}
                onEdit={handleEdit}
            />
        </div>
    );
}
