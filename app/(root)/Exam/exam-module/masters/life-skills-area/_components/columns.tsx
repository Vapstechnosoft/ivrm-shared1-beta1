'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { ILifeSkillArea } from '@/types/exam/exam-module/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

// ✅ LifeSkillArea columns definition
export const LifeSkillAreaColumns: ColumnDef<ILifeSkillArea>[] = [
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
        accessorKey: 'ecsA_SkillArea',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Skill Area' />,
        cell: ({ row }) => <div>{row.getValue('ecsA_SkillArea')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'ecsA_SkillOrder',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Skill Area Order' />,
        cell: ({ row }) => <div>{row.getValue('ecsA_SkillOrder')}</div>,
        enableSorting: true
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

// ✅ Cell actions for edit & toggle
function ActionButtonsCell({ rowData }: { rowData: ILifeSkillArea }) {
    const { openEditForm, openToggleForm } = useFormContext<ILifeSkillArea>();

    const handleEdit = useCallback(
        (data: ILifeSkillArea) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: ILifeSkillArea) => {
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
            toggleConditionKey='ecsA_ActiveFlag'
        />
    );
}
