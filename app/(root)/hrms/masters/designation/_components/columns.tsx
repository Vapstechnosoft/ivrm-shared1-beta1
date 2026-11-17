'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterDesignationList } from '@/types/hrms/hrms-config/master';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const columns: ColumnDef<IMasterDesignationList>[] = [
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
        accessorKey: 'hrmdeS_DesignationName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Designation' className='whitespace-nowrap' />
    },
    {
        accessorKey: 'hrmdeS_BasicAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Basic Amount' className='whitespace-nowrap' />
    },
    {
        accessorKey: 'hrmdeS_SanctionedSeats',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sanctioned Seats' className='whitespace-nowrap' />
    },
    {
        accessorKey: 'hrmdeS_DisplaySanctionedSeatsFlag',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Display Sanctioned Seats Flag' className='whitespace-nowrap' />
        )
    },
    {
        accessorKey: 'hrmdeS_Order',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Order' className='whitespace-nowrap' />,
        cell: ({ row }) => {
            const orderValue = row.original.hrmdeS_Order;
            return <div>{orderValue ?? '-'}</div>;
        }
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='whitespace-nowrap text-start' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
        enableSorting: false
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterDesignationList }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterDesignationList>();

    const handleEdit = useCallback(
        (data: IMasterDesignationList) => {
            openEditForm(data as any);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterDesignationList) => {
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
            toggleConditionKey='hrmdeS_ActiveFlag'
        />
    );
}
