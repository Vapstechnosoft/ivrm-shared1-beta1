// _components/columns.tsx
'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { feeTransactionWaivedOffGrid } from '@/types/fees/transactions/transactions';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const FeeTransactionWaivedOff: ColumnDef<feeTransactionWaivedOffGrid>[] = [
    {
        id: 'fmgM_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl. No' className='pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex || 0;
            const pageSize = table.getState().pagination.pageSize || 10;
            return <div className='pl-6'>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },

    {
        accessorKey: 'amsT_FirstName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Student Name' />,
        cell: ({ row }) => {
            const first = row.original.amsT_FirstName || '';
            const middle = row.original.amsT_MiddleName || '';
            const last = row.original.amsT_LastName || '';

            return <div>{`${first} ${middle} ${last}`.trim()}</div>;
        }
    },

    {
        accessorKey: 'fmH_FeeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Fee Name' />,
        cell: ({ row }) => <div>{row.getValue('fmH_FeeName')}</div>
    },

    {
        accessorKey: 'ftI_Name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Installment' />,
        cell: ({ row }) => <div>{row.getValue('ftI_Name')}</div>
    },

    {
        accessorKey: 'fswO_WaivedOffAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Amount' />,
        cell: ({ row }) => <div>{row.getValue('fswO_WaivedOffAmount')}</div>
    },

    {
        accessorKey: 'fswO_Date',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Date' />,
        cell: ({ row }) => (
            <div>
                {new Date(row.getValue('fswO_Date')).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })}
            </div>
        )
    },

    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-start' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
        enableSorting: false
    }
];

function formatDate(dateString: string) {
    if (!dateString || dateString === '0001-01-01T00:00:00') return '-';
    return new Date(dateString).toLocaleDateString();
}
function ActionButtonsCell({
    rowData
}: {
    rowData: feeTransactionWaivedOffGrid;
}) {
    const { openDeleteForm } = useFormContext<feeTransactionWaivedOffGrid>();
    const { openEditForm } = useFormContext<feeTransactionWaivedOffGrid>();

    const handleDelete = useCallback((data: feeTransactionWaivedOffGrid) => openDeleteForm?.(data), [openDeleteForm]);
    const handleEdit = useCallback((data: feeTransactionWaivedOffGrid) => openEditForm?.(data), [openEditForm]);

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ delete: true, edit: true }}
            onDelete={handleDelete}
            onEdit={handleEdit}
            toggleConditionKey='fycC_ActiveFlag'
        />
    );
}
