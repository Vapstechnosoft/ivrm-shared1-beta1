'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterSubjectList } from '@/types/library/masters/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const MasterSubjectColumns: ColumnDef<IMasterSubjectList>[] = [
    {
        accessorKey: 'lmaL_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl. No' className='w-full pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;

            return <div className='w-full pl-6'>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'ismS_SubjectName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Parent Name' />,
        cell: ({ row }) => <div>{row.getValue('ismS_SubjectName')}</div>
    },
   {
        accessorKey: 'lmS_SubjectName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sub-Subject' />,
        cell: ({ row }) => <div>{row.getValue('lmS_SubjectName')}</div>
    },
    {
        accessorKey: 'lmS_SubjectNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Subject No' />,
        cell: ({ row }) => <div>{row.getValue('lmS_SubjectNo')}</div>
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-start' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterSubjectList }) {
    const { openToggleForm, openEditForm } = useFormContext<IMasterSubjectList>();

    const handleToggle = useCallback(
        (data: IMasterSubjectList) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    const handleEdit = useCallback((data: IMasterSubjectList) => openEditForm(data), [openEditForm]);

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: true, delete: false }}
            onToggle={handleToggle}
            onEdit={handleEdit}
            toggleConditionKey='lmaL_ActiveFlag'
        />
    );
}
