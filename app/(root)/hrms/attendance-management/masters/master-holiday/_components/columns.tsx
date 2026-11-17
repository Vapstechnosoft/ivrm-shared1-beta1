'use client';
import { getStatusBadge } from '@/components/extras/helpers/helper';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterHolidayList } from '@/types/hrms/attendance-management/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const masterHolidayColumns: ColumnDef<IMasterHolidayList>[] = [
    {
        accessorKey: 'fomhwdD_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='w-full pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='w-full pl-6'>{continuousIndex}</div>;
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'fomhwdD_Name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
        cell: ({ row }) => <div>{row.getValue('fomhwdD_Name')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fohtwD_HolidayWDType',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Holiday Type' />,
        cell: ({ row }) => <div>{row.getValue('fohtwD_HolidayWDType')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'hrmD_DepartmentName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Department' />,
        cell: ({ row }) => <div>{row.getValue('hrmD_DepartmentName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fomhwdD_FromDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='From Date' />,
        cell: ({ row }) => {
            const date = row.getValue('fomhwdD_FromDate') as string;
            return <div>{date ? new Date(date).toLocaleDateString() : '-'}</div>;
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fomhwdD_ToDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='To Date' />,
        cell: ({ row }) => {
            const date = row.getValue('fomhwdD_ToDate') as string;
            return <div>{date ? new Date(date).toLocaleDateString() : '-'}</div>;
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fomhwD_ActiveFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => {
            const isActive = row.getValue('fomhwD_ActiveFlg') as boolean;
            return <div>{getStatusBadge(isActive ? 'active' : 'inactive')}</div>;
        },
        enableSorting: false,
        enableHiding: true
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterHolidayList }) {
    const { openDeleteForm } = useFormContext<IMasterHolidayList>();

    const handleDelete = useCallback(
        (data: IMasterHolidayList) => {
            openDeleteForm(data);
        },
        [openDeleteForm]
    );

    return <ActionButtons rowData={rowData} buttons={{ edit: false, toggle: false, delete: true }} onDelete={handleDelete} />;
}
