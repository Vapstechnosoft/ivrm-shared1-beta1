'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ILibTransactionReportGridData } from '@/types/library/reports/lib-transaction-report';
import type { ColumnDef } from '@tanstack/react-table';

export const LibTransactionClassColumns: ColumnDef<ILibTransactionReportGridData>[] = [
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
        accessorKey: 'ASMCL_ClassName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='CLASS : SECTION' />,
        cell: ({ row }) => {
            const cls = row.original.ASMCL_ClassName;
            const sec = row.original.ASMC_SectionName;

            if (cls === 'TOTAL') {
                return <div className='font-bold'>TOTAL</div>;
            }
            return (
                <div>
                    {cls} : {sec}
                </div>
            );
        },
        enableSorting: true
    },
    {
        accessorKey: 'seccount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='BOOKS ISSUED' />,
        cell: ({ row }) => {
            const cls = row.original.ASMCL_ClassName;
            return <div className={cls === 'TOTAL' ? 'font-bold' : ''}>{row.getValue('seccount')}</div>;
        },
        enableSorting: true
    }
];

export const LibTransactionStatusColumns: ColumnDef<ILibTransactionReportGridData>[] = [
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
        accessorKey: 'LBTR_Status',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Transaction Type' />,
        cell: ({ row }) => <div>{row.original.LBTR_Status || 'TOTAL'}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'seccount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='NO. OF COPIES' />,
        cell: ({ row }) => <div className={!row.original.LBTR_Status ? 'font-bold' : ''}>{row.getValue('seccount')}</div>,
        enableSorting: true
    }
];
