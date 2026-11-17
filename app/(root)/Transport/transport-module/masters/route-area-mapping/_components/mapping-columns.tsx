'use client';
import { getStatusBadge } from '@/components/extras/helpers/helper';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IRouteAreaMapping } from '@/types/transport/transport-module/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const mappingColumns: ColumnDef<IRouteAreaMapping>[] = [
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
        accessorKey: 'trmR_RouteName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Route Name' />,
        cell: ({ row }) => <div>{row.original.trmR_RouteName}</div>
    },
    {
        accessorKey: 'trmA_AreaName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Area Name' />,
        cell: ({ row }) => {
            console.log('Row Data:', row.original);
            return <div>{row.original.trmA_AreaName}</div>;
        }
    },
    {
        accessorKey: 'traR_ActiveFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => getStatusBadge(row.original.traR_ActiveFlg ? 'active' : 'inactive')
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Action' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IRouteAreaMapping }) {
    const { openToggleForm } = useFormContext<IRouteAreaMapping>();

    const handleToggle = useCallback(
        (data: IRouteAreaMapping) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: false, toggle: true, delete: false }}
            onToggle={handleToggle}
            toggleConditionKey='traR_ActiveFlg'
        />
    );
}
