'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';
// Employee Loan Record
export interface EmployeeLoanRecord {
    id?: number;
    createdAt?: string;
    employeeCode: string;
    employeeName: string;
    groupType: string;
    department: string;
    designation: string;
    loanApplicationDate: string;
    loanType: 'Personal Loan' | 'Home Loan' | 'Vehicle Loan' | 'Education Loan' | 'Emergency Loan' | 'Medical Loan';
    loanAmount: number;
    approvedAmount: number;
    interestRate: number;
    loanTenure: number; // in months
    emiAmount: number;
    loanStartDate: string;
    loanEndDate: string;
    totalInterest: number;
    totalPayableAmount: number;
    paidAmount: number;
    remainingAmount: number;
    paidEMIs: number;
    remainingEMIs: number;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Active' | 'Completed' | 'Defaulted';
    approvalDate: string;
    approvedBy: string;
    guarantor: string;
    loanPurpose: string;
    month: string;
    year: string;
    basicSalary: number;
    loanToSalaryRatio: number;
}
// Loan Type Summary
export interface LoanTypeSummary {
    loanType: string;
    totalRequests: number;
    totalAmount: number;
    approvedRequests: number;
    approvedAmount: number;
    activeLoans: number;
    completedLoans: number;
    averageInterestRate: number;
    totalInterest: number;
}
// Main table columns
export const loanReportColumns: ColumnDef<EmployeeLoanRecord>[] = [
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
        cell: ({ row }) => <div className='text-sm'>{row.getValue('department')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'loanType',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Loan Type' />,
        cell: ({ row }) => {
            const type = row.getValue('loanType') as string;
            return (
                <Badge variant='outline' className='text-xs'>
                    {type}
                </Badge>
            );
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'loanAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Loan Amount' />,
        cell: ({ row }) => <div>₹{(row.getValue('loanAmount') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'approvedAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Approved Amount' />,
        cell: ({ row }) => <div className='text-green-600'>₹{(row.getValue('approvedAmount') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'interestRate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Interest Rate' />,
        cell: ({ row }) => <div>{row.getValue('interestRate')}%</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'emiAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='EMI Amount' />,
        cell: ({ row }) => <div className='text-blue-600'>₹{(row.getValue('emiAmount') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'remainingAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Remaining Amount' />,
        cell: ({ row }) => <div className='text-orange-600'>₹{(row.getValue('remainingAmount') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const variant =
                status === 'Approved' || status === 'Active'
                    ? 'default'
                    : status === 'Pending'
                      ? 'secondary'
                      : status === 'Rejected' || status === 'Defaulted'
                        ? 'destructive'
                        : status === 'Completed'
                          ? 'default'
                          : 'outline';
            return <Badge variant={variant}>{status}</Badge>;
        },
        enableSorting: true,
        enableHiding: true
    }
];
// Loan type summary columns
export const loanTypeSummaryColumns: ColumnDef<LoanTypeSummary>[] = [
    {
        accessorKey: 'loanType',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Loan Type' />,
        cell: ({ row }) => <div className='font-semibold'>{row.getValue('loanType')}</div>,
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'totalRequests',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Requests' />,
        cell: ({ row }) => <div className='text-center'>{row.getValue('totalRequests')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'totalAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Amount' />,
        cell: ({ row }) => <div>₹{(row.getValue('totalAmount') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'approvedRequests',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Approved Requests' />,
        cell: ({ row }) => <div className='text-center text-green-600'>{row.getValue('approvedRequests')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'activeLoans',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Active Loans' />,
        cell: ({ row }) => <div className='text-center text-blue-600'>{row.getValue('activeLoans')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'averageInterestRate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Avg. Interest Rate' />,
        cell: ({ row }) => <div>{row.getValue('averageInterestRate')}%</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'totalInterest',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Interest' />,
        cell: ({ row }) => <div className='text-purple-600'>₹{(row.getValue('totalInterest') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    }
];
