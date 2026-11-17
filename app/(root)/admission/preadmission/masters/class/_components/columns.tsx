'use client';

import { getStatusBadge } from '@/components/extras/helpers/helper';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterClassList } from '@/types/admission/preadmission/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const masterClassColumns: ColumnDef<IMasterClassList>[] = [
    {
        accessorKey: 'asmcL_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='w-full pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='w-full pl-6'>{continuousIndex}</div>;
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'asmcL_ClassCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class Code' />,
        cell: ({ row }) => <div>{row.getValue('asmcL_ClassCode')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'asmcL_ClassName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class Name' />,
        cell: ({ row }) => <div>{row.getValue('asmcL_ClassName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'asmcL_Order',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Order' />,
        cell: ({ row }) => <div>{row.getValue('asmcL_Order')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'asmcL_MinAgeYear',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Min Age (Years)' />,
        cell: ({ row }) => <div>{row.getValue('asmcL_MinAgeYear')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'asmcL_MinAgeMonth',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Min Age (Months)' />,
        cell: ({ row }) => <div>{row.getValue('asmcL_MinAgeMonth')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'asmcL_MinAgeDays',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Min Age (Days)' />,
        cell: ({ row }) => <div>{row.getValue('asmcL_MinAgeDays')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'asmcL_MaxAgeYear',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Max Age (Years)' />,
        cell: ({ row }) => <div>{row.getValue('asmcL_MaxAgeYear')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'asmcL_MaxAgeMonth',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Max Age (Months)' />,
        cell: ({ row }) => <div>{row.getValue('asmcL_MaxAgeMonth')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'asmcL_MaxAgeDays',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Max Age (Days)' />,
        cell: ({ row }) => <div>{row.getValue('asmcL_MaxAgeDays')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'asmcL_MaxCapacity',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Max Capacity' />,
        cell: ({ row }) => <div>{row.getValue('asmcL_MaxCapacity')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'asmcL_PreadmFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Pre-Admission Flag' className='text-nowrap' />,
        cell: ({ row }) => <div>{getStatusBadge((row.getValue('asmcL_PreadmFlag') as number) === 1 ? 'yes' : 'no')}</div>,
        enableSorting: false,
        enableHiding: true
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterClassList }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterClassList>();

    const handleEdit = useCallback(
        (data: IMasterClassList) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterClassList) => {
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
            toggleConditionKey='asmcL_ActiveFlag'
        />
    );
}
