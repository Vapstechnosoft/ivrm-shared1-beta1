'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { ILifeSkillAreaMapping } from '@/types/exam/exam-module/exam-mapping';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

// -------------------------
// TABLE COLUMNS
// -------------------------
export const LifeSkillAreaMappingColumns: ColumnDef<ILifeSkillAreaMapping>[] = [
    // Serial Number
    {
        accessorKey: 'slno',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableHiding: true,
        enableSorting: false
    },

    // Academic Year
    {
        accessorKey: 'asmaY_Year',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Year' />,
        cell: ({ row }) => <div>{row.getValue('asmaY_Year')}</div>
    },

    // Life Skill Name
    {
        accessorKey: 'ecS_SkillName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Life Skill Name' />,
        cell: ({ row }) => <div>{row.getValue('ecS_SkillName')}</div>
    },

    // Skill Area
    {
        accessorKey: 'ecsA_SkillArea',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Skill Area' />,
        cell: ({ row }) => <div>{row.getValue('ecsA_SkillArea')}</div>
    },

    // Indicator Description
    {
        accessorKey: 'ecsaM_IndicatorDescription',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Description' />,
        cell: ({ row }) => <div>{row.getValue('ecsaM_IndicatorDescription')}</div>
    },

    // Grade Name
    {
        accessorKey: 'emgR_NAME',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Grade Name' />,
        cell: ({ row }) => <div>{row.getValue('emgR_NAME')}</div>
    },

    // Actions (Edit + Toggle)
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row) => row,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

// -------------------------
// ACTION BUTTONS CELL
// -------------------------
function ActionButtonsCell({ rowData }: { rowData: ILifeSkillAreaMapping }) {
    const { openEditForm, openToggleForm } = useFormContext<ILifeSkillAreaMapping>();

    const handleEdit = useCallback(() => openEditForm(rowData), [openEditForm, rowData]);
    const handleToggle = useCallback(() => openToggleForm(rowData), [openToggleForm, rowData]);

    return (
        <div className='flex justify-center gap-2'>
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: true, delete: false, toggle: true }}
                onEdit={handleEdit}
                onToggle={handleToggle}
                toggleConditionKey='ecsaM_ActiveFlag'
            />
        </div>
    );
}
