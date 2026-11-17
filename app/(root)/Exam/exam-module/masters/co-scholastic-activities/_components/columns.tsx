'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { ICoScholasticActivity } from '@/types/exam/exam-module/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const CoScholasticActivityColumns: ColumnDef<ICoScholasticActivity>[] = [
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div>{continuousIndex}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'ecacT_SkillName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Activity Name' />,
        cell: ({ row }) => <div>{row.getValue('ecacT_SkillName')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'ecacT_SkillCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Activity Code' />,
        cell: ({ row }) => <div>{row.getValue('ecacT_SkillCode')}</div>
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
        enableHiding: false
    }
];

function ActionButtonsCell({ rowData }: { rowData: ICoScholasticActivity }) {
    const { openEditForm, openToggleForm } = useFormContext<ICoScholasticActivity>();

    const handleEdit = useCallback(
        (data: ICoScholasticActivity) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: ICoScholasticActivity) => {
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
            toggleConditionKey='ecacT_ActiveFlag'
        />
    );
}
