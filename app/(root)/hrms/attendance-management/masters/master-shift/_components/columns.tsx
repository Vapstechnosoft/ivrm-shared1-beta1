'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';
export interface MasterShift {
    id: number;
    shiftName: string;
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    remarks?: string;
    specificDay: boolean;
    createdAt: Date;
}
export const masterShiftColumns: ColumnDef<MasterShift>[] = [
    {
        id: 'sl',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL.NO' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='font-medium'>{continuousIndex}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'shiftName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Shift Name' />,
        cell: ({ row }) => <div>{row.getValue('shiftName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'startTime',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Shift Start Time' />,
        cell: ({ row }) => <div>{row.getValue('startTime')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'endTime',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Shift End Time' />,
        cell: ({ row }) => <div>{row.getValue('endTime')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'specificDay',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Specific Day' />,
        cell: ({ row }) => <div>{row.getValue('specificDay') ? 'Yes' : 'No'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'remarks',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Remarks' />,
        cell: ({ row }) => <div>{row.getValue('remarks')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-start' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];
function ActionButtonsCell({ rowData }: { rowData: MasterShift }) {
    const { openEditForm, openDeleteForm } = useFormContext<MasterShift>();
    const handleEdit = useCallback(
        (data: MasterShift) => {
            openEditForm(data);
        },
        [openEditForm]
    );
    const handleDelete = useCallback(
        (data: MasterShift) => {
            openDeleteForm(data);
        },
        [openDeleteForm]
    );
    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: false, delete: true }}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );
}
