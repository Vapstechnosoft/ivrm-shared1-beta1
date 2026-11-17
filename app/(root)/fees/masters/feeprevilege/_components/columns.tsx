'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IFeePrivilegeList } from '@/types/fees/masters/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const feePrivilegeColumns: ColumnDef<IFeePrivilegeList>[] = [
    {
        accessorKey: 'id',
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
        accessorKey: 'normalizedUserName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='User Name' />,
        cell: ({ row }) => <div>{row.getValue('normalizedUserName') || 'N.A'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmG_GroupName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Group Name' />,
        cell: ({ row }) => <div>{row.getValue('fmG_GroupName') || 'N.A'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmH_FeeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Fee Name' />,
        cell: ({ row }) => <div>{row.getValue('fmH_FeeName') || 'N.A'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'ivrmrT_Role',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Roles' />,
        cell: ({ row }) => <div>{row.getValue('ivrmrT_Role') || 'N.A'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-start' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
        enableSorting: false,
        enableHiding: false
    }
];

function ActionButtonsCell({ rowData }: { rowData: IFeePrivilegeList }) {
    const { openEditForm, openDeleteForm } = useFormContext<IFeePrivilegeList>();

    const handleEdit = useCallback(() => openEditForm(rowData), [openEditForm, rowData]);

    const handleDelete = useCallback((data: IFeePrivilegeList) => openDeleteForm(data), [openDeleteForm]);

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: false, delete: true }}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );
}
