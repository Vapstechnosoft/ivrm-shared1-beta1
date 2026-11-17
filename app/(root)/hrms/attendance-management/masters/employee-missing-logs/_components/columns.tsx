'use client';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';
export interface MissingLog {
    id: number;
    employeeName: string;
    date: string;
    time: string;
    inOut: 'IN' | 'OUT';
    file?: string; // path/url placeholder
    remarks?: string;
    reportedBy?: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    createdAt: Date;
}
export const missingLogColumns: ColumnDef<MissingLog>[] = [
    {
        id: 'sl',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL.NO' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='font-medium'>{continuousIndex}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'employeeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Name' />,
        cell: ({ row }) => <div>{row.getValue('employeeName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'date',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Date' />,
        cell: ({ row }) => <div>{row.getValue('date')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'time',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Time' />,
        cell: ({ row }) => <div>{row.getValue('time')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'inOut',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Input/Output' />,
        cell: ({ row }) => {
            const value = row.getValue('inOut') as string;
            return <div>{value === 'IN' ? '0' : '1'}</div>;
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'file',
        header: ({ column }) => <DataTableColumnHeader column={column} title='File' />,
        cell: ({ row }) => {
            const file = row.getValue('file') as string | undefined;
            return file ? (
                <Button variant='link' size='sm' className='h-auto p-0 text-destructive hover:text-destructive/80'>
                    view
                </Button>
            ) : (
                <span className='text-muted-foreground'>-</span>
            );
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'remarks',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Remarks' />,
        cell: ({ row }) => <div>{row.getValue('remarks')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'reportedBy',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Reported By' />,
        cell: ({ row }) => <div>{row.getValue('reportedBy')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => <div>{row.getValue('status')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-start' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];
function ActionButtonsCell({ rowData }: { rowData: MissingLog }) {
    const { openEditForm } = useFormContext<MissingLog>();
    const handleEdit = useCallback(
        (data: MissingLog) => {
            openEditForm(data);
        },
        [openEditForm]
    );
    return <ActionButtons rowData={rowData} buttons={{ edit: true, toggle: false, delete: false }} onEdit={handleEdit} />;
}
