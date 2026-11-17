'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { BaseEntity } from '@/lib/localdb';
import type { ColumnDef } from '@tanstack/react-table';
export interface GroupType extends BaseEntity {
    groupType: string;
    groupCode: string;
    order: number;
    isActive: boolean;
}
export interface Department extends BaseEntity {
    departmentName: string;
    internalTrainingHours: string;
    order: number;
    isActive: boolean;
}
export interface Designation extends BaseEntity {
    designationName: string;
    basicAmount: string;
    sanctionedSeats: string;
    displaySanctionedSeats: boolean;
    order: number;
    isActive: boolean;
}
export interface EmployeeContribution extends BaseEntity {
    id: number;
    employeeCode: string;
    employeeName: string;
    groupTypeId: number;
    departmentId: number;
    designationId: number;
    departmentName: string;
    designationName: string;
    contributionType: 'Earning' | 'Deduction';
    contributionHead: string;
    monthlyAmount: number;
    contributionDate: string;
    pfContribution: number;
    esiContribution: number;
    professionalTax: number;
    totalContribution: number;
    cumulativeContribution: number;
}
export const employeeContributionColumns: ColumnDef<EmployeeContribution>[] = [
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
        accessorKey: 'departmentName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Department' />,
        cell: ({ row }) => <div>{row.getValue('departmentName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'designationName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Designation' />,
        cell: ({ row }) => <div>{row.getValue('designationName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'contributionHead',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Contribution Head' />,
        cell: ({ row }) => <div>{row.getValue('contributionHead')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'monthlyAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Monthly Amount' />,
        cell: ({ row }) => <div>₹{(row.getValue('monthlyAmount') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'pfContribution',
        header: ({ column }) => <DataTableColumnHeader column={column} title='PF Contribution' />,
        cell: ({ row }) => <div>₹{(row.getValue('pfContribution') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'esiContribution',
        header: ({ column }) => <DataTableColumnHeader column={column} title='ESI Contribution' />,
        cell: ({ row }) => <div>₹{(row.getValue('esiContribution') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'professionalTax',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Professional Tax' />,
        cell: ({ row }) => <div>₹{(row.getValue('professionalTax') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'totalContribution',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Contribution' />,
        cell: ({ row }) => <div className='font-semibold'>₹{(row.getValue('totalContribution') as number).toLocaleString()}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'cumulativeContribution',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Cumulative' />,
        cell: ({ row }) => (
            <div className='font-semibold text-blue-600'>₹{(row.getValue('cumulativeContribution') as number).toLocaleString()}</div>
        ),
        enableSorting: true,
        enableHiding: true
    }
];
