'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { DataTableColumnHeader as ColumnHeader } from '@/components/ui/data-table-column-header';
import { useFormContext } from '@/components/ui/form/form-provider';
import { useCallback } from 'react';

export const studentRequestColumns: ColumnDef<any, any>[] = [
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
        accessorKey: 'studentName',
        header: ({ column }) => <ColumnHeader column={column} title='Student Name' />,
    },
    {
        accessorKey: 'ASMCL_ClassName',
        header: ({ column }) => <ColumnHeader column={column} title='Class' />,
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
        accessorKey: 'HLHSREQ_RequestDate',
        header: ({ column }) => <ColumnHeader column={column} title='Date' />,
        cell: ({ row }) => {
            const date = row.original.HLHSREQ_RequestDate;
            return date ? format(new Date(date), 'dd/MM/yyyy') : '';
        },
    },
    {
        accessorKey: 'HLHSREQ_BookingStatus',
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
            toggleConditionKey='HLHSREQ_ActiveFlag'
        //isActive={rowData.HLHSREQ_ActiveFlag}
        />
    );
}
