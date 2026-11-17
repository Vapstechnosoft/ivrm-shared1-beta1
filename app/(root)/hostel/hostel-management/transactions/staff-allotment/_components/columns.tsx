'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { DataTableColumnHeader as ColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useFormContext } from '@/components/ui/form/form-provider';
import { useCallback } from 'react';

export type StaffAllotmentColumn = {
    HLHSTALT_Id: number;
    staffName: string;
    HRMD_DepartmentName: string;
    HRMDES_DesignationName: string;
    HLMH_Name: string;
    HLMRCA_RoomCategory: string;
    HLHSTREQ_RequestDate: string;
    HLHSTREQ_BookingStatus: string;
    HLHSTALT_ActiveFlag: boolean;
};

export const staffAllotmentColumns: ColumnDef<StaffAllotmentColumn, any>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label='Select all'
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label='Select row'
            />
        ),
        enableSorting: false,
        enableHiding: false
    },
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
        accessorKey: 'staffName',
        header: ({ column }) => <ColumnHeader column={column} title='Staff Name' />
    },
    {
        accessorKey: 'HRMD_DepartmentName',
        header: ({ column }) => <ColumnHeader column={column} title='Department' />
    },
    {
        accessorKey: 'HRMDES_DesignationName',
        header: ({ column }) => <ColumnHeader column={column} title='Designation' />
    },
    {
        accessorKey: 'HLMH_Name',
        header: ({ column }) => <ColumnHeader column={column} title='Hostel' />
    },
    {
        accessorKey: 'HLMRCA_RoomCategory',
        header: ({ column }) => <ColumnHeader column={column} title='Room Category' />
    },
    {
        accessorKey: 'HLHSTREQ_RequestDate',
        header: ({ column }) => <ColumnHeader column={column} title='Request Date' />,
        cell: ({ row }) => {
            const date = row.getValue('HLHSTREQ_RequestDate') as string;
            return date ? format(new Date(date), 'dd/MM/yyyy') : '';
        }
    },
    {
        accessorKey: 'HLHSTREQ_BookingStatus',
        header: ({ column }) => <ColumnHeader column={column} title='Status' />
    },
    {
        id: 'actions',
        header: ({ column }) => <ColumnHeader column={column} title='Actions' className='text-center' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: StaffAllotmentColumn }) {
    const { openEditForm } = useFormContext<StaffAllotmentColumn>();

    const handleEdit = useCallback(
        (data: StaffAllotmentColumn) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: false, delete: false }}
            onEdit={handleEdit}
        />
    );
}
