'use client';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
export interface CallLetter {
    id: number;
    candidateFirstName: string;
    candidateMiddleName?: string;
    candidateLastName: string;
    candidateEmailId: string;
    address: string;
    position: string;
    company: string;
    hr: string;
    jobPostingSite: string;
    jobLocation: string;
    jobPostDate: string;
    interviewDate: string;
    interviewTime: string;
    officeEmailId: string;
    officePhNo: string;
    status: 'Draft' | 'Generated' | 'Sent';
    generatedDate?: string;
    sentDate?: string;
    createdAt: string;
}
interface CallLetterColumnsProps {
    onEdit: (row: CallLetter) => void;
    onDelete: (row: CallLetter) => void;
}
export const getCallLetterColumns = ({ onEdit, onDelete }: CallLetterColumnsProps): ColumnDef<CallLetter>[] => [
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
