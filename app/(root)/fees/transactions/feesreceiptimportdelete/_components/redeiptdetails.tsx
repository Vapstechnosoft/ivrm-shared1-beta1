'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { IFeeReceiptImportDelate } from '@/types/fees/transactions/transactions';
import type { ColumnDef } from '@tanstack/react-table';

export const feereceiptimportdeleteColumns: ColumnDef<IFeeReceiptImportDelate>[] = [
    {
        accessorKey: 'fyP_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl. No' className='w-full pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div className='w-full pl-6'>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'studentname',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Student Name' />,
        cell: ({ row }) => <div>{row.getValue('studentname')}</div>,
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'amst_admno',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Admission No' />,
        cell: ({ row }) => <div>{row.getValue('amst_admno')}</div>,
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'fyp_date',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Date' />,
        cell: ({ row }) => (
            <div>
                {new Date(row.getValue('fyp_date')).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })}
            </div>
        )
    },
    {
        accessorKey: 'fyp_receipt_no',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Receipt No' />,
        cell: ({ row }) => <div>{row.getValue('fyp_receipt_no')}</div>,
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'fyp_tot_amount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Amount' />,
        cell: ({ row }) => <div>₹{Number(row.getValue('fyp_tot_amount')).toLocaleString('en-IN')}</div>,
        enableSorting: false,
        enableHiding: false
    }
];
