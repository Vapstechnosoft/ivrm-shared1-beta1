'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader as ColumnHeader } from '@/components/ui/data-table-column-header';

export const studentRequestConfirmColumns = (onApprove: (data: any) => void): ColumnDef<any>[] => [
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
        accessorKey: 'studentName',
        header: ({ column }) => <ColumnHeader column={column} title='Student Name' />,
    },
    {
        accessorKey: 'ASMCL_ClassName',
        header: ({ column }) => <ColumnHeader column={column} title='Class' />,
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
        accessorKey: 'HLHSREQ_RequestDate',
        header: ({ column }) => <ColumnHeader column={column} title='Req. Date' />,
        cell: ({ row }) => {
            const date = row.original.HLHSREQ_RequestDate;
            return date ? format(new Date(date), 'dd/MM/yyyy') : '';
        },
    },
    {
        accessorKey: 'HLHSREQ_BookingStatus',
        header: ({ column }) => <ColumnHeader column={column} title='Status' />,
        cell: ({ row }) => {
            const status = row.original.HLHSREQ_BookingStatus;
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
            row.original.HLHSREQ_BookingStatus === 'Waiting' && (
                <Button variant="outline" size="sm" onClick={() => onApprove(row.original)}>
                    Process
                </Button>
            )
        )
    }
];
