'use client';

import { getStatusBadge } from '@/components/extras/helpers/helper';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterDepartment } from '@/types/library/masters/department';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const MasterDepartmentColumns: ColumnDef<IMasterDepartment>[] = [
    {
        accessorKey: 'slNo',
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
        accessorKey: 'lmD_DepartmentName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Department Name' />,
        cell: ({ row }) => <div>{row.getValue('lmD_DepartmentName')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmD_DepartmentCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Department Code' />,
        cell: ({ row }) => <div>{row.getValue('lmD_DepartmentCode')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmD_ActiveFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => getStatusBadge(row.getValue('lmD_ActiveFlg') === true ? 'yes' : 'no')
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterDepartment }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterDepartment>();

    const handleEdit = useCallback(
        (data: IMasterDepartment) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterDepartment) => {
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
            toggleConditionKey='lmD_ActiveFlg'
        />
    );
}
