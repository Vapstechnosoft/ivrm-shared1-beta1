'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';

import type { IFeeHeadsList } from '@/types/fees/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const feeheadColumns: ColumnDef<IFeeHeadsList>[] = [
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
        accessorKey: 'fmH_Id',
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
        accessorKey: 'fmH_FeeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Fee Head Name' />,
        cell: ({ row }) => <div>{row.getValue('fmH_FeeName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmH_Order',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Fee Order	' />,
        cell: ({ row }) => <div>{row.getValue('fmH_Order')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmH_SpecialFeeFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Special Fee Head	' />,

        cell: ({ row }) => {
            const value = row.getValue('fmH_SpecialFeeFlag');
            return <div>{value ? '✅' : '❌'}</div>;
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmH_PDAFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='PDA Expense' />,

        cell: ({ row }) => {
            const value = row.getValue('fmH_PDAFlag');
            return <div>{value ? '✅' : '❌'}</div>;
        },
        enableSorting: true,
        enableHiding: true
    },

    {
        accessorKey: 'fmH_RefundFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Refundable' />,
        cell: ({ row }) => {
            const value = row.getValue('fmH_RefundFlag');
            return <div>{value ? '✅' : '❌'}</div>;
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmH_Flag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Fee Head Type' />,
        cell: ({ row }) => <div>{row.getValue('fmH_Flag')}</div>,
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

function ActionButtonsCell({ rowData }: { rowData: IFeeHeadsList }) {
    const { openEditForm, openToggleForm } = useFormContext<IFeeHeadsList>();

    const handleEdit = useCallback(
        (data: IFeeHeadsList) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IFeeHeadsList) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: true, delete: false }}
            onEdit={handleEdit}
            onToggle={handleToggle}
            toggleConditionKey='fmH_ActiveFlag'
        />
    );
}
