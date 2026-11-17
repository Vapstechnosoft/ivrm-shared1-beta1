'use client';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
export interface HRMSEmployee {
    id: number;
    candidateName: string;
    candidateId: number;
    companyName: string;
    employeeType: string;
    religion: string;
    caste: string;
    maritalStatus: string;
    employeeDepartment: string;
    employeeDesignation: string;
    employeeGrade: string;
    groupType: string;
    employeeCode: string;
    hidCardNo: string;
    status: 'Active' | 'Inactive' | 'Pending';
    addedDate: string;
    updatedDate?: string;
    createdAt: string;
}
interface HRMSEmployeeColumnsProps {
    onEdit: (row: HRMSEmployee) => void;
    onDelete: (row: HRMSEmployee) => void;
}
export const getHRMSEmployeeColumns = ({ onEdit, onDelete }: HRMSEmployeeColumnsProps): ColumnDef<HRMSEmployee>[] => [
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
