'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterFeeYearlyRebateSettingFacade, IMasterYearlyRebateList } from '@/types/fees/masters/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const YearlyRebateSettingColumns: ColumnDef<IMasterFeeYearlyRebateSettingFacade>[] = [
    {
        accessorKey: 'id',
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
        cell: ({ row }) => <div>{row.getValue('asmaY_Year') ?? 'N/A'}</div>
    },
    {
        accessorKey: 'fyrebseT_RebateTypeFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Rebate Type' />,
        cell: ({ row }) => <div>{row.getValue('fyrebseT_RebateTypeFlg') ?? 'N/A'}</div>
    },
    {
        accessorKey: 'fyrebseT_RebateAmtOrPercentValue',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Rebate Value' />,
        cell: ({ row }) => {
            const val = row.getValue('fyrebseT_RebateAmtOrPercentValue');
            if (val === undefined || val === null || val === '') return <div />;
            const rebateType = String(row.getValue('fyrebseT_RebateAmtOrPercentValue') ?? '').toLowerCase();
            const formatted = rebateType.includes('percent') ? `${val}%` : String(val);
            return <div>{formatted}</div>;
        }
    },
    {
        accessorKey: 'fyrebseT_RebateDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Date' />,
        cell: ({ row }) => {
            const dateVal = row.getValue('fyrebseT_RebateDate');
            return <div>{dateVal ? String(dateVal) : 'N/A'}</div>;
        }
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterYearlyRebateList }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterYearlyRebateList>();

    const handleEdit = useCallback(() => openEditForm(rowData), [openEditForm, rowData]);
    const handleToggle = useCallback(() => openToggleForm?.(rowData), [openToggleForm, rowData]);

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: true }}
            onEdit={handleEdit}
            onToggle={handleToggle}
            toggleConditionKey='fyrebseT_ActiveId'
        />
    );
}
