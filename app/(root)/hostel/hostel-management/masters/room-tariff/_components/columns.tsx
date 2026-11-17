'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { DataTableColumnHeader as ColumnHeader } from '@/components/ui/data-table-column-header';
import { IRoomTariff } from '@/server/hostel/hostel-management/masters/room-tariff';
import { useFormContext } from '@/components/ui/form/form-provider';
import { useCallback } from 'react';

export const roomTariffColumns: ColumnDef<IRoomTariff, any>[] = [
    {
        accessorKey: 'sn',
        header: ({ column }) => <ColumnHeader column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'asmaY_Year',
        header: ({ column }) => <ColumnHeader column={column} title="Year" />,
    },
    {
        accessorKey: 'hrmrM_RoomNo',
        header: ({ column }) => <ColumnHeader column={column} title="Room" />,
    },
    {
        accessorKey: 'hlmrtF_SORate',
        header: ({ column }) => <ColumnHeader column={column} title="Single Bed Rate" />,
    },
    {
        accessorKey: 'hlmrtF_RoomRate',
        header: ({ column }) => <ColumnHeader column={column} title="Entire Room Rate" />,
    },
    {
        id: 'actions',
        header: ({ column }) => <ColumnHeader column={column} title='Actions' className='text-center' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
    },
];

function ActionButtonsCell({ rowData }: { rowData: IRoomTariff }) {
    const { openEditForm, openToggleForm } = useFormContext<IRoomTariff>();

    const handleEdit = useCallback(
        (data: IRoomTariff) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IRoomTariff) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: true }}
            onEdit={handleEdit}
            onToggle={handleToggle}
            toggleConditionKey="hlmrtF_ActiveFlag"
        />
    );
}
