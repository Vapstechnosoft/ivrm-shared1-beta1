'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { BreakTimeSettingsGridData } from '@/types/timetable/masters/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const breakTimeSettingsColumns: ColumnDef<BreakTimeSettingsGridData>[] = [
    {
        accessorKey: 'ttmB_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='pl-6'>{continuousIndex}</div>;
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'asmayYear',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Academic Year' />,
        cell: ({ row }) => <div>{row.getValue('asmayYear')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'className',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class Name' />,
        cell: ({ row }) => <div>{row.getValue('className')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'dayName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Day Name' />,
        cell: ({ row }) => <div>{row.getValue('dayName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'ttmB_BreakName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Break Name' />,
        cell: ({ row }) => <div>{row.getValue('ttmB_BreakName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'ttmB_BreakStartTime',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Break Start Time' />,
        cell: ({ row }) => <div>{row.getValue('ttmB_BreakStartTime')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'ttmB_BreakEndTime',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Break End Time' />,
        cell: ({ row }) => <div>{row.getValue('ttmB_BreakEndTime')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'ttmB_AfterPeriod',
        header: ({ column }) => <DataTableColumnHeader column={column} title='After Period' />,
        cell: ({ row }) => <div>{row.getValue('ttmB_AfterPeriod')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: BreakTimeSettingsGridData }) {
    const { openEditForm, openToggleForm, openDeleteForm } = useFormContext<BreakTimeSettingsGridData>();

    const handleEdit = useCallback(
        (data: BreakTimeSettingsGridData) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: BreakTimeSettingsGridData) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    const handleDelete = useCallback(
        (data: BreakTimeSettingsGridData) => {
            // Assuming no delete functionality in MasterDay, but user asked for it in general or the standard
            // User code has deletedata function.
            if (openDeleteForm) openDeleteForm(data);
        },
        [openDeleteForm]
    );

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: true, delete: true }}
            onEdit={handleEdit}
            onToggle={handleToggle}
            onDelete={handleDelete}
            toggleConditionKey='ttmB_ActiveFlag'
        />
    );
}
