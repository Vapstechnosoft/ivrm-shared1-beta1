'use client';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
export interface JobPosting {
    id: number;
    position: string;
    location: string;
    locationType: 'HO' | 'Client' | 'Location';
    department: string;
    priority: string;
    qualification: string;
    positionType: string;
    mrfNo: string;
    skill: string;
    experienceFrom: number;
    experienceTo: number;
    gender: string;
    noOfPositions: number;
    jobDescription: string;
    age: string;
    reason: string;
    jobAttachment?: string;
    tests: {
        written: boolean;
        online: boolean;
        technical: boolean;
    };
    createdAt: string;
}
interface JobPostingColumnsProps {
    onEdit: (row: JobPosting) => void;
    onDelete: (row: JobPosting) => void;
}
export const getJobPostingColumns = ({ onEdit, onDelete }: JobPostingColumnsProps): ColumnDef<JobPosting>[] => [
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
