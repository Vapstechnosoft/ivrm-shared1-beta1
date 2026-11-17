'use client';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
export interface InterviewerFeedback {
    id: number;
    candidateName: string;
    interviewDate: string;
    interviewerName: string;
    rating: string;
    recommendation: string;
}
export const interviewerFeedbackColumns: ColumnDef<InterviewerFeedback>[] = [
    {
        id: 'serialNumber',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
        cell: ({ row }) => <div className='font-medium'>{row.index + 1}</div>,
        enableSorting: false
    },
    {
        accessorKey: 'candidateName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Candidate Name' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('candidateName')}</div>
    },
    {
        accessorKey: 'interviewDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Interview Date' />,
        cell: ({ row }) => <div>{new Date(row.getValue('interviewDate')).toLocaleDateString()}</div>
    },
    {
        accessorKey: 'interviewerName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Interviewer' />,
        cell: ({ row }) => <div>{row.getValue('interviewerName')}</div>
    },
    {
        accessorKey: 'rating',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Rating' />,
        cell: ({ row }) => <div>{row.getValue('rating')}</div>
    },
    {
        accessorKey: 'recommendation',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Recommendation' />,
        cell: ({ row }) => <div>{row.getValue('recommendation')}</div>
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: () => (
            <div className='flex items-center gap-2'>
                <Button variant='ghost' size='sm' className='text-blue-600 hover:text-blue-800'>
                    <Edit className='h-4 w-4' />
                </Button>
                <Button variant='ghost' size='sm' className='text-red-600 hover:text-red-800'>
                    <Trash2 className='h-4 w-4' />
                </Button>
            </div>
        )
    }
];
