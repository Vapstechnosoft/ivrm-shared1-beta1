'use client';

import { getStatusBadge } from '@/components/extras/helpers/helper';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterRackDetails } from '@/types/library/masters/rack-details';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const MasterRackDetailsColumns: ColumnDef<IMasterRackDetails>[] = [
    {
        id: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div>{continuousIndex}</div>;
        },
        enableHiding: true,
        enableSorting: false
    },
    {
        accessorKey: 'lmrA_Location',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Rack Location' />,
        cell: ({ row }) => <div>{row.getValue('lmrA_Location')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmrA_BuildingName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Building Name' />,
        cell: ({ row }) => <div>{row.getValue('lmrA_BuildingName')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmrA_RackName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Rack Name' />,
        cell: ({ row }) => <div>{row.getValue('lmrA_RackName')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmrA_FloorName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Floor Name' />,
        cell: ({ row }) => <div>{row.getValue('lmrA_FloorName')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmS_SubjectName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Subject Name' />,
        cell: ({ row }) => <div>{row.getValue('lmS_SubjectName')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmrA_ActiveFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => getStatusBadge(row.getValue('lmrA_ActiveFlag') === true ? 'yes' : 'no')
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterRackDetails }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterRackDetails>();

    const handleEdit = useCallback(
        (data: IMasterRackDetails) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterRackDetails) => {
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
            toggleConditionKey='lmrA_ActiveFlag'
        />
    );
}
