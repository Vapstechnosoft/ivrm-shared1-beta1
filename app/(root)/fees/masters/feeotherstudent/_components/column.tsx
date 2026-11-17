// _components/columns.tsx
'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { MasterFeeOtherStudentType } from '@/types/fees/masters/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const masterFeeOtherStudentList: ColumnDef<MasterFeeOtherStudentType>[] = [
    {
        id: 'fmst_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl. No' className='pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex || 0;
            const pageSize = table.getState().pagination.pageSize || 10;
            return <div className='pl-6'>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },

    {
        accessorKey: 'fmosT_StudentName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Student Name' />,
        cell: ({ row }) => <div>{row.getValue('fmosT_StudentName')}</div>
    },

    {
        accessorKey: 'fmosT_StudentMobileNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Mobile No' />,
        cell: ({ row }) => <div>{row.getValue('fmosT_StudentMobileNo')}</div>
    },

    {
        accessorKey: 'fmosT_StudentEmailId',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Email Id' />,
        cell: ({ row }) => <div>{row.getValue('fmosT_StudentEmailId')}</div>
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-start' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
        enableSorting: false
    }
];

function ActionButtonsCell({
    rowData
}: {
    rowData: MasterFeeOtherStudentType;
}) {
    const { openDeleteForm, openEditForm } = useFormContext<MasterFeeOtherStudentType>();

    const handleDelete = useCallback((data: MasterFeeOtherStudentType) => openDeleteForm?.(data), [openDeleteForm]);
    const handleEdit = useCallback((data: MasterFeeOtherStudentType) => openEditForm?.(data), [openEditForm]);

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ delete: true, edit: true }}
            onDelete={handleDelete}
            onEdit={handleEdit}
            toggleConditionKey='fycC_ActiveFlag'
        />
    );
}
