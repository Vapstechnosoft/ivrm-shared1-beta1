'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IInvMasterMainGroup } from '@/types/inventory/masters/inv-master-group';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

// Main Group Columns
export const InvMasterMainGroupColumns: ColumnDef<IInvMasterMainGroup>[] = [
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
        header: ({ column }) => <DataTableColumnHeader column={column} title='Group Name' />,
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
        accessorKey: 'invmG_GroupPrefix',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Prefix' />,
        cell: ({ row }) => <div>{row.getValue('invmG_GroupPrefix')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'invmG_GroupSuffix',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Suffix' />,
        cell: ({ row }) => <div>{row.getValue('invmG_GroupSuffix')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'invmG_Level',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Level' />,
        cell: ({ row }) => <div>{row.getValue('invmG_Level')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'invmG_GroupStartingNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Starting No' />,
        cell: ({ row }) => <div>{row.getValue('invmG_GroupStartingNo')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <MainGroupActionButtonsCell rowData={row.original} />
    }
];

function MainGroupActionButtonsCell({ rowData }: { rowData: IInvMasterMainGroup }) {
    const { openEditForm, openToggleForm } = useFormContext<IInvMasterMainGroup>();

    const handleEdit = useCallback(
        (data: IInvMasterMainGroup) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IInvMasterMainGroup) => {
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
