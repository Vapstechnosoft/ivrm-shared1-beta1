'use client';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye, Trash2 } from 'lucide-react';
export interface JobPostingListItem {
    id: number;
    jobTitle: string;
    department: string;
    position: string;
    location: string;
    status: string;
    postedDate: string;
    expiryDate: string;
}
export const jobPostingListColumns: ColumnDef<JobPostingListItem>[] = [
    {
        id: 'serialNumber',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
        cell: ({ row }) => <div className='font-medium'>{row.index + 1}</div>,
        enableSorting: false
    },
    {
        accessorKey: 'jobTitle',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Job Title' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('jobTitle')}</div>
    },
    {
        accessorKey: 'department',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Department' />,
        cell: ({ row }) => <div>{row.getValue('department')}</div>
    },
    {
        accessorKey: 'position',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Position' />,
        cell: ({ row }) => <div>{row.getValue('position')}</div>
    },
    {
        accessorKey: 'location',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Location' />,
        cell: ({ row }) => <div>{row.getValue('location')}</div>
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => <div>{row.getValue('status')}</div>
    },
    {
        accessorKey: 'postedDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Posted Date' />,
        cell: ({ row }) => <div>{new Date(row.getValue('postedDate')).toLocaleDateString()}</div>
    },
    {
        accessorKey: 'expiryDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Expiry Date' />,
        cell: ({ row }) => <div>{new Date(row.getValue('expiryDate')).toLocaleDateString()}</div>
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: () => (
            <div className='flex items-center gap-2'>
                <Button variant='ghost' size='sm' className='text-blue-600 hover:text-blue-800'>
                    <Eye className='h-4 w-4' />
                </Button>
                <Button variant='ghost' size='sm' className='text-red-600 hover:text-red-800'>
                    <Trash2 className='h-4 w-4' />
                </Button>
            </div>
        )
    }
];
