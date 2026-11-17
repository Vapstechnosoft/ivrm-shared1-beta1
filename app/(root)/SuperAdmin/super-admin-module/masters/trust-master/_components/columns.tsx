'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { activateDeactivateTrustMaster } from '@/server/super-admin/super-admin-module/masters/trust-master';
import type { ITrustMaster } from '@/types/super-admin/super-admin-module/trust-masters';
import type { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';

import { useFormContext } from '@/components/ui/form/form-provider';
import { useCallback } from 'react';

const TrustMasterActionCell = ({ row }: { row: any }) => {
    const { openToggleForm } = useFormContext<ITrustMaster>();

    const handleToggle = useCallback(
        (data: ITrustMaster) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    return (
        <ActionButtons
            rowData={row.original}
            buttons={{ edit: false, toggle: true, delete: false }}
            toggleConditionKey='mO_ActiveFlag'
            onToggle={handleToggle}
        />
    );
};

export const TrustMasterColumns: ColumnDef<ITrustMaster>[] = [
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
        accessorKey: 'mO_Name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Trust Name' />,
        cell: ({ row }) => <div>{row.getValue('mO_Name')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'mO_OrganisationType',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Trust Type' />,
        cell: ({ row }) => <div>{row.getValue('mO_OrganisationType')}</div>,
        enableSorting: true
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Activate/Deactivate' className='text-center' />,
        cell: ({ row }) => <TrustMasterActionCell row={row} />,
        enableSorting: false
    }
];
