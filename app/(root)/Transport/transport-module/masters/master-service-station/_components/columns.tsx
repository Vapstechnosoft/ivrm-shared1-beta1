'use client';
import { getStatusBadge } from '@/components/extras/helpers/helper';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterServiceStation } from '@/types/transport/transport-module/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const serviceStationColumns: ColumnDef<IMasterServiceStation>[] = [
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
        accessorKey: 'trmssT_ServiceStationName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Service Station' />,
        cell: ({ row }) => <div>{row.original.trmssT_ServiceStationName}</div>
    },
    {
        accessorKey: 'trmssT_ContactNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Mobile No' />,
        cell: ({ row }) => <div>{row.original.trmssT_ContactNo}</div>
    },
    {
        accessorKey: 'trmssT_EmailId',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Email Id' />,
        cell: ({ row }) => <div>{row.original.trmssT_EmailId}</div>
    },
    {
        accessorKey: 'trmssT_Address',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Address' />,
        cell: ({ row }) => <div>{row.original.trmssT_Address}</div>
    },
    {
        accessorKey: 'trmssT_ActiveFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => getStatusBadge(row.original.trmssT_ActiveFlag ? 'active' : 'inactive')
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Action' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterServiceStation }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterServiceStation>();

    const handleEdit = useCallback(
        (data: IMasterServiceStation) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterServiceStation) => {
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
            toggleConditionKey='trmssT_ActiveFlag'
        />
    );
}
