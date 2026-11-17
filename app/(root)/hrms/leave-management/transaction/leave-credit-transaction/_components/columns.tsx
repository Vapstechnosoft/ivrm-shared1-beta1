'use client';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { LeaveTransactionManual } from '@/types/hrms/leave-management/leave-transaction-manual';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
export type LeaveCreditTransaction = LeaveTransactionManual;
interface LeaveCreditTransactionColumnsProps {
    onEdit: (row: LeaveCreditTransaction) => void;
    onDelete: (id: number) => void;
    onToggle: (id: number) => void;
}
export const getLeaveCreditTransactionColumns = ({
    onEdit,
    onDelete,
    onToggle
}: LeaveCreditTransactionColumnsProps): ColumnDef<LeaveCreditTransaction>[] => [
    {
        id: 'sl',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SNO' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='font-medium'>{continuousIndex}</div>;
        },
        enableSorting: false,
        size: 50
    },
    {
        accessorKey: 'employeeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Name' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('employeeName') || '-'}</div>
    },
    {
        accessorKey: 'leaveName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Leave Name' />,
        cell: ({ row }) => <div>{row.getValue('leaveName')}</div>
    },
    {
        accessorKey: 'fromDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='From Date' />,
        cell: ({ row }) => {
            const value = row.getValue('fromDate');
            if (!value) return <div>-</div>;
            const date = typeof value === 'string' ? new Date(value) : (value as Date);
            return <div>{date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>;
        }
    },
    {
        accessorKey: 'toDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='To Date' />,
        cell: ({ row }) => {
            const value = row.getValue('toDate');
            if (!value) return <div>-</div>;
            const date = typeof value === 'string' ? new Date(value) : (value as Date);
            return <div>{date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>;
        }
    },
    {
        accessorKey: 'totalDays',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Days' />,
        cell: ({ row }) => <div className='text-center'>{row.getValue('totalDays')}</div>
    },
    {
        accessorKey: 'isActive',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => {
            const isActive = row.getValue('isActive') as boolean;
            const id = row.original.transactionId;
            return (
                <div onClick={() => onToggle(id)} className='cursor-pointer'>
                    {isActive ? (
                        <span className='rounded-full bg-green-100 px-2.5 py-0.5 font-medium text-green-800 text-xs dark:bg-green-900/30 dark:text-green-400'>
                            Active
                        </span>
                    ) : (
                        <span className='rounded-full bg-red-100 px-2.5 py-0.5 font-medium text-red-800 text-xs dark:bg-red-900/30 dark:text-red-400'>
                            Deactive
                        </span>
                    )}
                </div>
            );
        }
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const entity = row.original;
            return (
                <div className='flex gap-2'>
                    <Button variant='outline' size='sm' onClick={() => onEdit(entity)}>
                        <Edit className='h-4 w-4 text-blue-500' />
                    </Button>
                    <Button variant='outline' size='sm' onClick={() => onDelete(entity.id)}>
                        <Trash2 className='h-4 w-4 text-red-500' />
                    </Button>
                </div>
            );
        }
    }
];
