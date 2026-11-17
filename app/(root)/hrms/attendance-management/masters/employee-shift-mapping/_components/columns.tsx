'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterEmployeeShiftMappingList } from '@/types/hrms/attendance-management/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const employeeShiftMappingColumns: ColumnDef<IMasterEmployeeShiftMappingList>[] = [
    {
        accessorKey: 'FOEST_Id',
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
        accessorKey: 'ShiftName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Shift Name' />,
        cell: ({ row }) => <div>{row.getValue('ShiftName') || '-'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'EmployeeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Employee' />,
        cell: ({ row }) => <div>{row.getValue('EmployeeName') || '-'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'DayType',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Day Type' />,
        cell: ({ row }) => <div>{row.getValue('DayType') || '-'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'Date',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Date' />,
        cell: ({ row }) => {
            const date = row.getValue('Date') as string;
            return <div>{date ? new Date(date).toLocaleDateString() : '-'}</div>;
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'FDWHrMin',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Work Hour' />,
        cell: ({ row }) => <div>{row.getValue('FDWHrMin') || '-'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'HDWHrMin',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Half Day Work Hour' />,
        cell: ({ row }) => <div>{row.getValue('HDWHrMin') || '-'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'IHalfLogin',
        header: ({ column }) => <DataTableColumnHeader column={column} title='First Half Login' />,
        cell: ({ row }) => <div>{row.getValue('IHalfLogin') || '-'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'IHalfLogout',
        header: ({ column }) => <DataTableColumnHeader column={column} title='First Half Logout' />,
        cell: ({ row }) => <div>{row.getValue('IHalfLogout') || '-'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'IIHalfLogin',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Second Half Login' />,
        cell: ({ row }) => <div>{row.getValue('IIHalfLogin') || '-'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'IIHalfLogout',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Second Half Logout' />,
        cell: ({ row }) => <div>{row.getValue('IIHalfLogout') || '-'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'DelayPerShift',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Delay Per Shift' />,
        cell: ({ row }) => <div>{row.getValue('DelayPerShift') || '-'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'EarlyPerShift',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Early Per Shift' />,
        cell: ({ row }) => <div>{row.getValue('EarlyPerShift') || '-'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'LunchDuration',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Lunch Duration' />,
        cell: ({ row }) => <div>{row.getValue('LunchDuration') || '-'}</div>,
        enableSorting: true,
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

function ActionButtonsCell({ rowData }: { rowData: IMasterEmployeeShiftMappingList }) {
    const { openEditForm, openDeleteForm } = useFormContext<IMasterEmployeeShiftMappingList>();

    const handleEdit = useCallback(
        (data: IMasterEmployeeShiftMappingList) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleDelete = useCallback(
        (data: IMasterEmployeeShiftMappingList) => {
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
// Dropdown options are now fetched from API via useEmployeeShiftMappingDropdowns hook
// These exports are kept for backward compatibility but should be replaced with API data
export const employeeTypeOptions: string[] = [];
export const dayTypeOptions: string[] = [];
export const typeOptions: string[] = [];
export const departmentOptions: string[] = [];
export const designationOptions: string[] = [];
export const shiftNames: string[] = [];
export const employeeOptions: Array<{ label: string; value: string }> = [];
