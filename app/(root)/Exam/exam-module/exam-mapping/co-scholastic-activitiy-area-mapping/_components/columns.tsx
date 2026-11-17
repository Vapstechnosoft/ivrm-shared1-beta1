'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { ICoScholasticActivityAreaMapping } from '@/types/exam/exam-module/exam-mapping';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

// -------------------------
// TABLE COLUMNS
// -------------------------
export const CoScholasticActivityAreaMappingColumns: ColumnDef<ICoScholasticActivityAreaMapping>[] = [
    // Serial Number
    {
        accessorKey: 'slno',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },

    // Academic Year
    {
        accessorKey: 'asmaY_Year',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Year' />,
        cell: ({ row }) => <div>{row.getValue('asmaY_Year')}</div>
    },
    // Activities
    {
        accessorKey: 'ecacT_SkillName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Activities' />,
        cell: ({ row }) => <div>{row.getValue('ecacT_SkillName')}</div>
    },
    // Activities Area
    {
        accessorKey: 'ecactA_SkillArea',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Activities Area' />,
        cell: ({ row }) => <div>{row.getValue('ecactA_SkillArea')}</div>
    },

    // Term Name
    {
        accessorKey: 'ecactaM_IndicatorDescription',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Description' />,
        cell: ({ row }) => <div>{row.getValue('ecactaM_IndicatorDescription')}</div>
    },
    // Grade Name
    {
        accessorKey: 'emgR_GradeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Grade Name' />,
        cell: ({ row }) => <div>{row.getValue('emgR_GradeName')}</div>
    },

    // Actions (Edit + Delete)
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
function ActionButtonsCell({ rowData }: { rowData: ICoScholasticActivityAreaMapping }) {
    const { openEditForm, openDeleteForm, openToggleForm, openDetailsView } = useFormContext<ICoScholasticActivityAreaMapping>();

    const handleEdit = useCallback(() => openEditForm(rowData), [openEditForm, rowData]);
    const handleToggle = useCallback(() => openToggleForm(rowData), [openToggleForm, rowData]);

    return (
        <div className='flex justify-center gap-2'>
            {/*  Edit,  Toggle,  Delete buttons */}
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: true, delete: false, toggle: true }}
                onEdit={handleEdit}
                onToggle={handleToggle}
                toggleConditionKey='ecactaM_ActiveFlag'
            />
        </div>
    );
}
