'use client';

import { getStatusBadge } from '@/components/extras/helpers/helper';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IRouteLocationMapping } from '@/types/transport/transport-module/transaction';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const routeLocationMappingColumns: ColumnDef<IRouteLocationMapping>[] = [
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
        accessorKey: 'routename', // Legacy field name
        header: ({ column }) => <DataTableColumnHeader column={column} title='Route Name' />,
        cell: ({ row }) => <div>{row.original.routename || row.original.trmR_RouteName}</div>
    },
    {
        accessorKey: 'locationname', // Legacy field name
        header: ({ column }) => <DataTableColumnHeader column={column} title='Location Name' />,
        cell: ({ row }) => <div>{row.original.locationname || row.original.trmL_LocationName}</div>
    },
    {
        accessorKey: 'trmrL_ActiveFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => getStatusBadge(row.original.trmrL_ActiveFlag ? 'active' : 'inactive')
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Action' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IRouteLocationMapping }) {
    const { openToggleForm } = useFormContext<IRouteLocationMapping>();

    const handleToggle = useCallback(
        (data: IRouteLocationMapping) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: false, toggle: true, delete: false }}
            onToggle={handleToggle}
            toggleConditionKey='trmrL_ActiveFlag'
        />
    );
}
