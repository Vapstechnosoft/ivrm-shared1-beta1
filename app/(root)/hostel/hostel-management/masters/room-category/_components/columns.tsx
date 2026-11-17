'use client';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { DataTableColumnHeader as ColumnHeader } from '@/components/ui/data-table-column-header';
import { useFormContext } from '@/components/ui/form/form-provider';
import { useCallback } from 'react';
import { IRoomCategory } from '@/types/hostel/hostel-management/masters';

const columnHelper = createColumnHelper<IRoomCategory>();

export const roomCategoryColumns: ColumnDef<IRoomCategory, any>[] = [
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
        accessorKey: 'hlmrcA_RoomCategory',
        header: ({ column }) => <ColumnHeader column={column} title="Room Category" />,
    },
    {
        accessorKey: 'hlmH_Name',
        header: ({ column }) => <ColumnHeader column={column} title="Hostel Name" />,
    },
    {
        accessorKey: 'fmG_GroupName',
        header: ({ column }) => <ColumnHeader column={column} title="Fee Group" />,
    },
    {
        accessorKey: 'hlmrcA_MaxCapacity',
        header: ({ column }) => <ColumnHeader column={column} title="Max Capacity" />,
    },
    {
        accessorKey: 'hlmrcA_SORate',
        header: ({ column }) => <ColumnHeader column={column} title="Single Bed Rate" />,
    },
    {
        accessorKey: 'hlmrcA_RoomRate',
        header: ({ column }) => <ColumnHeader column={column} title="Data Sharing Rate" />,
    },
    {
        accessorKey: 'hlmrcA_ACFlg',
        header: ({ column }) => <ColumnHeader column={column} title="AC" />,
        cell: ({ row }) => (row.original.hlmrcA_ACFlg ? <span className="text-green-600 font-bold">Yes</span> : <span className="text-red-600 font-bold">No</span>),
    },
    {
        accessorKey: 'hlmrcA_SharingFlg',
        header: ({ column }) => <ColumnHeader column={column} title="Sharing" />,
        cell: ({ row }) => (row.original.hlmrcA_SharingFlg ? <span className="text-green-600 font-bold">Yes</span> : <span className="text-red-600 font-bold">No</span>),
    },
    {
        accessorKey: 'hlmrcA_Description',
        header: ({ column }) => <ColumnHeader column={column} title="Description" />,
    },
    {
        id: 'actions',
        header: ({ column }) => <ColumnHeader column={column} title='Actions' className='text-center' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IRoomCategory }) {
    const { openEditForm, openToggleForm } = useFormContext<IRoomCategory>();

    const handleEdit = useCallback(
        (data: IRoomCategory) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IRoomCategory) => {
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
            toggleConditionKey='hlmrcA_ActiveFlag'
        />
    );
}
