'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterLeaveYearList } from '@/types/hrms/hrms-config/master';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const columns: ColumnDef<IMasterLeaveYearList>[] = [
    {
        id: 'slNo',
        header: () => <div className='text-center font-medium'>Sl No</div>,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='text-center'>{continuousIndex}</div>;
        },
        enableSorting: false,
        size: 60
    },
    {
        accessorKey: 'hrmlY_LeaveYear',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Leave Year' className='whitespace-nowrap' />
    },
    {
        accessorKey: 'hrmlY_FromDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='From Date' className='whitespace-nowrap' />,
        cell: ({ row }) => {
            const dateValue = row.getValue('hrmlY_FromDate');
            return dateValue ? new Date(dateValue as string).toLocaleDateString() : '-';
        }
    },
    {
        accessorKey: 'hrmlY_ToDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='To Date' className='whitespace-nowrap' />,
        cell: ({ row }) => {
            const dateValue = row.getValue('hrmlY_ToDate');
            return dateValue ? new Date(dateValue as string).toLocaleDateString() : '-';
        }
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='whitespace-nowrap text-start' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
        enableSorting: false
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterLeaveYearList }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterLeaveYearList>();

    const handleEdit = useCallback(
        (data: IMasterLeaveYearList) => {
            openEditForm(data as any);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterLeaveYearList) => {
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
            toggleConditionKey='hrmlY_ActiveFlag'
        />
    );
}
