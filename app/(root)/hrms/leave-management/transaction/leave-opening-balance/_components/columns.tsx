'use client';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { BaseEntity } from '@/lib/localdb';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit } from 'lucide-react';
export interface LeaveOpeningBalance extends BaseEntity {
    employeeName: string;
    leaveName: string;
    leaveBalance: number;
}
interface LeaveOpeningBalanceColumnsProps {
    onEdit: (row: LeaveOpeningBalance) => void;
}
export const getLeaveOpeningBalanceColumns = ({ onEdit }: LeaveOpeningBalanceColumnsProps): ColumnDef<LeaveOpeningBalance>[] => [
    {
        id: 'sl',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='font-medium'>{continuousIndex}</div>;
        },
        enableSorting: false
    },
    {
        accessorKey: 'employeeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='EMPLOYEE NAME' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('employeeName')}</div>
    },
    {
        accessorKey: 'leaveName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='LEAVE NAME' />,
        cell: ({ row }) => <div>{row.getValue('leaveName')}</div>
    },
    {
        accessorKey: 'leaveBalance',
        header: ({ column }) => <DataTableColumnHeader column={column} title='LEAVE BALANCE' />,
        cell: ({ row }) => <div className='text-center'>{row.getValue('leaveBalance')}</div>
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const entity = row.original;
            return (
                <div className='flex gap-2'>
                    <Button variant='outline' size='sm' onClick={() => onEdit(entity)}>
                        <Edit className='h-4 w-4' />
                    </Button>
                </div>
            );
        }
    }
];
