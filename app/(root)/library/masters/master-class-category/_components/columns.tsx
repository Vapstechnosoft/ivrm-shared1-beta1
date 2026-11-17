'use client';

import { getStatusBadge } from '@/components/extras/helpers/helper';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterClassCategory } from '@/types/library/masters/class-category';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const MasterClassCategoryColumns: ColumnDef<IMasterClassCategory>[] = [
    {
        id: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div>{continuousIndex}</div>;
        },
        enableHiding: true,
        enableSorting: false
    },
    {
        accessorKey: 'lmcC_CategoryName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class Category Name' />,
        cell: ({ row }) => <div>{row.getValue('lmcC_CategoryName')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'hrmE_EmployeeFirstName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Staff Name' />,
        cell: ({ row }) => <div>{row.getValue('hrmE_EmployeeFirstName') ?? '-'}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmcC_ActiveFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => getStatusBadge(row.getValue('lmcC_ActiveFlag') === true ? 'yes' : 'no')
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterClassCategory }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterClassCategory>();

    const handleEdit = useCallback(
        (data: IMasterClassCategory) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterClassCategory) => {
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
            toggleConditionKey='lmcC_ActiveFlag'
        />
    );
}
