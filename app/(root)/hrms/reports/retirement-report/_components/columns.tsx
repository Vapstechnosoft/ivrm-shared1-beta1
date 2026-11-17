'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';
export interface RetirementRecord {
    id?: number;
    createdAt?: string;
    employeeCode: string;
    employeeName: string;
    fatherName: string;
    mobileNo: string;
    emailId: string;
    dateOfBirth: string;
    dateOfJoining: string;
    dateOfLeaving?: string;
    employeeType: string;
    department: string;
    designation: string;
    basicSalary: number;
    currentAge: number;
    serviceYears: number;
    retirementDate: string;
    yearsToRetirement: number;
    pfBalance: number;
    gratuityAmount: number;
    leaveBalance: number;
    status: 'Working' | 'Left' | 'Retired';
    retirementEligible: boolean;
}
// Header fields for selection
export const headerFields = [
    'Employee Code',
    'Employee Name',
    'Father Name',
    'Mobile No.',
    'Email Id',
    'Date Of Birth',
    'Employee Type',
    'Department',
    'Designation',
    'Date of Joining',
    'Date of Leaving',
    'Service Years',
    'Current Age',
    'Retirement Date',
    'PF Balance',
    'Gratuity Amount'
];
// Function to generate columns based on selected headers
export const getRetirementColumns = (selectedHeaders: string[]): ColumnDef<RetirementRecord>[] => {
    const baseColumns: ColumnDef<RetirementRecord>[] = [
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
        }
    ];
    // Add selected header columns
    selectedHeaders.forEach((header) => {
        switch (header) {
            case 'Employee Code':
                baseColumns.push({
                    accessorKey: 'employeeCode',
                    header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Code' />,
                    cell: ({ row }) => <div className='font-medium'>{row.getValue('employeeCode')}</div>,
                    enableSorting: true,
                    enableHiding: true
                });
                break;
            case 'Employee Name':
                baseColumns.push({
                    accessorKey: 'employeeName',
                    header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Name' />,
                    cell: ({ row }) => <div>{row.getValue('employeeName')}</div>,
                    enableSorting: true,
                    enableHiding: true
                });
                break;
            case 'Father Name':
                baseColumns.push({
                    accessorKey: 'fatherName',
                    header: ({ column }) => <DataTableColumnHeader column={column} title="Father's Name" />,
                    cell: ({ row }) => <div className='text-sm'>{row.getValue('fatherName')}</div>,
                    enableSorting: true,
                    enableHiding: true
                });
                break;
            case 'Mobile No.':
                baseColumns.push({
                    accessorKey: 'mobileNo',
                    header: ({ column }) => <DataTableColumnHeader column={column} title='Mobile No.' />,
                    cell: ({ row }) => <div className='font-mono text-sm'>{row.getValue('mobileNo')}</div>,
                    enableSorting: true,
                    enableHiding: true
                });
                break;
            case 'Email Id':
                baseColumns.push({
                    accessorKey: 'emailId',
                    header: ({ column }) => <DataTableColumnHeader column={column} title='Email Id' />,
                    cell: ({ row }) => <div className='text-sm'>{row.getValue('emailId')}</div>,
                    enableSorting: true,
                    enableHiding: true
                });
                break;
            case 'Date Of Birth':
                baseColumns.push({
                    accessorKey: 'dateOfBirth',
                    header: ({ column }) => <DataTableColumnHeader column={column} title='Date of Birth' />,
                    cell: ({ row }) => <div className='text-sm'>{new Date(row.getValue('dateOfBirth')).toLocaleDateString()}</div>,
                    enableSorting: true,
                    enableHiding: true
                });
                break;
            case 'Date of Joining':
                baseColumns.push({
                    accessorKey: 'dateOfJoining',
                    header: ({ column }) => <DataTableColumnHeader column={column} title='Date of Joining' />,
                    cell: ({ row }) => <div className='text-sm'>{new Date(row.getValue('dateOfJoining')).toLocaleDateString()}</div>,
                    enableSorting: true,
                    enableHiding: true
                });
                break;
            case 'Current Age':
                baseColumns.push({
                    accessorKey: 'currentAge',
                    header: ({ column }) => <DataTableColumnHeader column={column} title='Current Age' />,
                    cell: ({ row }) => <div className='text-center'>{row.getValue('currentAge')} years</div>,
                    enableSorting: true,
                    enableHiding: true
                });
                break;
            case 'Service Years':
                baseColumns.push({
                    accessorKey: 'serviceYears',
                    header: ({ column }) => <DataTableColumnHeader column={column} title='Service Years' />,
                    cell: ({ row }) => <div className='text-center'>{row.getValue('serviceYears')} years</div>,
                    enableSorting: true,
                    enableHiding: true
                });
                break;
            case 'Retirement Date':
                baseColumns.push({
                    accessorKey: 'retirementDate',
                    header: ({ column }) => <DataTableColumnHeader column={column} title='Retirement Date' />,
                    cell: ({ row }) => <div className='text-sm'>{new Date(row.getValue('retirementDate')).toLocaleDateString()}</div>,
                    enableSorting: true,
                    enableHiding: true
                });
                break;
            case 'PF Balance':
                baseColumns.push({
                    accessorKey: 'pfBalance',
                    header: ({ column }) => <DataTableColumnHeader column={column} title='PF Balance' />,
                    cell: ({ row }) => <div>₹{(row.getValue('pfBalance') as number).toLocaleString()}</div>,
                    enableSorting: true,
                    enableHiding: true
                });
                break;
            case 'Gratuity Amount':
                baseColumns.push({
                    accessorKey: 'gratuityAmount',
                    header: ({ column }) => <DataTableColumnHeader column={column} title='Gratuity Amount' />,
                    cell: ({ row }) => <div>₹{(row.getValue('gratuityAmount') as number).toLocaleString()}</div>,
                    enableSorting: true,
                    enableHiding: true
                });
                break;
            case 'Department':
                baseColumns.push({
                    accessorKey: 'department',
                    header: ({ column }) => <DataTableColumnHeader column={column} title='Department' />,
                    cell: ({ row }) => <div className='text-sm'>{row.getValue('department')}</div>,
                    enableSorting: true,
                    enableHiding: true
                });
                break;
            case 'Designation':
                baseColumns.push({
                    accessorKey: 'designation',
                    header: ({ column }) => <DataTableColumnHeader column={column} title='Designation' />,
                    cell: ({ row }) => <div className='text-sm'>{row.getValue('designation')}</div>,
                    enableSorting: true,
                    enableHiding: true
                });
                break;
            case 'Employee Type':
                baseColumns.push({
                    accessorKey: 'employeeType',
                    header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Type' />,
                    cell: ({ row }) => <div className='text-sm'>{row.getValue('employeeType')}</div>,
                    enableSorting: true,
                    enableHiding: true
                });
                break;
            case 'Date of Leaving':
                baseColumns.push({
                    accessorKey: 'dateOfLeaving',
                    header: ({ column }) => <DataTableColumnHeader column={column} title='Date of Leaving' />,
                    cell: ({ row }) => {
                        const value = row.getValue('dateOfLeaving') as string | undefined;
                        return <div className='text-sm'>{value ? new Date(value).toLocaleDateString() : '-'}</div>;
                    },
                    enableSorting: true,
                    enableHiding: true
                });
                break;
        }
    });
    // Always add status column
    baseColumns.push({
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const variant = status === 'Working' ? 'default' : status === 'Retired' ? 'secondary' : 'destructive';
            return <Badge variant={variant}>{status}</Badge>;
        },
        enableSorting: true,
        enableHiding: true
    });
    return baseColumns;
};
