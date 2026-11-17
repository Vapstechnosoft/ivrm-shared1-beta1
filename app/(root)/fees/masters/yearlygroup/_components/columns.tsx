'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMaasterFeesYearlyGrouping } from '@/types/fees/masters/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const YearlyColoumnsColumns: ColumnDef<IMaasterFeesYearlyGrouping>[] = [
    // {
    //     id: 'fyG_Id',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title='S.No' className='pl-6 text-start' />,
    //     cell: ({ row }) => <div className='pl-6 text-start'>{row.index + 1}</div>,
    //     enableSorting: false,
    //     enableHiding: false
    // },
    {
        accessorKey: 'fyG_Id',
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
        accessorKey: 'asmaY_Year',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Academic Year' />,
        cell: ({ row }) => <div>{row.getValue('asmaY_Year') ?? 'N/A'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmG_GroupName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Fee Groups' />,
        cell: ({ row }) => {
            const val = row.getValue('fmG_GroupName');
            if (Array.isArray(val)) return <div>{val.join(', ')}</div>;
            if (typeof val === 'string') return <div>{val.trim() || 'N/A'}</div>;
            return <div />;
        },
        enableSorting: false,
        enableHiding: true
    },

    {
        accessorKey: 'fyG_RebateApplicableFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Rebate Applicable' />,
        cell: ({ row }) => {
            const val = row.getValue('fyG_RebateApplicableFlg');
            const is =
                typeof val === 'boolean'
                    ? val
                    : typeof val === 'number'
                      ? val === 1
                      : typeof val === 'string'
                        ? val.toLowerCase() === 'true'
                        : false;

            return <div>{is ? 'Yes' : 'No'}</div>;
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fyG_PartialRebateAmtOrPercentageValue',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Rebate Value' />,
        cell: ({ row }) => {
            const val = row.getValue('fyG_PartialRebateAmtOrPercentageValue');
            const type = (row.original as any)?.fyG_RebateTypeFlg;

            if (val === undefined || val === null || val === '') return <div />;

            const asStr = String(val);
            const formatted = type && String(type).toLowerCase().includes('percent') ? `${asStr}%` : asStr;

            return <div>{formatted}</div>;
        },
        enableSorting: true,
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

function ActionButtonsCell({
    rowData
}: {
    rowData: IMaasterFeesYearlyGrouping;
}) {
    const { openEditForm, openToggleForm } = useFormContext<IMaasterFeesYearlyGrouping>();

    const handleEdit = useCallback(
        (data: IMaasterFeesYearlyGrouping) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMaasterFeesYearlyGrouping, _newState?: boolean) => {
            if (openToggleForm) openToggleForm(data);
        },
        [openToggleForm]
    );

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: true }}
            onEdit={handleEdit}
            onToggle={handleToggle}
            toggleConditionKey='fyG_ActiveFlag'
        />
    );
}
