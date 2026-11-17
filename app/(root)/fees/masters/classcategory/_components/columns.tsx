'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterCasteCategoryList } from '@/types/fees/masters/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const masterCasteCategoryColumns: ColumnDef<IMasterCasteCategoryList>[] = [
    {
        accessorKey: 'fmcC_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} className='w-full pl-6' title='Sl. No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='w-full pl-6'>{continuousIndex}</div>;
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'fmcC_ClassCategoryName',
        header: ({ column }) => <DataTableColumnHeader column={column} title=' Category Name' />,
        cell: ({ row }) => <div>{row.getValue('fmcC_ClassCategoryName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmcC_ClassCategoryCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Category Code' />,
        cell: ({ row }) => <div>{row.getValue('fmcC_ClassCategoryCode')}</div>,
        enableSorting: true,
        enableHiding: true
    },

    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-start' />,
        accessorFn: (row) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterCasteCategoryList }) {
    const { openEditForm, openToggleForm, openDeleteForm } = useFormContext<IMasterCasteCategoryList>();

    const handleEdit = useCallback(
        (data: IMasterCasteCategoryList) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterCasteCategoryList) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    const handleDelete = useCallback(
        (data: IMasterCasteCategoryList) => {
            openDeleteForm(data);
        },
        [openDeleteForm]
    );

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: true, delete: true }}
            onEdit={handleEdit}
            onToggle={handleToggle}
            onDelete={handleDelete}
            toggleConditionKey='fmcC_ActiveFlag'
        />
    );
}
