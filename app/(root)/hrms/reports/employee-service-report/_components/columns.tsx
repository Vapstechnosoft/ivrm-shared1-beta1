'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';
export interface ServiceHistoryRecord {
    period: string;
    designation: string;
    department: string;
    salary: number;
    performance: string;
}
export const serviceReportColumns: ColumnDef<ServiceHistoryRecord>[] = [
    {
        accessorKey: 'period',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Service Period' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('period')}</div>
    },
    {
        accessorKey: 'designation',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Designation' />,
        cell: ({ row }) => <div>{row.getValue('designation')}</div>
    },
    {
        accessorKey: 'department',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Department' />,
        cell: ({ row }) => <div>{row.getValue('department')}</div>
    },
    {
        accessorKey: 'salary',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Salary' />,
        cell: ({ row }) => <div>₹{(row.getValue('salary') as number).toLocaleString()}</div>
    },
    {
        accessorKey: 'performance',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Performance' />,
        cell: ({ row }) => <div>{row.getValue('performance')}</div>
    }
];
