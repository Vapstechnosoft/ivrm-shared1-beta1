'use client';

import { DataTableColumnHeader as ColumnHeader } from '@/components/ui/data-table-column-header';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Check, X } from 'lucide-react';
import type { IMasterFacility } from '@/schemas/hostel/masters';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import { useCallback } from 'react';

const columnHelper = createColumnHelper<IMasterFacility>();


export const masterFacilityColumns: ColumnDef<IMasterFacility, any>[] = [
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
        accessorKey: 'hlmftY_FacilityName',
        header: ({ column }) => <ColumnHeader column={column} title='Facility Name' />
    },
    {
        accessorKey: 'hlmftY_FacilityDesc',
        header: ({ column }) => <ColumnHeader column={column} title='Description' />
    },
    {
        accessorKey: 'hlmftY_ActiveFlag',
        header: ({ column }) => <ColumnHeader column={column} title='Status' />,
        cell: ({ row }) =>
            row.original.hlmftY_ActiveFlag ? (
                <span className='flex items-center text-green-600 font-medium'>
                    <Check className='mr-1 h-4 w-4' /> Active
                </span>
            ) : (
                <span className='flex items-center text-red-600 font-medium'>
                    <X className='mr-1 h-4 w-4' /> Inactive
                </span>
            )
    },
    {
        id: 'actions',
        header: ({ column }) => <ColumnHeader column={column} title='Actions' className='text-center' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterFacility }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterFacility>();

    const handleEdit = useCallback(
        (data: IMasterFacility) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterFacility) => {
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
            toggleConditionKey='hlmftY_ActiveFlag'
        />
    );
}
