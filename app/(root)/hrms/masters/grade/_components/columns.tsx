'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterGradeList } from '@/types/hrms/hrms-config/master';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const columns: ColumnDef<IMasterGradeList>[] = [
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
        accessorKey: 'hrmG_GradeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Grade Name' className='whitespace-nowrap' />
    },
    {
        accessorKey: 'hrmG_GradeDisplayName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Grade Display Name' className='whitespace-nowrap' />
    },
    {
        accessorKey: 'hrmG_PayScaleFrom',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Pay Scale From' className='whitespace-nowrap' />
    },
    {
        accessorKey: 'hrmG_IncrementOf',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Increment Of' className='whitespace-nowrap' />
    },
    {
        accessorKey: 'hrmG_PayScaleTo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Pay Scale To' className='whitespace-nowrap' />
    },
    {
        accessorKey: 'hrmG_PayScaleRange',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Pay Scale Range' className='whitespace-nowrap' />
    },
    {
        accessorKey: 'hrmG_Order',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Order' className='whitespace-nowrap' />,
        cell: ({ row }) => {
            const orderValue = row.original.hrmG_Order;
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

function ActionButtonsCell({ rowData }: { rowData: IMasterGradeList }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterGradeList>();

    const handleEdit = useCallback(
        (data: IMasterGradeList) => {
            openEditForm(data as any);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterGradeList) => {
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
            toggleConditionKey='hrmG_ActiveFlag'
        />
    );
}
