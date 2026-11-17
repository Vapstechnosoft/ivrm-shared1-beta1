'use client';

import { useCallback } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import { getStatusBadge } from '@/components/extras/helpers/helper';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterTimeSlab } from '@/types/library/masters/time-slab';

/**
 * Master Time Slab Table Columns
 */
export const MasterTimeSlabColumns: ColumnDef<IMasterTimeSlab>[] = [
    {
        id: 'slNo',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Sl.No" />
        ),
        cell: ({ row, table }) => {
            const { pageIndex, pageSize } = table.getState().pagination;
            const index = pageIndex * pageSize + row.index + 1;
            return <div>{index}</div>;
        },
        enableSorting: false,
        enableHiding: true
    },
    {
        accessorKey: 'lfsE_UserType',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="User Type" />
        ),
        cell: ({ row }) => (
            <div>{String(row.getValue('lfsE_UserType') ?? '-')}</div>
        )
    },
    {
        accessorKey: 'lfsE_SlabTypeFlg',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Slab Type" />
        ),
        cell: ({ row }) => (
            <div>{String(row.getValue('lfsE_SlabTypeFlg') ?? '-')}</div>
        )
    },
    {
        accessorKey: 'lfsE_PerDayFlg',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Per Day" />
        ),
        cell: ({ row }) => {
            const value = row.getValue<number>('lfsE_PerDayFlg');
            return <div>{value === 1 ? 'Yes' : 'No'}</div>;
        }
    },
    {
        accessorKey: 'lfsE_FromDay',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="From Day" />
        ),
        cell: ({ row }) => (
            <div>{row.getValue('lfsE_FromDay') ?? '-'}</div>
        )
    },
    {
        accessorKey: 'lfsE_ToDay',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="To Day" />
        ),
        cell: ({ row }) => (
            <div>{row.getValue('lfsE_ToDay') ?? '-'}</div>
        )
    },
    {
        accessorKey: 'lfsE_Amount',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ row }) => (
            <div>{row.getValue('lfsE_Amount') ?? 0}</div>
        )
    },
    {
        accessorKey: 'lfsE_ActiveFlg',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
           // const active = row.getValue<boolean>('lfsE_ActiveFlg');
            const active = Boolean(row.getValue('lfsE_ActiveFlg'));
            return getStatusBadge(active ? 'yes' : 'no');
        }
    },
    {
        id: 'actions',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Actions"
                className="text-center"
            />
        ),
        enableSorting: false,
        cell: ({ row }) => (
            <ActionButtonsCell rowData={row.original} />
        )
    }
];

/**
 * Action Buttons Cell
 */
function ActionButtonsCell({ rowData }: { rowData: IMasterTimeSlab }) {
  const { openEditForm, openToggleForm } =
    useFormContext<IMasterTimeSlab>();

  const handleEdit = () => openEditForm(rowData);
  const handleToggle = () => openToggleForm(rowData);
  
    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: true, delete: false }}
            onEdit={handleEdit}
            onToggle={handleToggle}
            toggleConditionKey="lfsE_ActiveFlg"
        />
    );
}
