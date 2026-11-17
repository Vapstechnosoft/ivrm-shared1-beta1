'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import { Button } from '@/components/ui/button';
import { Eye, PackageOpen } from 'lucide-react';
import { useInvTSales } from '@/hooks/inventory/transactions/use-inv-t-sales';
import type { IInvTSales } from '@/types/inventory/transactions/inv-t-sales';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useCallback } from 'react';

export const getInvTSalesColumns = (onViewItem: (row: IInvTSales) => void): ColumnDef<IInvTSales>[] => [
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
        accessorKey: 'invmsL_SalesNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sale No.' />,
        cell: ({ row }) => <div>{row.getValue('invmsL_SalesNo')}</div>
    },
    {
        accessorKey: 'invmsL_StuOtherFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Type' />,
        cell: ({ row }) => <div>{row.getValue('invmsL_StuOtherFlg')}</div>
    },
    {
        accessorKey: 'invmsL_SalesDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sale Date' />,
        cell: ({ row }) => {
            const date = row.original.invmsL_SalesDate;
            return <div>{date ? format(new Date(date), 'dd/MM/yyyy') : '-'}</div>;
        }
    },
    {
        accessorKey: 'invmsL_SalesValue',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sale Value' className='text-right' />,
        cell: ({ row }) => <div className='text-right'>{Number(row.getValue('invmsL_SalesValue')).toFixed(2)}</div>
    },
    {
        accessorKey: 'invmsL_TotDiscount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Discount' className='text-right' />,
        cell: ({ row }) => <div className='text-right'>{Number(row.getValue('invmsL_TotDiscount')).toFixed(2)}</div>
    },
    {
        accessorKey: 'invmsL_TotTaxAmt',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Tax' className='text-right' />,
        cell: ({ row }) => <div className='text-right'>{Number(row.getValue('invmsL_TotTaxAmt')).toFixed(2)}</div>
    },
    {
        accessorKey: 'invmsL_TotalAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Amount' className='text-right' />,
        cell: ({ row }) => <div className='text-right'>{Number(row.getValue('invmsL_TotalAmount')).toFixed(2)}</div>
    },
    {
        accessorKey: 'invmsL_ActiveFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => {
            const status = row.original.invmsL_ActiveFlg;
            return <Badge variant={status ? 'default' : 'destructive'}>{status ? 'Active' : 'Inactive'}</Badge>;
        }
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row) => row,
        enableSorting: false,
        cell: ({ row }) => <InvTSalesActionButtons rowData={row.original} onViewItem={onViewItem} />
    }
];

function InvTSalesActionButtons({ rowData, onViewItem }: { rowData: IInvTSales, onViewItem: (row: IInvTSales) => void }) {
    const { openEditForm, openDetailsView, openToggleForm } = useFormContext<IInvTSales>();

    const handleEdit = useCallback(() => openEditForm(rowData), [openEditForm, rowData]);
    const handleView = useCallback(() => openDetailsView(rowData), [openDetailsView, rowData]);
    const handleViewItem = useCallback(() => {
        onViewItem(rowData);
    }, [onViewItem, rowData]);

    const handleToggle = useCallback(() => {
        openToggleForm(rowData);
    }, [openToggleForm, rowData]);

    return (
        <div className='flex justify-center gap-2'>
            {/* View Details */}
            <Button
                variant='ghost'
                size='icon'
                onClick={handleView}
                title='View Receipt'
                className='h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50'
            >
                <Eye className='h-4 w-4' />
            </Button>

            {/* View Item Details */}
            <Button
                variant='ghost'
                size='icon'
                onClick={handleViewItem}
                title='View Items'
                className='h-8 w-8 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-50'
            >
                <PackageOpen className='h-4 w-4' />
            </Button>

            <ActionButtons
                rowData={rowData}
                buttons={{ edit: true, delete: false, toggle: true, view: false }}
                onEdit={handleEdit}

                onToggle={handleToggle}
                toggleConditionKey='invmsL_ActiveFlg'
            />
        </div>
    );
}
