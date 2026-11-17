'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { ILifeSkill } from '@/types/exam/exam-module/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const lifeSkillsColumns: ColumnDef<ILifeSkill>[] = [
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
        accessorKey: 'ecS_SkillName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Skill Name' />,
        cell: ({ row }) => <div>{row.getValue('ecS_SkillName')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'ecS_SkillCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Skill Code' />,
        cell: ({ row }) => <div>{row.getValue('ecS_SkillCode')}</div>
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

function ActionButtonsCell({ rowData }: { rowData: ILifeSkill }) {
    const { openEditForm, openToggleForm } = useFormContext<ILifeSkill>();

    const handleEdit = useCallback(
        (data: ILifeSkill) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: ILifeSkill) => {
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
            toggleConditionKey='ecS_ActiveFlag'
        />
    );
}
