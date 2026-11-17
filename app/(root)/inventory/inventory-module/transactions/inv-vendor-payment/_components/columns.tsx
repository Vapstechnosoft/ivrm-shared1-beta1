'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { InvVendorPayment } from '@/types/inventory/transactions/inv-vendor-payment';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';
import { formatDate } from 'date-fns';

export const invVendorPaymentColumns: ColumnDef<InvVendorPayment>[] = [
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
        accessorKey: 'invmS_SupplierName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Supplier' />,
        cell: ({ row }) => <div>{row.getValue('invmS_SupplierName')}</div>
    },
    {
        accessorKey: 'invspT_PaymentDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Payment Date' />,
        cell: ({ row }) => {
            const date = row.getValue('invspT_PaymentDate') as string;
            return <div>{date ? formatDate(new Date(date), 'dd-MM-yyyy') : '-'}</div>;
        }
    },
    {
        accessorKey: 'invspT_ModeOfPayment',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Mode Of Payment' />,
        cell: ({ row }) => <div>{row.getValue('invspT_ModeOfPayment')}</div>
    },
    {
        accessorKey: 'invspT_ChequeDDNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Reference / Cheque No' />,
        cell: ({ row }) => {
            const ref = row.original.invspT_PaymentReference;
            const cheque = row.original.invspT_ChequeDDNo;
            const bank = row.original.invspT_BankName;
            return (
                <div className="flex flex-col text-xs">
                    <span>{cheque || ref || '-'}</span>
                    {bank && <span className="text-muted-foreground">{bank}</span>}
                </div>
            );
        }
    },
    {
        accessorKey: 'invspT_Amount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Amount' />,
        cell: ({ row }) => <div className="text-right">{row.getValue('invspT_Amount')}</div>
    },
    {
        accessorKey: 'invspT_Remarks',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Remarks' />,
        cell: ({ row }) => <div>{row.getValue('invspT_Remarks')}</div>
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsClient rowData={row.original} />
    }
];

function ActionButtonsClient({ rowData }: { rowData: InvVendorPayment }) {
    const { openEditForm, openToggleForm } = useFormContext<InvVendorPayment>();

    const handleEdit = useCallback(() => openEditForm(rowData), [openEditForm, rowData]);
    const handleToggle = useCallback(() => openToggleForm(rowData), [openToggleForm, rowData]);

    return (
        <div className='flex justify-center gap-2'>
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: true, delete: false, toggle: true }}
                onEdit={handleEdit}
                onToggle={handleToggle}
                toggleConditionKey='invspT_ActiveFlg'
            />
        </div>
    );
}
