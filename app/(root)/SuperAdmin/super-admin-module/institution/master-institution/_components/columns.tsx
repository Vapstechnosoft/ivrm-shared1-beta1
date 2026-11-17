'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import type { IMasterInstitution } from '@/types/super-admin/super-admin-module/institution/master-institution';
import type { ColumnDef } from '@tanstack/react-table';

export const MasterInstitutionColumns: ColumnDef<IMasterInstitution>[] = [
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL.NO' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div>{continuousIndex}</div>;
        },
        enableHiding: true,
        enableSorting: false
    },
    {
        accessorKey: 'mI_Name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Institute Name' />,
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'organisationName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Trust Name' />,
        cell: ({ row }) => <div>{row.original.organisationName || row.original.mO_Name || 'N/A'}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'mI_Address1',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Address' />,
        enableSorting: true
    },

    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Edit/Activate/Deactivate' className='text-center' />,
        cell: ({ row }) => (
            <ActionButtons
                rowData={row.original}
                buttons={{ edit: true, toggle: true, delete: false }}
                toggleConditionKey='mI_ActiveFlag'
                onEdit={(data) => console.log('Edit', data)}
                onToggle={(data, checked) => console.log('Toggle', data, checked)}
            />
        )
    }
];
