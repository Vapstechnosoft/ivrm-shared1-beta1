'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { DataTableColumnHeader as ColumnHeader } from '@/components/ui/data-table-column-header';
import { ColumnDef } from '@tanstack/react-table';
import { useFormContext } from '@/components/ui/form/form-provider';
import { useCallback } from 'react';

export type GuestAllotmentColumn = {
    hlhgstalT_Id: number;
    hlhgstalT_GuestName: string;
    hlhgstalT_GuestPhoneNo: string;
    hlhgstalT_GuestEmailId: string;
    hlmH_Name: string;
    hrmrM_RoomNo: string;
    hlmrcA_RoomCategory: string;
    hlhgstalT_NoOfBeds: number;
    hlhgstalT_ActiveFlag: boolean;
};

export const guestAllotmentColumns: ColumnDef<GuestAllotmentColumn, any>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label='Select all'
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label='Select row'
            />
        ),
        enableSorting: false,
        enableHiding: false
    },
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
        accessorKey: 'hlhgstalT_GuestName',
        header: ({ column }) => <ColumnHeader column={column} title='Name' />
    },
    {
        accessorKey: 'hlhgstalT_GuestPhoneNo',
        header: ({ column }) => <ColumnHeader column={column} title='Phone No' />
    },
    {
        accessorKey: 'hlhgstalT_GuestEmailId',
        header: ({ column }) => <ColumnHeader column={column} title='Email' />
    },
    {
        accessorKey: 'hlmH_Name',
        header: ({ column }) => <ColumnHeader column={column} title='Hostel' />
    },
    {
        accessorKey: 'hrmrM_RoomNo',
        header: ({ column }) => <ColumnHeader column={column} title='Room No' />
    },
    {
        accessorKey: 'hlmrcA_RoomCategory',
        header: ({ column }) => <ColumnHeader column={column} title='Category' />
    },
    {
        accessorKey: 'hlhgstalT_NoOfBeds',
        header: ({ column }) => <ColumnHeader column={column} title='Beds' />
    },
    {
        id: 'actions',
        header: ({ column }) => <ColumnHeader column={column} title='Actions' className='text-center' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: GuestAllotmentColumn }) {
    const { openEditForm } = useFormContext<GuestAllotmentColumn>();

    const handleEdit = useCallback(
        (data: GuestAllotmentColumn) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: false, delete: false }}
            onEdit={handleEdit}
        />
    );
}
