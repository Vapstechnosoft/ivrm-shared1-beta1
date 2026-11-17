'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IInvMasterTax } from '@/types/inventory/masters/inv-master-tax';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useCallback } from 'react';

export const getInvMasterTaxColumns = (onViewLedger: (row: IInvMasterTax) => void): ColumnDef<IInvMasterTax>[] => [
    {
        accessorKey: 'sno',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL.No.' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false
    },
    {
        accessorKey: 'invmT_TaxName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Tax Name' />,
        cell: ({ row }) => <div>{row.getValue('invmT_TaxName')}</div>
    },
    {
        accessorKey: 'invmT_TaxAliasName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Alias Name' />,
        cell: ({ row }) => <div>{row.getValue('invmT_TaxAliasName')}</div>
    },
    {
        accessorKey: 'invmT_ActiveFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => {
            const status = row.original.invmT_ActiveFlg;
            return <Badge variant={status ? 'default' : 'destructive'}>{status ? 'Active' : 'Inactive'}</Badge>;
        }
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row) => row,
        enableSorting: false,
        cell: ({ row }) => <InvMasterTaxActionButtons rowData={row.original} onViewLedger={onViewLedger} />
    }
];

function InvMasterTaxActionButtons({
    rowData,
    onViewLedger
}: {
    rowData: IInvMasterTax;
    onViewLedger: (row: IInvMasterTax) => void;
}) {
    const { openEditForm, openToggleForm } = useFormContext<IInvMasterTax>();

    const handleViewLedger = useCallback(() => onViewLedger(rowData), [onViewLedger, rowData]);
    const handleEdit = useCallback(() => openEditForm(rowData), [openEditForm, rowData]);
    const handleToggle = useCallback(() => openToggleForm(rowData), [openToggleForm, rowData]);

    return (
        <div className='flex justify-center gap-2'>
            {/* View Ledger */}
            <button
                type='button'
                onClick={handleViewLedger}
                className='rounded-md p-2 transition hover:bg-muted'
                title='View Ledger Mapping'
            >
                <Eye className='h-4 w-4 text-blue-600' />
            </button>

            {/* Edit / Activate-Deactivate */}
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: true, delete: false, toggle: true }}
                onEdit={handleEdit}
                onToggle={handleToggle}
                toggleConditionKey='invmT_ActiveFlg'
            />
        </div>
    );
}
