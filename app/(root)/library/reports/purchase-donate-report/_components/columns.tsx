'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { IPurchaseDonateReportGridData } from '@/types/library/reports/purchase-donate-report';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export const columns: ColumnDef<IPurchaseDonateReportGridData>[] = [
    {
        id: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div>{continuousIndex}</div>;
        },
        enableHiding: true,
        enableSorting: false
    },
    {
        accessorKey: 'lmb_BookType',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Book Type' />,
        cell: ({ row }) => <div>{row.getValue('lmb_BookType')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmbano_AccessionNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Accession No' />,
        cell: ({ row }) => <div>{row.getValue('lmbano_AccessionNo')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmb_BookTitle',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Book Title' />,
        cell: ({ row }) => <div>{row.getValue('lmb_BookTitle')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Author Name' />,
        cell: ({ row }) => <div>{row.getValue('name')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmv_VendorName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Vendor Name' />,
        cell: ({ row }) => <div>{row.getValue('lmv_VendorName')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmb_BillNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Bill No' />,
        cell: ({ row }) => <div>{row.getValue('lmb_BillNo')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmb_VoucherNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Voucher No' />,
        cell: ({ row }) => <div>{row.getValue('lmb_VoucherNo')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmb_PurchaseDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Purchase Date' />,
        cell: ({ row }) => {
            const date = row.getValue('lmb_PurchaseDate') as string;
            return <div>{date ? format(new Date(date), 'dd/MM/yyyy') : ''}</div>;
        },
        enableSorting: true
    },
    {
        accessorKey: 'lmb_NoOfCopies',
        header: ({ column }) => <DataTableColumnHeader column={column} title='No Of Copies' />,
        cell: ({ row }) => <div>{row.getValue('lmb_NoOfCopies')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmb_Price',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Price' />,
        cell: ({ row }) => <div>{row.getValue('lmb_Price')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmb_Discount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Discount' />,
        cell: ({ row }) => <div>{row.getValue('lmb_Discount')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmb_NetPrice',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Net Amount' />,
        cell: ({ row }) => <div>{row.getValue('lmb_NetPrice')}</div>,
        enableSorting: true
    }
];
