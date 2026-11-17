'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { BaseEntity } from '@/lib/localdb';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
export interface LeaveCreditDetail extends BaseEntity {
    leaveId: number;
    leaveName: string;
    leaveCode?: string;
    type: string[];
    department: string[];
    designation: string[];
    grade?: string[];
    typeName?: string[];
    departmentName?: string[];
    designationName?: string[];
    gradeName?: string[];
    noOfDays: number;
    maxLeaveApplicable: number;
    leaveCarryForward?: boolean;
    leaveEncashment?: boolean;
    leaveCreditMonthWise?: boolean;
    creditMonths?: string[];
    months?: Record<string, number>;
}
export const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
interface LeaveCreditDetailColumnsProps {
    onEdit: (row: LeaveCreditDetail) => void;
    onDelete: (id: number) => void;
}
export const getLeaveCreditDetailColumns = ({ onEdit, onDelete }: LeaveCreditDetailColumnsProps): ColumnDef<LeaveCreditDetail>[] => [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label='Select all'
            />
        ),
        cell: ({ row }) => (
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 24
    },
    {
        id: 'sl',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SNO' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='font-medium'>{continuousIndex}</div>;
        },
        enableSorting: false
    },
    {
        accessorKey: 'departmentName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='DEPARTMENT NAME' />,
        cell: ({ row }) => {
            const dept = row.getValue('departmentName') as string[];
            return <div>{dept && dept.length > 0 ? dept.join(', ') : '-'}</div>;
        }
    },
    {
        accessorKey: 'designationName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='DESIGNATION' />,
        cell: ({ row }) => {
            const desg = row.getValue('designationName') as string[];
            return <div>{desg && desg.length > 0 ? desg.join(', ') : '-'}</div>;
        }
    },
    {
        accessorKey: 'leaveName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='LEAVE NAME' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('leaveName')}</div>
    },
    {
        accessorKey: 'noOfDays',
        header: ({ column }) => <DataTableColumnHeader column={column} title='NUMBER OF DAYS' />,
        cell: ({ row }) => <div className='text-center'>{row.getValue('noOfDays') || 0}</div>
    },
    {
        accessorKey: 'maxLeaveApplicable',
        header: ({ column }) => <DataTableColumnHeader column={column} title='MAX LEAVE APPLICABLE' />,
        cell: ({ row }) => <div className='text-center'>{row.getValue('maxLeaveApplicable') || 0}</div>
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
                    <Button variant='outline' size='sm' onClick={() => onDelete(entity.id)}>
                        <Trash2 className='h-4 w-4' />
                    </Button>
                </div>
            );
        }
    }
];
