'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterEarningsDeductionsList } from '@/types/hrms/hrms-config/master';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';
export const columns: ColumnDef<IMasterEarningsDeductionsList>[] = [
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
        accessorKey: 'hrmeD_Name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Name' className='whitespace-nowrap' />
    },
    {
        accessorKey: 'hrmeD_EDTypeFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Type' className='whitespace-nowrap' />
    },
    {
        accessorKey: 'hrmeD_EarnDedFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Category' className='whitespace-nowrap' />,
        cell: ({ row }) => {
            const value = row.getValue('hrmeD_EarnDedFlag') as string;
            const badgeClass =
                value === 'Earning'
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : value === 'Deduction'
                      ? 'bg-red-100 text-red-800 border-red-200'
                      : value === 'Arrear'
                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                        : 'bg-purple-100 text-purple-800 border-purple-200';
            return (
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold text-xs ${badgeClass}`}>
                    {value}
                </span>
            );
        }
    },
    {
        accessorKey: 'hrmeD_AmountPercentFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Amount Type' className='whitespace-nowrap' />
    },
    {
        accessorKey: 'hrmeD_AmountPercent',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Value' className='whitespace-nowrap' />
    },
    {
        accessorKey: 'hrmeD_Order',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Order' className='whitespace-nowrap' />,
        cell: ({ row }) => row.original.hrmeD_Order ?? '-'
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='whitespace-nowrap text-start' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
        enableSorting: false
    }
];
function ActionButtonsCell({ rowData }: { rowData: IMasterEarningsDeductionsList }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterEarningsDeductionsList>();

    const handleEdit = useCallback(
        (data: IMasterEarningsDeductionsList) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterEarningsDeductionsList) => {
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
            toggleConditionKey='hrmeD_ActiveFlag'
        />
    );
}
