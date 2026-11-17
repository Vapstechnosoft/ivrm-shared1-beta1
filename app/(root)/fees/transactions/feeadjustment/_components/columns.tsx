'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';

import type { IFeeAdjustmentGridList } from '@/types/fees/transactions/transactions';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const feeAdjustmentColumns: ColumnDef<IFeeAdjustmentGridList>[] = [
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
        accessorKey: 'fsA_Id',
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
        accessorKey: 'fromHead',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Adjusted from Head Name' />,
        cell: ({ row }) => <div>{row.getValue('fromHead')}</div>,
        enableSorting: true,
        enableHiding: true
    },

    {
        accessorKey: 'fromInstallment',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Adjusted from Installment' />,
        cell: ({ row }) => <div>{row.getValue('fromInstallment')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'toHead',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Adjusted to Head Name' />,
        cell: ({ row }) => <div>{row.getValue('toHead')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'toInstallment',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Adjusted to Installment' />,
        cell: ({ row }) => <div>{row.getValue('toInstallment')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fsA_AdjustedAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Adjusted Amount' />,
        cell: ({ row }) => <div>{row.getValue('fsA_AdjustedAmount')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fsA_Date',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Date' />,
        //cell: ({ row }) => <div>{row.getValue('fsA_Date')}</div>,

        cell: ({ row }) => {
            const value = row.getValue('fsA_Date') as string | null;
            const formattedDate = value
                ? (() => {
                      const [year, month, day] = value.split('T')[0].split('-');
                      return `${day}-${month}-${year}`; // DD-MM-YYYY
                  })()
                : '';
            return <div>{formattedDate}</div>;
        },
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

function ActionButtonsCell({ rowData }: { rowData: IFeeAdjustmentGridList }) {
    const { openEditForm, openDeleteForm } = useFormContext<IFeeAdjustmentGridList>();

    const handleEdit = useCallback((data: IFeeAdjustmentGridList) => openEditForm(data), [openEditForm]);

    const handleDelete = useCallback((data: IFeeAdjustmentGridList) => openDeleteForm(data), [openDeleteForm]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: false, toggle: false, delete: true }}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}
