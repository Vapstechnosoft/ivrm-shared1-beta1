'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { feeTransactionWaivedOffGrid } from '@/types/fees/transactions/transactions';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useCallback } from 'react';

export const uploadNoticeBoardColumns: ColumnDef<feeTransactionWaivedOffGrid>[] = [
    {
        id: 'id',
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
        header: ({ column }) => <DataTableColumnHeader column={column} title='Notice Title' />,
        cell: ({ row }) => {
            const first = row.original.amsT_FirstName || '';
            const middle = row.original.amsT_MiddleName || '';
            const last = row.original.amsT_LastName || '';

            return <div>{`${first} ${middle} ${last}`.trim()}</div>;
        }
    },

    {
        accessorKey: 'fmH_FeeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Description' />,
        cell: ({ row }) => <div>{row.getValue('fmH_FeeName')}</div>
    },

    {
        accessorKey: 'fswO_Date',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Start Date' />,
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
        accessorKey: 'fswO_WaivedOffAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='End Date' />,
        cell: ({ row }) => (
            <div>
                {new Date(row.getValue('fswO_WaivedOffAmount')).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })}
            </div>
        )
    },

    {
        accessorKey: 'fswO_FineFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Display Date' />,
        cell: ({ row }) => (
            <div>
                {new Date(row.getValue('fswO_FineFlg')).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })}
            </div>
        )
    },

    {
        accessorKey: 'Date',
        header: ({ column }) => <DataTableColumnHeader column={column} title='View Attachment' />,
        cell: () => <div></div>
    },

    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-start' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
        enableSorting: false
    }
];

function ActionButtonsCell({
    rowData
}: {
    rowData: feeTransactionWaivedOffGrid;
}) {
    const { openDeleteForm } = useFormContext<feeTransactionWaivedOffGrid>();
    const { openEditForm, openDetailsView } = useFormContext<feeTransactionWaivedOffGrid>();

    const handleDelete = useCallback((data: feeTransactionWaivedOffGrid) => openDeleteForm?.(data), [openDeleteForm]);
    const handleEdit = useCallback((data: feeTransactionWaivedOffGrid) => openEditForm?.(data), [openEditForm]);
    const handleView = useCallback(() => {
        openDetailsView(rowData);
    }, [openDetailsView, rowData]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button type='button' onClick={handleView} className='rounded-md p-2 transition hover:bg-muted' title='View Grade Details'>
                <Eye className='h-4 w-4 text-blue-600' />
            </button>
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: true, toggle: false, delete: true }}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}
