'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IInvTGRN } from '@/types/inventory/transactions/inv-t-grn';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useCallback } from 'react';
import { useInvTGRN } from '@/hooks/inventory/transactions/use-inv-t-grn';

export const invTGRNColumns: ColumnDef<IInvTGRN>[] = [
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
        accessorKey: 'invmS_SupplierName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Supplier Name' />,
        cell: ({ row }) => <div>{row.getValue('invmS_SupplierName')}</div>
    },
    {
        accessorKey: 'invmgrN_GRNNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='GRN No.' />,
        cell: ({ row }) => <div>{row.getValue('invmgrN_GRNNo')}</div>
    },
    {
        accessorKey: 'invmgrN_InvoiceNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Invoice No.' />,
        cell: ({ row }) => <div>{row.getValue('invmgrN_InvoiceNo')}</div>
    },
    {
        accessorKey: 'invmgrN_PurchaseDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Purchase Date' />,
        cell: ({ row }) => {
            const date = row.original.invmgrN_PurchaseDate;
            return <div>{date ? format(new Date(date), 'dd/MM/yyyy') : '-'}</div>;
        }
    },
    {
        accessorKey: 'invmgrN_TotalAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Amount' className='text-right' />,
        cell: ({ row }) => <div className='text-right'>{Number(row.getValue('invmgrN_TotalAmount')).toFixed(2)}</div>
    },
    {
        accessorKey: 'invtgrN_ActiveFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => {
            const status = row.original.invtgrN_ActiveFlg;
            return (
                <Badge className={status ? 'bg-purple-600 hover:bg-purple-700' : 'bg-red-600 hover:bg-red-700'}>
                    {status ? 'Active' : 'Inactive'}
                </Badge>
            );
        }
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row) => row,
        enableSorting: false,
        cell: ({ row }) => <InvTGRNActionButtons rowData={row.original} />
    }
];

function InvTGRNActionButtons({ rowData }: { rowData: IInvTGRN }) {
    const { openEditForm, openDetailsView, openToggleForm } = useFormContext<IInvTGRN>();
    const { deleteMutation, toggleActiveMutation } = useInvTGRN();

    const handleEdit = useCallback(() => openEditForm(rowData), [openEditForm, rowData]);
    const handleView = useCallback(() => openDetailsView(rowData), [openDetailsView, rowData]);

    const handleToggle = useCallback(() => {
        openToggleForm(rowData);
    }, [openToggleForm, rowData]);

    return (
        <div className='flex justify-center gap-2'>
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: true, delete: false, toggle: true, view: true }}
                onEdit={handleEdit}
                onToggle={handleToggle}
                // onView={handleView}
                toggleConditionKey='invtgrN_ActiveFlg'
            />
        </div>
    );
}
