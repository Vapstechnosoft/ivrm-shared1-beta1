'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader as ColumnHeader } from '@/components/ui/data-table-column-header';

export const staffApprovalListColumns = (onApprove: (data: any) => void): ColumnDef<any>[] => [
    {
        accessorKey: 'sn',
        header: ({ column }) => <ColumnHeader column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'empName',
        header: ({ column }) => <ColumnHeader column={column} title='Staff Name' />,
    },
    {
        accessorKey: 'HRMD_DepartmentName',
        header: ({ column }) => <ColumnHeader column={column} title='Department' />,
    },
    {
        accessorKey: 'HLMH_Name',
        header: ({ column }) => <ColumnHeader column={column} title='Requested Hostel' />,
    },
    {
        accessorKey: 'HLMRCA_RoomCategory',
        header: ({ column }) => <ColumnHeader column={column} title='Category' />,
    },
    {
        accessorKey: 'HLHSTREQ_RequestDate',
        header: ({ column }) => <ColumnHeader column={column} title='Req. Date' />,
        cell: ({ row }) => {
            const date = row.original.HLHSTREQ_RequestDate;
            return date ? format(new Date(date), 'dd/MM/yyyy') : '';
        },
    },
    {
        accessorKey: 'HLHSTREQ_BookingStatus',
        header: ({ column }) => <ColumnHeader column={column} title='Status' />,
        cell: ({ row }) => {
            const status = row.original.HLHSTREQ_BookingStatus;
            return (
                <Badge variant={status === 'Waiting' ? 'outline' : status === 'Approved' ? 'secondary' : 'destructive'}>
                    {status}
                </Badge>
            );
        }
    },
    {
        id: 'actions',
        header: ({ column }) => <ColumnHeader column={column} title='Action' className='text-center' />,
        cell: ({ row }) => (
            row.original.HLHSTREQ_BookingStatus === 'Waiting' && (
                <Button variant="outline" size="sm" onClick={() => onApprove(row.original)}>
                    Process
                </Button>
            )
        )
    }
];
