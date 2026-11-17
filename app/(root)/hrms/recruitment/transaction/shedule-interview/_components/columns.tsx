'use client';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
export interface Interview {
    id: number;
    candidateName: string;
    candidateId: number;
    interviewDate: string;
    interviewTime: string;
    interviewRounds: string;
    interviewerName: string;
    interviewerId: number;
    interviewVenue: string;
    status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
    notifyByEmail: boolean;
    notifyBySMS: boolean;
    remarks?: string;
    createdDate: string;
    updatedDate?: string;
    createdAt: string;
}
interface InterviewColumnsProps {
    onEdit: (row: Interview) => void;
    onDelete: (row: Interview) => void;
}
export const getInterviewColumns = ({ onEdit, onDelete }: InterviewColumnsProps): ColumnDef<Interview>[] => [
    {
        id: 'sl',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL.NO' />,
        cell: ({ row }) => <div className='font-medium'>{row.index + 1}</div>,
        enableSorting: false
    },
    // TODO: Add other columns based on the entity fields
    {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => {
            const entity = row.original;
            return (
                <div className='flex items-center gap-2'>
                    <Button variant='outline' size='sm' onClick={() => onEdit(entity)}>
                        <Edit className='h-4 w-4' />
                    </Button>
                    <Button variant='outline' size='sm' className='text-red-600' onClick={() => onDelete(entity)}>
                        <Trash2 className='h-4 w-4' />
                    </Button>
                </div>
            );
        }
    }
];
