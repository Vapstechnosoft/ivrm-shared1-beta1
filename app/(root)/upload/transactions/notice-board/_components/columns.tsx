'use client';

import { Button } from '@/components/ui/button';
import type { INoticeBoard } from '@/schemas/upload/transactions/notice-board.schema';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye, Pencil, Trash2 } from 'lucide-react';

export const noticeBoardColumns: ColumnDef<INoticeBoard>[] = [
    {
        accessorKey: 'index',
        header: 'SL.NO',
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
    },
    {
        accessorKey: 'intB_Title',
        header: 'Notice Title',
        enableSorting: true,
    },
    {
        accessorKey: 'intB_Description',
        header: 'Description',
        enableSorting: true,
    },
    {
        accessorKey: 'intB_StartDate',
        header: 'Start Date',
        cell: ({ row }) => {
            const date = row.getValue('intB_StartDate') as string | Date;
            return date ? new Date(date).toLocaleDateString() : '';
        }
    },
    {
        accessorKey: 'intB_EndDate',
        header: 'End Date',
        cell: ({ row }) => {
            const date = row.getValue('intB_EndDate') as string | Date;
            return date ? new Date(date).toLocaleDateString() : '';
        }
    },
    {
        accessorKey: 'intB_DisplayDate',
        header: 'Display Date',
        cell: ({ row }) => {
            const date = row.getValue('intB_DisplayDate') as string | Date;
            return date ? new Date(date).toLocaleDateString() : '';
        }
    },
    {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => {
            const data = row.original;
            return (
                <div className='flex items-center gap-2'>
                    <Button variant='ghost' size='icon' className='text-primary hover:text-primary/80'>
                        <Eye className='h-4 w-4' />
                    </Button>
                    <Button variant='ghost' size='icon' className='text-primary hover:text-primary/80'>
                        <Pencil className='h-4 w-4' />
                    </Button>
                    <Button variant='ghost' size='icon' className={data.intB_ActiveFlag ? 'text-destructive hover:text-destructive/80' : 'text-green-600 hover:text-green-700'}>
                        {data.intB_ActiveFlag ? <Trash2 className='h-4 w-4' /> : 'Activate'}
                    </Button>
                </div>
            );
        },
    },
];
