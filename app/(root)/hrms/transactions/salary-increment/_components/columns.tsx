'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { SalaryIncrementGridItem } from '@/types/hrms/salary-increment';
import type { ColumnDef } from '@tanstack/react-table';
import { ActionsCell } from './actions-cell';
export const salaryIncrementColumns: ColumnDef<SalaryIncrementGridItem>[] = [
    {
        id: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL.No.' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div className='text-center font-medium'>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false
    },
    {
        accessorKey: 'EmployeeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Name' />,
        cell: ({ row }) => <div className='font-medium'>{row.original.EmployeeName || '-'}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'HRMD_DepartmentName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Department' />,
        cell: ({ row }) => <div>{row.original.HRMD_DepartmentName || '-'}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'HREIC_IncrementDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Increment Date' />,
        cell: ({ row }) => {
            const date = row.original.HREIC_IncrementDate;
            if (!date) return <div className='pr-4 text-center'>-</div>;
            try {
                const dateObj = typeof date === 'string' ? new Date(date) : date;
                return <div>{dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>;
            } catch {
                return <div>{String(date)}</div>;
            }
        },
        enableSorting: true
    },
    {
        accessorKey: 'HRMED_Name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Earning Head' />,
        cell: ({ row }) => <div className='justify-center'>{row.original.HRMED_Name || '-'}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'PreviousAmount',
        header: ({ column }) => (
            <div className='flex w-full justify-end'>
                <DataTableColumnHeader column={column} title='Previous Amount' className='justify-end [&_button]:ml-auto' />
            </div>
        ),
        cell: ({ row }) => {
            const amount = row.original.PreviousAmount || 0;
            return (
                <div className='pr-4 text-center'>
                    <span className='font-medium'>₹{Number(amount).toFixed(2)}</span>
                </div>
            );
        },
        enableSorting: true
    },
    {
        accessorKey: 'Amount',
        header: ({ column }) => (
            <div className='flex w-full justify-end'>
                <DataTableColumnHeader column={column} title='Percentage/Amount' className='justify-end [&_button]:ml-auto' />
            </div>
        ),
        cell: ({ row }) => {
            const amount = row.original.Amount ?? 0;
            return (
                <div className='pr-4 text-center'>
                    <span className='font-medium'>₹{Number(amount).toFixed(2)}</span>
                </div>
            );
        },
        enableSorting: true
    },
    {
        accessorKey: 'Flag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Flag' />,
        cell: ({ row }) => <div className='justify-center'>{row.original.Flag || '-'}</div>,
        enableSorting: true
    },
    {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => <ActionsCell row={row} />,
        enableSorting: false
    }
];
