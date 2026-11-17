'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useCallback } from 'react';
export interface DriverShift {
    id: number;
    shift: string;
    driver: string;
    fromDate: string;
    toDate: string;
    remarks?: string;
    saturdayOff: boolean;
    sundayWorking: boolean;
    isActive?: boolean;
}
export const driverShiftColumns: ColumnDef<DriverShift>[] = [
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
        accessorKey: 'driver',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Driver Name' />,
        cell: ({ row }) => <div>{row.getValue('driver')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'shift',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Shift Name' />,
        cell: ({ row }) => <div>{row.getValue('shift')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fromDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='From Date' />,
        cell: ({ row }) => {
            const date = row.getValue('fromDate') as string;
            if (!date) return '-';
            try {
                return format(new Date(date), 'dd/MM/yyyy');
            } catch {
                return date;
            }
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'toDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='To Date' />,
        cell: ({ row }) => {
            const date = row.getValue('toDate') as string;
            if (!date) return '-';
            try {
                return format(new Date(date), 'dd/MM/yyyy');
            } catch {
                return date;
            }
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
        accessorKey: 'sundayWorking',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sunday_WorkingFlag' />,
        cell: ({ row }) => {
            const value = row.getValue('sundayWorking') as boolean;
            return (
                <div className='flex items-center justify-center'>
                    {value ? (
                        <span className='font-semibold text-green-600'>✓</span>
                    ) : (
                        <span className='font-semibold text-red-600'>✗</span>
                    )}
                </div>
            );
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'saturdayOff',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Saturday_OffFlg' />,
        cell: ({ row }) => {
            const value = row.getValue('saturdayOff') as boolean;
            return (
                <div className='flex items-center justify-center'>
                    {value ? (
                        <span className='font-semibold text-green-600'>✓</span>
                    ) : (
                        <span className='font-semibold text-red-600'>✗</span>
                    )}
                </div>
            );
        },
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
function ActionButtonsCell({ rowData }: { rowData: DriverShift }) {
    const { openEditForm, openDeleteForm } = useFormContext<DriverShift>();
    const handleEdit = useCallback(
        (data: DriverShift) => {
            openEditForm(data);
        },
        [openEditForm]
    );
    const handleDelete = useCallback(
        (data: DriverShift) => {
            openDeleteForm(data);
        },
        [openDeleteForm]
    );
    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: false, delete: true }}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );
}
