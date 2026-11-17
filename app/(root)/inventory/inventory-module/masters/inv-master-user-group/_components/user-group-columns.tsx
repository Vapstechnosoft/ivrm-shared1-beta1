'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IInvMasterUserGroup } from '@/types/inventory/masters/inv-master-group';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

// User Group Columns
export const InvMasterUserGroupColumns: ColumnDef<IInvMasterUserGroup>[] = [
    {
        accessorKey: 'invmG_Id',
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
        accessorKey: 'invmG_GroupName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='User Group Name' />,
        cell: ({ row }) => <div>{row.getValue('invmG_GroupName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'invmG_AliasName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Alias Name' />,
        cell: ({ row }) => <div>{row.getValue('invmG_AliasName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'invmG_GroupName_mn',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Main Group' />,
        cell: ({ row }) => <div>{row.getValue('invmG_GroupName_mn')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <UserGroupActionButtonsCell rowData={row.original} />
    }
];

function UserGroupActionButtonsCell({ rowData }: { rowData: IInvMasterUserGroup }) {
    const { openEditForm, openToggleForm } = useFormContext<IInvMasterUserGroup>();

    const handleEdit = useCallback(
        (data: IInvMasterUserGroup) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IInvMasterUserGroup) => {
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
            toggleConditionKey='invmG_ActiveFlg'
        />
    );
}
