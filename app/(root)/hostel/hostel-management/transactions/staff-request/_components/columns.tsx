'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { DataTableColumnHeader as ColumnHeader } from '@/components/ui/data-table-column-header';
import { useFormContext } from '@/components/ui/form/form-provider';
import { useCallback } from 'react';

export const staffRequestColumns: ColumnDef<any, any>[] = [
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
        accessorKey: 'empName',
        header: ({ column }) => <ColumnHeader column={column} title='Staff Name' />,
    },
    {
        accessorKey: 'HRMD_DepartmentName',
        header: ({ column }) => <ColumnHeader column={column} title='Department' />,
    },
    {
        accessorKey: 'HLMH_Name',
        header: ({ column }) => <ColumnHeader column={column} title='Hostel' />,
    },
    {
        accessorKey: 'HLMRCA_RoomCategory',
        header: ({ column }) => <ColumnHeader column={column} title='Category' />,
    },
    {
        accessorKey: 'HLHSTREQ_RequestDate',
        header: ({ column }) => <ColumnHeader column={column} title='Date' />,
        cell: ({ row }) => {
            const date = row.original.HLHSTREQ_RequestDate;
            return date ? format(new Date(date), 'dd/MM/yyyy') : '';
        },
    },
    {
        accessorKey: 'HLHSTREQ_BookingStatus',
        header: ({ column }) => <ColumnHeader column={column} title='Status' />,
    },
    {
        id: 'actions',
        header: ({ column }) => <ColumnHeader column={column} title='Action' className='text-center' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: any }) {
    const { openEditForm, openToggleForm } = useFormContext<any>();

    const handleEdit = useCallback(
        (data: any) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: any) => {
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
            toggleConditionKey='HLHSTREQ_ActiveFlag'
        />
    );
}
