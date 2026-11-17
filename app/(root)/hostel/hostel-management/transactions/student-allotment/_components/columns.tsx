'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { DataTableColumnHeader as ColumnHeader } from '@/components/ui/data-table-column-header';
import { useFormContext } from '@/components/ui/form/form-provider';
import { useCallback } from 'react';

export const studentAllotmentColumns: ColumnDef<any, any>[] = [
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
        accessorKey: 'AMST_RegistrationNo',
        header: ({ column }) => <ColumnHeader column={column} title='Reg No' />,
    },
    {
        accessorKey: 'HLMH_Name',
        header: ({ column }) => <ColumnHeader column={column} title='Hostel' />,
    },
    {
        accessorKey: 'HLMRCA_RoomCategory',
        header: ({ column }) => <ColumnHeader column={column} title='Room Category' />,
    },
    {
        accessorKey: 'HRMRM_RoomNo',
        header: ({ column }) => <ColumnHeader column={column} title='Room No' />,
    },
    {
        accessorKey: 'HLHSALT_AllotmentDate',
        header: ({ column }) => <ColumnHeader column={column} title='Allot Date' />,
        cell: ({ row }) => {
            const date = row.getValue('HLHSALT_AllotmentDate');
            if (!date) return '';
            return new Date(String(date)).toLocaleDateString('en-GB');
        }
    },
    {
        id: 'actions',
        header: ({ column }) => <ColumnHeader column={column} title='Action' className='text-center' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    },
];

function ActionButtonsCell({ rowData }: { rowData: any }) {
    const { openEditForm } = useFormContext<any>();

    const handleEdit = useCallback(
        (data: any) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: false, delete: false }} // Assuming no delete/toggle unless specified
            onEdit={handleEdit}
        />
    );
}
