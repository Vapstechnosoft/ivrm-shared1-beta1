'use client';

import { getStatusBadge } from '@/components/extras/helpers/helper';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IVehicleRouteMapping } from '@/types/transport/transport-module/transaction';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const vehicleRouteMappingColumns: ColumnDef<IVehicleRouteMapping>[] = [
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
        accessorKey: 'trmV_VehicleName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Vehicle Name' />,
        cell: ({ row }) => <div>{row.getValue('trmV_VehicleName')}</div>
    },
    {
        accessorKey: 'trmV_VehicleNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Vehicle No.' />,
        cell: ({ row }) => <div>{row.getValue('trmV_VehicleNo')}</div>
    },
    {
        accessorKey: 'trmR_RouteName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Route Name' />,
        cell: ({ row }) => <div>{row.getValue('trmR_RouteName')}</div>
    },
    {
        accessorKey: 'trvR_Date',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Date' />,
        cell: ({ row }) => (
            <div>{new Date(row.getValue('trvR_Date')).toLocaleDateString()}</div>
        )
    },
    {
        accessorKey: 'trmS_SessionName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Session Name' />,
        cell: ({ row }) => <div>{row.getValue('trmS_SessionName')}</div>
    },
    {
        accessorKey: 'trmS_Flag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='PickUp / Drop' />,
        cell: ({ row }) => <div>{row.getValue('trmS_Flag')}</div>
    },
    {
        accessorKey: 'trvR_ActiveFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => getStatusBadge(row.getValue('trvR_ActiveFlg') ? 'active' : 'inactive')
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Action' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IVehicleRouteMapping }) {
    const { openToggleForm, openEditForm } = useFormContext<IVehicleRouteMapping>();

    const handleEdit = useCallback(
        (data: IVehicleRouteMapping) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IVehicleRouteMapping) => {
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
            toggleConditionKey='trvR_ActiveFlg'
        />
    );
}
