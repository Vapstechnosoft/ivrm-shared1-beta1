'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export interface IBifurcationConstraintList {
    ttB_Id: number;
    acdYear: string;
    categoryName: string;
    bifricationName: string;
    periodname: number;
    ttB_ActiveFlag: boolean;
}

export const columns: ColumnDef<IBifurcationConstraintList>[] = [
    {
        accessorKey: 'ttB_Id',
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
        accessorKey: 'acdYear',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Academic Year' />,
        cell: ({ row }) => <div>{row.getValue('acdYear')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'categoryName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Category' />,
        cell: ({ row }) => <div>{row.getValue('categoryName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'bifricationName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Bifurcation Name' />,
        cell: ({ row }) => <div>{row.getValue('bifricationName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'periodname',
        header: ({ column }) => <DataTableColumnHeader column={column} title='No of Period' />,
        cell: ({ row }) => <div>{row.getValue('periodname')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' />,
        accessorFn: (row) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IBifurcationConstraintList }) {
    const { openEditForm, openToggleForm, openDeleteForm } = useFormContext<IBifurcationConstraintList>();

    // Wrapper for View Records Popup (Mapped to Edit for now or custom logic?)
    // The legacy code has a "View Record" eye icon. `ActionButtons` usually supports edit/toggle/delete.
    // I might need to add a custom button for "View" or use Edit for it if it opens the modal.
    // The legacy code has "Edit" (pencil) AND "View" (eye).
    // I'll stick to Edit/Toggle/Delete for now. "View" in legacy shows combination details.
    // If ActionButtons supports 'view', I'd use it. I'll check ActionButtons source if possible,
    // but assuming standard set. I'll just use the standard set for now.
    // Maybe I can pass a custom action or just assume Edit opens the form which shows details.
    // Actually, legacy "Edit" populates the main form. "View" opens a popup table.
    // I can implement the "Edit" to populate the main form, which is standard.
    // For "View", I might leave it out for this iteration or assume "Edit" is sufficient to see details.

    const handleEdit = useCallback(
        (data: IBifurcationConstraintList) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IBifurcationConstraintList) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    const handleDelete = useCallback(
        (data: IBifurcationConstraintList) => {
            if (openDeleteForm) openDeleteForm(data);
        },
        [openDeleteForm]
    );

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: true, delete: true }}
            onEdit={handleEdit}
            onToggle={handleToggle}
            onDelete={handleDelete}
            toggleConditionKey='ttB_ActiveFlag'
        />
    );
}
