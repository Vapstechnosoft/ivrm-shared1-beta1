'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export interface IPeriodStaffList {
    ttrpS_Id: number;
    asmaY_Year: string;
    ttmP_PeriodName: string;
    staffName: string;
}

export const columns: ColumnDef<IPeriodStaffList>[] = [
    {
        accessorKey: 'ttrpS_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='pl-6'>{continuousIndex}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'asmaY_Year',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Academic Year' />,
        cell: ({ row }) => <div>{row.getValue('asmaY_Year')}</div>
    },
    {
        accessorKey: 'ttmP_PeriodName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Period' />,
        cell: ({ row }) => <div>{row.getValue('ttmP_PeriodName')}</div>
    },
    {
        accessorKey: 'staffName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Staff' />,
        cell: ({ row }) => <div>{row.getValue('staffName')}</div>
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' />,
        accessorFn: (row) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IPeriodStaffList }) {
    const { openEditForm, openDeleteForm } = useFormContext<IPeriodStaffList>();

    const handleEdit = useCallback(
        (data: IPeriodStaffList) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleDelete = useCallback(
        (data: IPeriodStaffList) => {
            if (openDeleteForm) openDeleteForm(data);
        },
        [openDeleteForm]
    );

    return <ActionButtons rowData={rowData} buttons={{ edit: true, delete: true }} onEdit={handleEdit} onDelete={handleDelete} />;
}
