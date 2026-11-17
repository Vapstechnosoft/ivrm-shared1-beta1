'use client';

import { getStatusBadge } from '@/components/extras/helpers/helper';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IPromotionalGroupDetails } from '@/types/exam/exam-module/exam-mapping';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useCallback } from 'react';

/* --------------------------------
   PROMOTIONAL GROUP COLUMNS
-------------------------------- */
export const PromotionalGroupMappingColumns: ColumnDef<IPromotionalGroupDetails>[] = [
    {
        id: 'slNo',
        header: ({ column }) => <DataTableColumnHeader title='SL NO' column={column} />,
        cell: ({ row }) => row.index + 1,
        enableSorting: false
    },
    {
        accessorKey: 'empsG_GroupName',
        header: ({ column }) => <DataTableColumnHeader title='Group Name' column={column} />,
        cell: ({ row }) => row.getValue('empsG_GroupName'),
        enableSorting: false
    },
    {
        accessorKey: 'empsG_DisplayName',
        header: ({ column }) => <DataTableColumnHeader title='Display Name' column={column} />,
        cell: ({ row }) => row.getValue('empsG_DisplayName'),
        enableSorting: false
    },
    {
        accessorKey: 'empsG_MarksValue',
        header: ({ column }) => <DataTableColumnHeader title='Marks' column={column} />,
        cell: ({ row }) => row.getValue('empsG_MarksValue'),
        enableSorting: false
    },
    {
        accessorKey: 'empsG_PercentValue',
        header: ({ column }) => <DataTableColumnHeader title='Percentage' column={column} />,
        cell: ({ row }) => row.getValue('empsG_PercentValue'),
        enableSorting: false
    },
    {
        accessorKey: 'empsG_MaxOff',
        header: ({ column }) => <DataTableColumnHeader title='Max off' column={column} />,
        cell: ({ row }) => row.getValue('empsG_MaxOff'),
        enableSorting: false
    },
    {
        accessorKey: 'empsG_BestOff',
        header: ({ column }) => <DataTableColumnHeader title='Best Off' column={column} />,
        cell: ({ row }) => row.getValue('empsG_BestOff') ?? '-',
        enableSorting: false
    },
    {
        accessorKey: 'empsG_RoundOffFlag',
        header: ({ column }) => <DataTableColumnHeader title='Round Off flag' column={column} />,
        cell: ({ row }) => getStatusBadge(row.original.empsG_RoundOffFlag === true ? 'yes' : 'no'),
        enableSorting: false
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Action' className='text-center' />,
        accessorFn: (row) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

/* --------------------------------
   VIEW (EYE) CELL
-------------------------------- */
function MappingCell({ rowData }: { rowData: IPromotionalGroupDetails }) {
    const { openMappedview } = useFormContext<IPromotionalGroupDetails>();

    const handleOpenView = useCallback(() => {
        openMappedview(rowData);
    }, [openMappedview, rowData]);

    return (
        <button onClick={handleOpenView} type='button' className='rounded-md p-2 transition hover:bg-muted' title='View Group Details'>
            <Eye className='h-4 w-4 text-blue-600' />
        </button>
    );
}

/* --------------------------------
   ACTION BUTTONS CELL
-------------------------------- */
function ActionButtonsCell({ rowData }: { rowData: IPromotionalGroupDetails }) {
    const { openToggleForm } = useFormContext<IPromotionalGroupDetails>();

    const handleToggle = useCallback(() => {
        openToggleForm(rowData);
    }, [openToggleForm, rowData]);

    return (
        <div className='flex justify-center gap-1'>
            <MappingCell rowData={rowData} />
            <ActionButtons rowData={rowData} buttons={{ toggle: true }} onToggle={handleToggle} toggleConditionKey='empsG_ActiveFlag' />
        </div>
    );
}
