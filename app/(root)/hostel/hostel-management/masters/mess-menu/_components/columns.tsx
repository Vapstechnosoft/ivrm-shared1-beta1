'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Check, X } from 'lucide-react';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { DataTableColumnHeader as ColumnHeader } from '@/components/ui/data-table-column-header';
import { useFormContext } from '@/components/ui/form/form-provider';
import { useCallback } from 'react';
import { IMessMenu } from '@/server/hostel/hostel-management/masters/menu';

export const messMenuColumns: ColumnDef<IMessMenu, any>[] = [
    {
        accessorKey: 'sn',
        header: ({ column }) => <ColumnHeader column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'hlmM_Name',
        header: ({ column }) => <ColumnHeader column={column} title='Mess Name' />,
    },
    {
        accessorKey: 'hlmmC_Name',
        header: ({ column }) => <ColumnHeader column={column} title='Mess Category' />,
    },
    {
        accessorKey: 'hlmmN_MenuName',
        header: ({ column }) => <ColumnHeader column={column} title='Menu Name' />,
    },
    {
        accessorKey: 'hlmmN_MenuDesc',
        header: ({ column }) => <ColumnHeader column={column} title='Description' />,
    },
    {
        accessorKey: 'hlmmN_ActiveFlag',
        header: ({ column }) => <ColumnHeader column={column} title='Status' />,
        cell: ({ row }) =>
            row.original.hlmmN_ActiveFlag ? (
                <span className='flex items-center text-green-600 font-medium'>
                    <Check className='mr-1 h-4 w-4' /> Active
                </span>
            ) : (
                <span className='flex items-center text-red-600 font-medium'>
                    <X className='mr-1 h-4 w-4' /> Inactive
                </span>
            )
    },
    {
        id: 'actions',
        header: ({ column }) => <ColumnHeader column={column} title='Actions' className='text-center' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMessMenu }) {
    const { openEditForm, openToggleForm } = useFormContext<IMessMenu>();

    const handleEdit = useCallback(
        (data: IMessMenu) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMessMenu) => {
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
            toggleConditionKey='hlmmN_ActiveFlag'
        />
    );
}
