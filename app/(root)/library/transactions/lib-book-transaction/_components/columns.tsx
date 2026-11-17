'use client';

import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { IBookReturnList } from '@/types/library/transactions/book-return';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';

// Reusing IBookReturnList as the structure is likely identical for transaction grid
export const BookIssueColumns: ColumnDef<IBookReturnList>[] = [
    {
        id: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div>{continuousIndex}</div>;
        },
        enableHiding: true,
        enableSorting: false
    },
    {
        accessorKey: 'memberName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Member Name' />,
        cell: ({ row }) => {
            const original = row.original;
            return (
                <div>
                    {original.amsT_FirstName || original.hrmE_EmployeeFirstName || original.hrmD_DepartmentName || original.lbtR_GuestName}
                </div>
            );
        },
        enableSorting: true
    },
    {
        accessorKey: 'lmbanO_AccessionNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Accession No.' />,
        cell: ({ row }) => <div>{row.getValue('lmbanO_AccessionNo')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmB_BookTitle',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Book Title' />,
        cell: ({ row }) => <div>{row.getValue('lmB_BookTitle')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'issue_Date',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Issue Date' />,
        cell: ({ row }) => {
            const date = row.getValue('issue_Date') as string;
            return <div>{date ? format(new Date(date), 'dd/MM/yyyy') : '-'}</div>;
        },
        enableSorting: true
    },
    {
        accessorKey: 'due_Date',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Due Date' />,
        cell: ({ row }) => {
            const date = row.getValue('due_Date') as string;
            return <div>{date ? format(new Date(date), 'dd/MM/yyyy') : '-'}</div>;
        },
        enableSorting: true
    },
    {
        accessorKey: 'return_Date',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Return Date' />,
        cell: ({ row }) => {
            const date = row.getValue('return_Date') as string;
            return <div>{date ? format(new Date(date), 'dd/MM/yyyy') : '-'}</div>;
        },
        enableSorting: true
    },
    {
        accessorKey: 'book_Trans_Status',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => <div>{row.getValue('book_Trans_Status')}</div>,
        enableSorting: true
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        cell: ({ row }) => {
            return (
                <div className='flex justify-center gap-2'>
                    <Button variant='ghost' size='icon' className='h-8 w-8 text-blue-500'>
                        <Edit className='h-4 w-4' />
                    </Button>
                    <Button variant='ghost' size='icon' className='h-8 w-8 text-red-500'>
                        <Trash2 className='h-4 w-4' />
                    </Button>
                </div>
            );
        },
        enableSorting: false
    }
];
