'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { ISubjectAbbreviationList } from '@/types/timetable/masters/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const subjectAbbreviationsColumns: ColumnDef<ISubjectAbbreviationList>[] = [
    {
        accessorKey: 'ttmsuaB_Id',
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
        accessorKey: 'subjectName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Subject Master' />,
        cell: ({ row }) => <div>{row.getValue('subjectName')}</div>,
        enableSorting: true,
        enableHiding: true
    },

    {
        accessorKey: 'ttmsuaB_Abbreviation',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Subject Abbreviation' />,
        cell: ({ row }) => <div>{row.getValue('ttmsuaB_Abbreviation')}</div>,
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

function ActionButtonsCell({ rowData }: { rowData: ISubjectAbbreviationList }) {
    const { openEditForm, openToggleForm } = useFormContext<ISubjectAbbreviationList>();

    const handleEdit = useCallback(
        (data: ISubjectAbbreviationList) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: ISubjectAbbreviationList) => {
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
            toggleConditionKey='ttmsuaB_ActiveFlag'
        />
    );
}
