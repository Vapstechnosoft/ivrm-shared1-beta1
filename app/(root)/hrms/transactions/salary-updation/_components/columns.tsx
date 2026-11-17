'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { SalaryUpdationItem } from '@/types/hrms/salary-updation';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ActionsCell } from './actions-cell';
export const salaryUpdationColumns: ColumnDef<SalaryUpdationItem>[] = [
    {
        accessorKey: 'HRME_EmployeeCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Code' />,
        cell: ({ row }) => <div className='font-medium'>{row.original.HRME_EmployeeCode}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'employeeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Name' />,
        cell: ({ row }) => {
            const fullName = [row.original.HRME_EmployeeFirstName, row.original.HRME_EmployeeMiddleName, row.original.HRME_EmployeeLastName]
                .filter(Boolean)
                .join(' ');
            return <div className='font-medium'>{fullName}</div>;
        },
        enableSorting: true
    },
    {
        accessorKey: 'HRESU_OldSalary',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Old Salary' />,
        cell: ({ row }) => <div className='text-right font-medium'>₹{row.original.HRESU_OldSalary.toFixed(2)}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'HRESU_NewSalary',
        header: ({ column }) => <DataTableColumnHeader column={column} title='New Salary' />,
        cell: ({ row }) => <div className='text-right font-medium'>₹{row.original.HRESU_NewSalary.toFixed(2)}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'difference',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Difference' />,
        cell: ({ row }) => {
            const diff = row.original.HRESU_NewSalary - row.original.HRESU_OldSalary;
            const isPositive = diff >= 0;
            return (
                <div className={`text-right font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}₹{diff.toFixed(2)}
                </div>
            );
        },
        enableSorting: false
    },
    {
        accessorKey: 'HRESU_EffectiveDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Effective Date' />,
        cell: ({ row }) => {
            const date = row.original.HRESU_EffectiveDate;
            return <div>{date ? format(new Date(date), 'dd MMM yyyy') : '-'}</div>;
        },
        enableSorting: true
    },
    {
        accessorKey: 'HRESU_Remarks',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Remarks' />,
        cell: ({ row }) => <div>{row.original.HRESU_Remarks || '-'}</div>,
        enableSorting: false
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => <ActionsCell row={row} />
    }
];
