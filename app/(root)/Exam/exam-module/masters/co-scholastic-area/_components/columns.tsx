'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { ICoScholasticArea } from '@/types/exam/exam-module/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const CoScholasticAreaColumns: ColumnDef<ICoScholasticArea>[] = [
    {
        accessorKey: 'slNo',
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
        accessorKey: 'ecactA_SkillArea',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Area Name' />,
        cell: ({ row }) => <div>{row.getValue('ecactA_SkillArea')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'ecactA_SkillOrder',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Activity Order' />,
        cell: ({ row }) => <div>{row.getValue('ecactA_SkillOrder')}</div>,
        enableSorting: true
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: ICoScholasticArea }) {
    const { openEditForm, openToggleForm } = useFormContext<ICoScholasticArea>();

    const handleEdit = useCallback(
        (data: ICoScholasticArea) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: ICoScholasticArea) => {
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
            toggleConditionKey='ecactA_ActiveFlag'
        />
    );
}
