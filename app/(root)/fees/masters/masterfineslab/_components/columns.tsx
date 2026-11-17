'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IFineSlabList } from '@/types/fees/masters/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const feefineslabColumns: ColumnDef<IFineSlabList>[] = [
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
        accessorKey: 'fmfS_Id',
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
        accessorKey: 'fmfS_FineType',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Type' />,
        cell: ({ row }) => <div>{row.getValue('fmfS_FineType')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmfS_FromDay',
        header: ({ column }) => <DataTableColumnHeader column={column} title='From day' />,
        cell: ({ row }) => <div>{row.getValue('fmfS_FromDay')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmfS_ToDay',
        header: ({ column }) => <DataTableColumnHeader column={column} title='To day' />,
        cell: ({ row }) => <div>{row.getValue('fmfS_ToDay')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmfS_ECSFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='ECS Flag' />,
        cell: ({ row }) => <div>{row.getValue('fmfS_ECSFlag')}</div>,
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

function ActionButtonsCell({ rowData }: { rowData: IFineSlabList }) {
    const { openEditForm, openToggleForm } = useFormContext<IFineSlabList>();

    const handleEdit = useCallback(
        (data: IFineSlabList) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IFineSlabList) => {
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
            toggleConditionKey='fmfS_ActiveFlag'
        />
    );
}
