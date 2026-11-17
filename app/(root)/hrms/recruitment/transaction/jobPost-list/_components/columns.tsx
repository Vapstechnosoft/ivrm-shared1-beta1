'use client';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
export interface MRF {
    id: number;
    department: string;
    position: string;
    priority: string;
    positionType: string;
    qualification: string;
    noOfPosition: number;
    age: string;
    gender: string;
    expFrom: number;
    expTo: number;
    payScaleFrom?: string;
    payScaleTo?: string;
    skill: string;
    jobDescription: string;
    locationType: 'HO' | 'Client' | 'Location';
    country: string;
    state: string;
    remark?: string;
    reason: string;
    tests: { written: boolean; online: boolean; technical: boolean };
    createdAt: string;
}
interface MRFColumnsProps {
    onEdit: (row: MRF) => void;
    onDelete: (row: MRF) => void;
}
export const getMRFColumns = ({ onEdit, onDelete }: MRFColumnsProps): ColumnDef<MRF>[] => [
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
