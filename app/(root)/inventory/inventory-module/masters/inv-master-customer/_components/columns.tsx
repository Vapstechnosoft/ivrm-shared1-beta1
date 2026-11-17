'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IInvMasterCustomer } from '@/types/inventory/masters/inv-master-customer';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const invMasterCustomerColumns: ColumnDef<IInvMasterCustomer>[] = [
    {
        accessorKey: 'sno',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL.No.' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
    },
    {
        accessorKey: 'invmC_CustomerName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Customer Name' />,
        cell: ({ row }) => <div>{row.getValue('invmC_CustomerName')}</div>,
    },
    {
        accessorKey: 'invmC_CustomerContactPerson',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Contact Person' />,
        cell: ({ row }) => <div>{row.getValue('invmC_CustomerContactPerson')}</div>,
    },
    {
        accessorKey: 'invmC_CustomerContactNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Contact No.' />,
        cell: ({ row }) => <div>{row.getValue('invmC_CustomerContactNo')}</div>,
    },
    {
        accessorKey: 'invmC_CustomerAddress',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Address' />,
        cell: ({ row }) => <div className="truncate max-w-[200px]" title={row.getValue('invmC_CustomerAddress')}>{row.getValue('invmC_CustomerAddress')}</div>,
    },
    {
        accessorKey: 'invmC_ActiveFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => {
            const status = row.original.invmC_ActiveFlg;
            return (
                <Badge variant={status ? 'default' : 'destructive'} className={status ? 'bg-purple-600' : ''}>
                    {status ? 'Active' : 'Inactive'}
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        cell: ({ row }) => <CustomerActionButtons rowData={row.original} />,
        enableSorting: false,
    },
];

function CustomerActionButtons({ rowData }: { rowData: IInvMasterCustomer }) {
    const { openEditForm, openToggleForm } = useFormContext<IInvMasterCustomer>();

    const handleEdit = useCallback(() => openEditForm(rowData), [openEditForm, rowData]);
    // const handleDelete = useCallback(() => openDeleteForm(rowData), [openDeleteForm, rowData]); // Using toggle for deactivate

    const handleToggle = useCallback(() => {
        // We can just call the mutation directly or open a confirmation. 
        // The ActionButtons component handles standard confirmation if we pass onToggle.
        // Actually, ActionButtons usually takes onToggle and shows a dialog confirmation internal or emitting event.
        // Let's rely on standard ActionButtons behavior.
        openToggleForm(rowData);
    }, [openToggleForm, rowData]);

    return (
        <div className='flex justify-center gap-2'>
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: true, delete: false, toggle: true, view: false }}
                onEdit={handleEdit}
                onToggle={handleToggle}
                toggleConditionKey='invmC_ActiveFlg'
            />
        </div>
    );
}
