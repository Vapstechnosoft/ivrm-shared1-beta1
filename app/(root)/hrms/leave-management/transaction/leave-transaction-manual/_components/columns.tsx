'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import type { LeaveTransactionManual } from '@/types/hrms/leave-management/leave-transaction-manual';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';

interface LeaveTransactionManualColumnsProps {
    onEdit: (row: LeaveTransactionManual) => void;
    onDelete: (id: number) => void;
}

export const getLeaveTransactionManualColumns = ({
    onEdit,
    onDelete
}: LeaveTransactionManualColumnsProps): ColumnDef<LeaveTransactionManual>[] => [
        {
            accessorKey: 'id',
            header: ({ column }) => <DataTableColumnHeader column={column} title='S.No' />,
            cell: ({ row }) => <div className='w-[60px]'>{row.index + 1}</div>,
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: 'employeeName',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Name' />,
            cell: ({ row }) => (
                <div className='min-w-[200px] font-medium'>{row.getValue('employeeName')}</div>
            )
        },
        {
            accessorKey: 'leaveName',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Leave Type' />,
            cell: ({ row }) => (
                <div className='min-w-[150px]'>{row.getValue('leaveName')}</div>
            )
        },
        {
            accessorKey: 'fromDate',
            header: ({ column }) => <DataTableColumnHeader column={column} title='From Date' />,
            cell: ({ row }) => {
                const date = row.getValue('fromDate') as Date;
                return (
                    <div className='min-w-[120px]'>
                        {date ? format(new Date(date), 'dd-MMM-yyyy') : '-'}
                    </div>
                );
            }
        },
        {
            accessorKey: 'toDate',
            header: ({ column }) => <DataTableColumnHeader column={column} title='To Date' />,
            cell: ({ row }) => {
                const date = row.getValue('toDate') as Date;
                return (
                    <div className='min-w-[120px]'>
                        {date ? format(new Date(date), 'dd-MMM-yyyy') : '-'}
                    </div>
                );
            }
        },
        {
            accessorKey: 'totalDays',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Total Days' />,
            cell: ({ row }) => (
                <div className='min-w-[100px] text-center font-semibold'>
                    {row.getValue('totalDays')}
                </div>
            )
        },
        {
            accessorKey: 'isActive',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
            cell: ({ row }) => {
                const isActive = row.getValue('isActive') as boolean;
                return (
                    <div className='min-w-[100px]'>
                        <Badge variant={isActive ? 'default' : 'destructive'}>
                            {isActive ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>
                );
            }
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const transaction = row.original;
                return (
                    <div className='flex items-center gap-2'>
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => onEdit(transaction)}
                            className='h-8 w-8 p-0 hover:bg-primary/10'
                        >
                            <Edit className='h-4 w-4 text-primary' />
                        </Button>
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => onDelete(transaction.id)}
                            className='h-8 w-8 p-0 hover:bg-destructive/10'
                        >
                            <Trash2 className='h-4 w-4 text-destructive' />
                        </Button>
                    </div>
                );
            },
            enableSorting: false,
            enableHiding: false
        }
    ];

export type { LeaveTransactionManual };
