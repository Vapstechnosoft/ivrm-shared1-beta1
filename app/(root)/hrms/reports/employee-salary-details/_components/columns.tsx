'use client';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { BaseEntity } from '@/lib/localdb';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
export interface MonthlySalaryDetail extends BaseEntity {
    id: number;
    month: string;
    year: string;
    netSalary: number;
}
export const getMonthlySalaryDetailColumns = (
    onViewDetails: (monthData: MonthlySalaryDetail) => void
): ColumnDef<MonthlySalaryDetail>[] => [
        {
            accessorKey: 'id',
            header: ({ column }) => <DataTableColumnHeader column={column} title='SL. No.' />,
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
            accessorKey: 'month',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Month' />,
            cell: ({ row }) => <div className='font-medium'>{row.getValue('month')}</div>,
            enableSorting: true,
            enableHiding: true
        },
        {
            accessorKey: 'netSalary',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Net Salary' />,
            cell: ({ row }) => <div className='font-semibold'>₹{(row.getValue('netSalary') as number).toLocaleString()}</div>,
            enableSorting: true,
            enableHiding: true
        },
        {
            id: 'viewDetails',
            header: 'View Details',
            cell: ({ row }) => (
                <Button variant='ghost' size='sm' onClick={() => onViewDetails(row.original)} className='text-blue-600 hover:text-blue-700'>
                    <Eye className='h-4 w-4' />
                </Button>
            ),
            enableSorting: false,
            enableHiding: false
        }
    ];
