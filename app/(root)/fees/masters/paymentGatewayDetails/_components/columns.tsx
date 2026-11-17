'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterPaymentGatewayList } from '@/types/fees/masters/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const paymentgatewaydetailsColumns: ColumnDef<IMasterPaymentGatewayList>[] = [
    // {
    //     id: 'select',
    //     header: ({ table }) => (
    //         <Checkbox
    //             checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
    //             onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //             aria-label='Select all'
    //         />
    //     ),
    //     cell: ({ row }) => (
    //         <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' />
    //     ),
    //     enableSorting: false,
    //     enableHiding: false,
    //     size: 24
    // },
    {
        accessorKey: 'fpgD_Id',
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
        accessorKey: 'fpgD_MerchantId',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Merchant Id' />,
        cell: ({ row }) => <div>{row.getValue('fpgD_MerchantId')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fpgD_SaltKey',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Salt Key' />,
        cell: ({ row }) => <div>{row.getValue('fpgD_SaltKey')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fpgD_AuthorisationKey',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Merchant Key' />,
        cell: ({ row }) => <div>{row.getValue('fpgD_AuthorisationKey')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'impG_PGName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Gateway Name' />,
        cell: ({ row }) => <div>{row.getValue('impG_PGName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fpgD_AccNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Account Number' />,
        cell: ({ row }) => <div>{row.getValue('fpgD_AccNo')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fpgD_SubMerchantId',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sub Merchant Id' />,
        cell: ({ row }) => <div>{row.getValue('fpgD_SubMerchantId')}</div>,
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

function ActionButtonsCell({ rowData }: { rowData: IMasterPaymentGatewayList }) {
    const { openEditForm, openToggleForm,openDeleteForm } = useFormContext<IMasterPaymentGatewayList>();

    const handleEdit = useCallback(
        (data: IMasterPaymentGatewayList) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterPaymentGatewayList) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );


    const handleDelete = useCallback(
        (data: IMasterPaymentGatewayList) => {
            openDeleteForm(data);
        },
        [openDeleteForm]
    );

    const convertedRowData = {
        ...rowData,
        fpgD_PGActiveFlag: rowData.fpgD_PGActiveFlag === '1' // true if '1', false if '0'
    };

    return (
        <ActionButtons
            // rowData={rowData}
            rowData={convertedRowData}
            buttons={{ edit: true, toggle: true, delete: true }}
            onEdit={handleEdit}
            onToggle={handleToggle}
            toggleConditionKey='fpgD_PGActiveFlag'
            onDelete={handleDelete}
        />
    );
}
