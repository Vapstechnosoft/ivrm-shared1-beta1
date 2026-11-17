'use client';
import { getStatusBadge } from '@/components/extras/helpers/helper';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterVehicleType } from '@/types/transport/transport-module/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const vehicleTypeColumns: ColumnDef<IMasterVehicleType>[] = [
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL.No.' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div>{continuousIndex}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'trmvT_VehicleType',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Vehicle Type' />,
        cell: ({ row }) => <div>{row.original.trmvT_VehicleType}</div>
    },
    {
        accessorKey: 'trmvT_VehicleDesc',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Vehicle Description' />,
        cell: ({ row }) => <div>{row.original.trmvT_VehicleDesc}</div>
    },
    {
        accessorKey: 'trmvT_ActiveFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => getStatusBadge(row.original.trmvT_ActiveFlg ? 'active' : 'inactive')
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Action' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterVehicleType }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterVehicleType>();

    const handleEdit = useCallback(
        (data: IMasterVehicleType) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterVehicleType) => {
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
            toggleConditionKey='trmvT_ActiveFlg'
        />
    );
}
