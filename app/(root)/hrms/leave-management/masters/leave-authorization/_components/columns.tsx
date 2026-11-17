'use client';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { BaseEntity } from '@/lib/localdb';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2, X } from 'lucide-react';
export interface LeaveAuthorization extends BaseEntity {
    institution: string;
    gradeName: string;
    groupTypeName: string;
    departmentName: string;
    designationName: string;
    leaveType: string;
    orderOfApproval: string;
    approvalPerson: string;
    finalFlag: boolean;
}
interface LeaveAuthorizationColumnsProps {
    onEdit: (row: LeaveAuthorization) => void;
    onDelete: (id: number) => void;
}
export const getLeaveAuthorizationColumns = ({ onEdit, onDelete }: LeaveAuthorizationColumnsProps): ColumnDef<LeaveAuthorization>[] => [
    {
        accessorKey: 'id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL.No' />,
        cell: ({ row }) => <div className='text-center'>{row.index + 1}</div>
    },
    {
        accessorKey: 'gradeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Grade Name' />,
        cell: ({ row }) => <div>{row.getValue('gradeName')}</div>
    },
    {
        accessorKey: 'departmentName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Department Name' />,
        cell: ({ row }) => <div>{row.getValue('departmentName')}</div>
    },
    {
        accessorKey: 'designationName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Designation Name' />,
        cell: ({ row }) => <div>{row.getValue('designationName')}</div>
    },
    {
        accessorKey: 'groupTypeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Group Type Name' />,
        cell: ({ row }) => <div>{row.getValue('groupTypeName')}</div>
    },
    {
        accessorKey: 'leaveType',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Leave Type' />,
        cell: ({ row }) => <div>{row.getValue('leaveType')}</div>
    },
    {
        accessorKey: 'finalFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Final Flag' />,
        cell: ({ row }) => (
            <div className='flex justify-center'>
                {row.original.finalFlag ? <span className='text-green-600'>✓</span> : <X className='h-4 w-4 text-red-600' />}
            </div>
        )
    },
    {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => {
            const entity = row.original;
            return (
                <div className='flex gap-2'>
                    <Button variant='outline' size='sm' onClick={() => onEdit(entity)}>
                        <Edit className='h-4 w-4' />
                    </Button>
                    <Button variant='outline' size='sm' onClick={() => onDelete(entity.id)}>
                        <Trash2 className='h-4 w-4' />
                    </Button>
                </div>
            );
        }
    }
];
