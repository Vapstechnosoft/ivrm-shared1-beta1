'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IStaffAbbreviationList } from '@/types/timetable/masters/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const staffAbbreviationsColumns: ColumnDef<IStaffAbbreviationList>[] = [
    {
        accessorKey: 'ttmsaB_Id',
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
        accessorKey: 'firstName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Staff Name' />,
        cell: ({ row }) => <div>{row.getValue('firstName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'ttmsaB_Abbreviation',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Staff Abbreviation' />,
        cell: ({ row }) => <div>{row.getValue('ttmsaB_Abbreviation')}</div>,
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

function ActionButtonsCell({ rowData }: { rowData: IStaffAbbreviationList }) {
    const { openEditForm, openToggleForm } = useFormContext<IStaffAbbreviationList>();

    const handleEdit = useCallback(
        (data: IStaffAbbreviationList) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IStaffAbbreviationList) => {
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
            toggleConditionKey='ttmsaB_ActiveFlag'
        />
    );
}
