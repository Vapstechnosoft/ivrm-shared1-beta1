'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { SalaryReportRecord } from '@/types/hrms/reports/cumulative-salary-report';
import type { ColumnDef } from '@tanstack/react-table';

// Cumulative Summary
export interface CumulativeSummary {
    Cumulative: string;
    totalEmployees: number;
    totalBasicSalary: number;
    totalGrossSalary: number;
    totalDeductions: number;
    totalNetSalary: number;
    averageNetSalary: number;
    highestSalary: number;
    lowestSalary: number;
}

// Table columns for main salary records
export const CumulativeSalaryColumns: ColumnDef<SalaryReportRecord>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL.No.' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='text-center'>{continuousIndex}</div>;
        },
        enableSorting: false,
        enableHiding: false,
        size: 80
    },
    {
        accessorKey: 'HRME_EmployeeCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Code' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('HRME_EmployeeCode')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'employeeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Name' />,
        cell: ({ row }) => <div>{row.getValue('employeeName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'designation',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Designation' />,
        cell: ({ row }) => <div className='text-sm'>{row.getValue('designation')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'basic',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Basic Salary' />,
        cell: ({ row }) => <div>₹{(row.getValue('basic') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'grossEarning',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Gross Salary' />,
        cell: ({ row }) => <div>₹{(row.getValue('grossEarning') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'grossDeduction',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Deductions' />,
        cell: ({ row }) => <div className='text-red-600'>₹{(row.getValue('grossDeduction') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'netSalary',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Net Salary' />,
        cell: ({ row }) => <div className='font-semibold text-green-600'>₹{(row.getValue('netSalary') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'presentDays',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Present Days' />,
        cell: ({ row }) => <div className='text-center'>{row.original.leaveDedDays ? 30 - row.original.leaveDedDays : '-'}</div>,
        enableSorting: true,
        enableHiding: true
    }
];

// Cumulative summary columns
export const CumulativeSummaryColumns: ColumnDef<CumulativeSummary>[] = [
    {
        accessorKey: 'Cumulative',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Cumulative' />,
        cell: ({ row }) => <div className='font-semibold'>{row.getValue('Cumulative')}</div>,
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'totalEmployees',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Employees' />,
        cell: ({ row }) => <div className='text-center'>{row.getValue('totalEmployees')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'totalBasicSalary',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Basic Salary' />,
        cell: ({ row }) => <div>₹{(row.getValue('totalBasicSalary') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'totalNetSalary',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Net Salary' />,
        cell: ({ row }) => (
            <div className='font-semibold text-green-600'>₹{(row.getValue('totalNetSalary') as number).toLocaleString()}</div>
        ),
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'averageNetSalary',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Average Net Salary' />,
        cell: ({ row }) => <div>₹{(row.getValue('averageNetSalary') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'highestSalary',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Highest Salary' />,
        cell: ({ row }) => <div className='text-blue-600'>₹{(row.getValue('highestSalary') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'lowestSalary',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Lowest Salary' />,
        cell: ({ row }) => <div className='text-orange-600'>₹{(row.getValue('lowestSalary') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    }
];
