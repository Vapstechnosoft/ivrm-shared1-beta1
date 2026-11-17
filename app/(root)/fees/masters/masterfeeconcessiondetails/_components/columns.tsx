'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterConcessionDetailsList } from '@/types/fees/masters';

import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const feeMasterConcessionDetailsColumns: ColumnDef<IMasterConcessionDetailsList>[] = [
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
        accessorKey: 'FMCCD_Id',
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
        accessorKey: 'fmcC_ConcessionName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Category Name' />,
        cell: ({ row }) => <div>{row.getValue('fmcC_ConcessionName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmccD_FromNoSibblings',
        header: ({ column }) => <DataTableColumnHeader column={column} title='From no of Sibling' />,
        cell: ({ row }) => <div>{row.getValue('fmccD_FromNoSibblings')}</div>,
        enableSorting: true,
        enableHiding: true
    },

    {
        accessorKey: 'fmccD_ToNoSibblings',
        header: ({ column }) => <DataTableColumnHeader column={column} title='To no of Sibling' />,
        cell: ({ row }) => <div>{row.getValue('fmccD_ToNoSibblings')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmccD_PerOrAmtFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Type' />,
        cell: ({ row }) => <div>{row.getValue('fmccD_PerOrAmtFlag')}</div>,
        enableSorting: true,
        enableHiding: true
    },

    {
        accessorKey: 'fmccD_PerOrAmt',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Percent or Amount' />,
        cell: ({ row }) => <div>{row.getValue('fmccD_PerOrAmt')}</div>,
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

function ActionButtonsCell({ rowData }: { rowData: IMasterConcessionDetailsList }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterConcessionDetailsList>();

    const handleEdit = useCallback(
        (data: IMasterConcessionDetailsList) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterConcessionDetailsList) => {
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
            toggleConditionKey='fmccD_ActiveFlg'
        />
    );
}
