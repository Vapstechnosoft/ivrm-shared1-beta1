'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';

// Department Salary Report data structure
export interface DepartmentSalaryRecord {
    id?: string;
    employeeCode: string;
    employeeName: string;
    groupType: string;
    department: string;
    designation: string;
    basicSalary: number;
    allowances: number;
    grossSalary: number;
    pfContribution: number;
    esiContribution: number;
    incomeTax: number;
    professionalTax: number;
    otherDeductions: number;
    totalDeductions: number;
    netSalary: number;
    overtimeAmount: number;
    bonusAmount: number;
    incrementAmount: number;
    workingDays: number;
    presentDays: number;
    absentDays: number;
    leavesTaken: number;
    month: string;
    year: string;
}

// Department Summary
export interface DepartmentSummary {
    department: string;
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
export const departmentSalaryColumns: ColumnDef<DepartmentSalaryRecord>[] = [
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
        accessorKey: 'employeeCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Code' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('employeeCode')}</div>,
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
        accessorKey: 'department',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Department' />,
        cell: ({ row }) => <div className='font-medium text-sm'>{row.getValue('department')}</div>,
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
        accessorKey: 'basicSalary',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Basic Salary' />,
        cell: ({ row }) => <div>₹{(row.getValue('basicSalary') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'grossSalary',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Gross Salary' />,
        cell: ({ row }) => <div>₹{(row.getValue('grossSalary') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'totalDeductions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Deductions' />,
        cell: ({ row }) => <div className='text-red-600'>₹{(row.getValue('totalDeductions') as number).toLocaleString()}</div>,
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
        cell: ({ row }) => <div className='text-center'>{row.getValue('presentDays')}</div>,
        enableSorting: true,
        enableHiding: true
    }
];

// Department summary columns
export const departmentSummaryColumns: ColumnDef<DepartmentSummary>[] = [
    {
        accessorKey: 'department',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Department' />,
        cell: ({ row }) => <div className='font-semibold'>{row.getValue('department')}</div>,
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
