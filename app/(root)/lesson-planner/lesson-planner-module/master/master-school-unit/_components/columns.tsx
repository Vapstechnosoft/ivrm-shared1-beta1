'use client';

import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterSchoolUnit } from '@/types/lesson-planner/master/school-master-unit';
import type { ColumnDef } from '@tanstack/react-table';
import { Pencil } from 'lucide-react';
import { useCallback } from 'react';

export const MasterSchoolUnitColumns: ColumnDef<IMasterSchoolUnit>[] = [
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
        accessorKey: 'lpmU_UnitName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Unit Name' />,
        cell: ({ row }) => <div>{row.getValue('lpmU_UnitName')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lpmU_UnitDescription',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Unit Description' />,
        cell: ({ row }) => <div>{row.getValue('lpmU_UnitDescription') || '-'}</div>
    },
    {
        accessorKey: 'lpmU_TotalPeriods',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total No. Of Periods' />,
        cell: ({ row }) => <div>{row.getValue('lpmU_TotalPeriods') || '-'}</div>
    },
    {
        accessorKey: 'lpmU_TotalHrs',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total No. Of Hours' />,
        cell: ({ row }) => <div>{row.getValue('lpmU_TotalHrs') || '-'}</div>
    },
    {
        accessorKey: 'lpmU_Order',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Order' />,
        cell: ({ row }) => <div>{row.getValue('lpmU_Order') || '-'}</div>
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterSchoolUnit }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterSchoolUnit>();

    const handleEdit = useCallback(
        (data: IMasterSchoolUnit) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterSchoolUnit) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    return (
        <div className='flex items-center justify-center gap-2'>
            <Button variant='ghost' size='icon' onClick={() => handleEdit(rowData)} title='Edit'>
                <Pencil className='h-4 w-4 text-primary' />
            </Button>
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: false, toggle: true, delete: false }}
                onToggle={handleToggle}
                toggleConditionKey='lpmU_ActiveFlag'
            />
        </div>
    );
}
