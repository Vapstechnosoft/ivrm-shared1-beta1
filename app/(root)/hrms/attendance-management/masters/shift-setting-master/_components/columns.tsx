'use client';
import { getStatusBadge } from '@/components/extras/helpers/helper';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterShiftSettingList } from '@/types/hrms/attendance-management/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const shiftSettingColumns: ColumnDef<IMasterShiftSettingList>[] = [
    {
        accessorKey: 'FOMS_Id',
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
        accessorKey: 'FOMS_ShiftName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Shift Name' />,
        cell: ({ row }) => <div>{row.getValue('FOMS_ShiftName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'FOMST_IHalfLoginTime',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Shift Start Time' />,
        cell: ({ row }) => <div>{row.getValue('FOMST_IHalfLoginTime') || '-'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'FOMST_IIHalfLogoutTime',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Shift End Time' />,
        cell: ({ row }) => <div>{row.getValue('FOMST_IIHalfLogoutTime') || '-'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'FOMST_IHalfLogoutTime',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Lunch start time' />,
        cell: ({ row }) => <div>{row.getValue('FOMST_IHalfLogoutTime') || '-'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'FOMST_IIHalfLoginTime',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Lunch End time' />,
        cell: ({ row }) => <div>{row.getValue('FOMST_IIHalfLoginTime') || '-'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'FOMST_FDWHrMin',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total working hours per shift' />,
        cell: ({ row }) => <div>{row.getValue('FOMST_FDWHrMin') || '-'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'FOMST_HDWHrMin',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Half day working hours per shift' />,
        cell: ({ row }) => <div>{row.getValue('FOMST_HDWHrMin') || '-'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'FOMST_LunchHoursDuration',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Lunch Hours' />,
        cell: ({ row }) => <div>{row.getValue('FOMST_LunchHoursDuration') || '-'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'FOMST_DelayPerShiftHrMin',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Delay per shift' />,
        cell: ({ row }) => <div>{row.getValue('FOMST_DelayPerShiftHrMin') || '-'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'FOMST_EarlyPerShiftHrMin',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Early per shift' />,
        cell: ({ row }) => <div>{row.getValue('FOMST_EarlyPerShiftHrMin') || '-'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'FOMS_ActiveFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => {
            const isActive = row.getValue('FOMS_ActiveFlg') as boolean;
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

function ActionButtonsCell({ rowData }: { rowData: IMasterShiftSettingList }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterShiftSettingList>();

    const handleEdit = useCallback(
        (data: IMasterShiftSettingList) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterShiftSettingList) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: true, delete: false }}
            onEdit={handleEdit}
            onToggle={handleToggle}
            toggleConditionKey='FOMS_ActiveFlg'
        />
    );
}
