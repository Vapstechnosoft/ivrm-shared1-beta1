// _components/columns.tsx
'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterStudentFeeGroupMappingList } from '@/types/fees/masters/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const masterStudentFeeGroupMapping: ColumnDef<IMasterStudentFeeGroupMappingList>[] = [
    {
        id: 'fmgM_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl. No' className='pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex || 0;
            const pageSize = table.getState().pagination.pageSize || 10;
            return <div className='pl-6'>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },

    // {
    //     accessorKey: 'amsT_FirstName',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title='Student Name' />,
    //     cell: ({ row }) => <div>{row.getValue('amsT_FirstName')}</div>
    // },
    {
        accessorKey: 'amsT_FirstName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Student Name' />,
        cell: ({ row }) => {
            const first = row.original.amsT_FirstName || '';
            const middle = row.original.amsT_MiddleName || '';
            const last = row.original.amsT_LastName || '';

            return <div>{`${first} ${middle} ${last}`.trim()}</div>;
        }
    },

    {
        accessorKey: 'asmcL_ClassName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class Name' />,
        cell: ({ row }) => <div>{row.getValue('asmcL_ClassName')}</div>
    },

    {
        accessorKey: 'asmC_SectionName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Section Name' />,
        cell: ({ row }) => <div>{row.getValue('asmC_SectionName')}</div>
    },

    {
        accessorKey: 'amsT_Mobile',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Phone Number' />,
        cell: ({ row }) => <div>{row.getValue('amsT_Mobile')}</div>
    },

    {
        accessorKey: 'fmG_GroupName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Group Name' />,
        cell: ({ row }) => <div>{row.getValue('fmG_GroupName')}</div>
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
    rowData: IMasterStudentFeeGroupMappingList;
}) {
    const { openDeleteForm } = useFormContext<IMasterStudentFeeGroupMappingList>();

    const handleDelete = useCallback((data: IMasterStudentFeeGroupMappingList) => openDeleteForm?.(data), [openDeleteForm]);

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ delete: true, edit: false }}
            onDelete={handleDelete}
            toggleConditionKey='fycC_ActiveFlag'
        />
    );
}
