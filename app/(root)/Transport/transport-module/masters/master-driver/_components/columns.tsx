'use client';
import { getStatusBadge } from '@/components/extras/helpers/helper';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterDriver } from '@/types/transport/transport-module/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useCallback } from 'react';

export const masterDriverColumns: ColumnDef<IMasterDriver>[] = [
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL.No.' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div>{continuousIndex}</div>;
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'trmD_DriverName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Driver Name' />,
        cell: ({ row }) => <div>{row.getValue('trmD_DriverName')}</div>
    },
    {
        accessorKey: 'trmD_DriverCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Driver Code' />,
        cell: ({ row }) => <div>{row.getValue('trmD_DriverCode')}</div>
    },
    {
        accessorKey: 'trmD_DLNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='DL No' />,
        cell: ({ row }) => <div>{row.getValue('trmD_DLNo')}</div>
    },
    {
        accessorKey: 'trmD_DLExpiryDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='DL Expiry Date' />,
        cell: ({ row }) => {
            const date = row.getValue('trmD_DLExpiryDate') as string;
            return <div>{date ? format(new Date(date), 'dd/MM/yyyy') : '-'}</div>;
        }
    },
    {
        accessorKey: 'trmD_ActiveFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => getStatusBadge(row.getValue('trmD_ActiveFlg') ? 'active' : 'inactive')
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Action' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterDriver }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterDriver>();

    const handleEdit = useCallback(
        (data: IMasterDriver) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterDriver) => {
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
            toggleConditionKey='trmD_ActiveFlg'
        />
    );
}
