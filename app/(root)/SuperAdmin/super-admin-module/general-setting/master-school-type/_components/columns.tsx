'use client';

import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import { IMasterSchoolType } from '@/types/super-admin/super-admin-module/general-setting/master-school-type';
import { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const columns: ColumnDef<IMasterSchoolType>[] = [
    {
        accessorKey: 'slno',
        header: 'SL.NO',
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: 'ivrmmtyP_Type',
        header: 'School Type',
    },
    {
        accessorKey: 'ivrmmtyP_Description',
        header: 'Description',
    },
    {
        id: 'actions',
        header: 'Edit/Delete',
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
    },
];

function ActionButtonsCell({ rowData }: { rowData: IMasterSchoolType }) {
    const { openEditForm, openDeleteForm } = useFormContext<IMasterSchoolType>();

    const handleEdit = useCallback(
        (data: IMasterSchoolType) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleDelete = useCallback(
        (data: IMasterSchoolType) => {
            openDeleteForm(data);
        },
        [openDeleteForm]
    );

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, delete: true, toggle: false }}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );
}
