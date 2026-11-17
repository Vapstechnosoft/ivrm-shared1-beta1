'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { AdminOnDutyApply } from '@/types/hrms/leave-management/admin-on-duty-apply';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Eye, Trash2, Calendar, Clock, User } from 'lucide-react';

import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface AdminOnDutyApplyColumnsProps {
    onView: (id: number) => void;
    onDelete: (id: number) => void;
    onToggle: (id: number) => void;
}

export const getAdminOnDutyApplyColumns = ({
    onView,
    onDelete,
    onToggle
}: AdminOnDutyApplyColumnsProps): ColumnDef<AdminOnDutyApply>[] => [
        {
            id: 'slNo',
            header: ({ column }) => <DataTableColumnHeader column={column} title='SL.NO.' />,
            cell: ({ row }) => <div className='font-mono text-xs text-muted-foreground'>{row.index + 1}</div>,
        },
        {
            accessorKey: 'employeeName',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Name' />,
            cell: ({ row }) => (
                <div className='flex flex-col'>
                    <span className='font-semibold text-primary'>{row.getValue('employeeName')}</span>
                    <span className='text-[10px] text-muted-foreground flex items-center gap-1'>
                        <User className='h-3 w-3' /> ID: {row.original.employeeId}
                    </span>
                </div>
            )
        },
        {
            accessorKey: 'leaveName',
            header: ({ column }) => <DataTableColumnHeader column={column} title='LEAVE NAME' />,
            cell: ({ row }) => (
                <div className='flex flex-col'>
                    <span className='font-medium'>{row.getValue('leaveName')}</span>
                    <Badge variant='outline' className='w-fit text-[10px] px-1 h-4 border-primary/20 bg-primary/5 text-primary'>
                        {row.original.leaveCode}
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: 'leaveReason',
            header: ({ column }) => <DataTableColumnHeader column={column} title='LEAVE REASON' />,
            cell: ({ row }) => (
                <div className='max-w-[200px] truncate text-xs text-muted-foreground italic' title={row.getValue('leaveReason')}>
                    {row.getValue('leaveReason') || '---'}
                </div>
            )
        },
        {
            accessorKey: 'fromDate',
            header: ({ column }) => <DataTableColumnHeader column={column} title='From Date' />,
            cell: ({ row }) => {
                const date = row.getValue('fromDate') as Date;
                return (
                    <div className='flex items-center gap-1 text-xs font-medium'>
                        <Calendar className='h-3 w-3 text-orange-500' /> {format(date, 'dd-MM-yyyy')}
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
                    <div className='flex items-center gap-1 text-xs font-medium'>
                        <Calendar className='h-3 w-3 text-blue-500' /> {format(date, 'dd-MM-yyyy')}
                    </div>
                );
            }
        },
        {
            accessorKey: 'totalDays',
            header: ({ column }) => <DataTableColumnHeader column={column} title='NO. OF DAYS' />,
            cell: ({ row }) => (
                <div className='font-bold bg-muted w-fit px-2 py-0.5 rounded text-xs'>
                    {row.getValue('totalDays')}
                </div>
            )
        },
        {
            accessorKey: 'status',
            header: ({ column }) => <DataTableColumnHeader column={column} title='STATUS' />,
            cell: ({ row }) => {
                const status = row.getValue('status') as string;
                let className = '';

                if (status === 'Applied' || status === 'Requested') {
                    className = 'bg-blue-100 text-blue-700 border-blue-200';
                } else if (status === 'Approved') {
                    className = 'bg-green-100 text-green-700 border-green-200';
                } else if (status === 'Rejected') {
                    className = 'bg-red-100 text-red-700 border-red-200';
                }

                return (
                    <Badge variant='outline' className={cn('font-bold tracking-wide uppercase text-[10px]', className)}>
                        {status}
                    </Badge>
                );
            }
        },
        {
            id: 'view',
            header: ({ column }) => <DataTableColumnHeader column={column} title='VIEW' />,
            cell: ({ row }) => (
                <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                    onClick={() => onView(row.original.id)}
                >
                    <Eye className='h-4 w-4' />
                </Button>
            )
        },
        {
            id: 'action',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Action' />,
            cell: ({ row }) => (
                <div className='flex items-center gap-2'>
                    <Switch
                        checked={row.original.isActive}
                        onCheckedChange={() => onToggle(row.original.id)}
                        className='scale-75'
                    />
                    <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-destructive hover:text-destructive hover:bg-red-50'
                        onClick={() => onDelete(row.original.id)}
                    >
                        <Trash2 className='h-4 w-4' />
                    </Button>
                </div>
            )
        }
    ];

