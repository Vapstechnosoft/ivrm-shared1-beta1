'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterPeriodDetailsList } from '@/types/timetable/masters/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const masterPeriodColumns: ColumnDef<IMasterPeriodDetailsList>[] = [
    {
        accessorKey: 'impcM_Id',
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
        accessorKey: 'categoryName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Category Name' />,
        cell: ({ row }) => <div>{row.getValue('categoryName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'imP_PeriodName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Period Name' />,
        cell: ({ row }) => <div>{row.getValue('imP_PeriodName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'imP_PeriodOrder',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Period Order' />,
        cell: ({ row }) => <div>{row.getValue('imP_PeriodOrder')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'half',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Type' />,
        cell: ({ row }) => <div>{row.getValue('half')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterPeriodDetailsList }) {
    const { openToggleForm } = useFormContext<IMasterPeriodDetailsList>();

    const handleToggle = useCallback(
        (data: IMasterPeriodDetailsList) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    return <ActionButtons rowData={rowData} buttons={{ toggle: true }} onToggle={handleToggle} toggleConditionKey='ttmP_ActiveFlag' />;
}
