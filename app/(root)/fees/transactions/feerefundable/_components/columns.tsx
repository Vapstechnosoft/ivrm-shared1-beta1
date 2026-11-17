'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';

import type { IFeeRefundableList } from '@/types/fees/transactions/transactions';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useCallback } from 'react';

export const feeRefundableColumns: ColumnDef<IFeeRefundableList>[] = [
    // {
    //     id: 'select',
    //     header: ({ table }) => (
    //         <Checkbox
    //             checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
    //             onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //             aria-label='Select all'
    //         />
    //     ),
    //     cell: ({ row }) => (
    //         <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' />
    //     ),
    //     enableSorting: false,
    //     enableHiding: false,
    //     size: 24
    // },
    {
        accessorKey: 'fR_ID',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='pl-6'>{continuousIndex}</div>;
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'studentName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Student Name' />,
        cell: ({ row }) => <div>{row.getValue('studentName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'admisionNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Admision No' />,
        cell: ({ row }) => <div>{row.getValue('admisionNo')}</div>,
        enableSorting: true,
        enableHiding: true
    },

    {
        accessorKey: 'voucherNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Voucher No' />,
        cell: ({ row }) => <div>{row.getValue('voucherNo')}</div>,
        enableSorting: true,
        enableHiding: true
    },

    {
        accessorKey: 'refundedAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Refunded Amount' />,
        cell: ({ row }) => <div>{row.getValue('refundedAmount')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'modeOfPayment',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Mode of Payment' />,
        cell: ({ row }) => <div>{row.getValue('modeOfPayment')}</div>,
        enableSorting: true,
        enableHiding: true
    },

    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IFeeRefundableList }) {
    const { openEditForm, openDeleteForm, openDetailsView } = useFormContext<IFeeRefundableList>();

    const handleEdit = useCallback((data: IFeeRefundableList) => openEditForm(data), [openEditForm]);

    //const handleDelete = useCallback((data: IFeeRefundableList) => openDeleteForm(data), [openDeleteForm]);

    const handleDelete = useCallback(
        (data: IFeeRefundableList) => {
            openDeleteForm(data);
        },
        [openDeleteForm]
    );
    const handleView = useCallback(() => {
        openDetailsView(rowData);
    }, [openDetailsView, rowData]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            {/* 👁️ Eye icon for viewing grade details */}
            <button type='button' onClick={handleView} className='rounded-md p-2 transition hover:bg-muted' title='View Grade Details'>
                <Eye className='h-4 w-4 text-blue-600' />
            </button>
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: false, toggle: false, delete: true }}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}
