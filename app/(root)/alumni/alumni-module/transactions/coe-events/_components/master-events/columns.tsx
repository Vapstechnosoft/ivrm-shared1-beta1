'use client';

import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterEvent } from '@/types/alumni/master-coe';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useCallback } from 'react';

export const MasterEventsColumns: ColumnDef<IMasterEvent>[] = [
    {
        accessorKey: 'sno',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
        cell: (info) => info.row.index + 1,
        enableSorting: false
    },
    {
        accessorKey: 'coemE_EventName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Event Name' />,
        cell: (info) => info.getValue() as string,
        enableSorting: true
    },
    {
        accessorKey: 'coemE_EventDesc',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Description' />,
        cell: (info) => {
            const desc = info.getValue() as string | null;
            return <div className='max-w-md truncate'>{desc || '-'}</div>;
        }
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterEvent }) {
    const { openEditForm, openToggleForm, openMappedview } = useFormContext<IMasterEvent>();

    const handleEdit = useCallback(
        (data: IMasterEvent) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterEvent) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    const handleDelete = useCallback(
        (data: IMasterEvent) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    const handleView = useCallback(
        (data: IMasterEvent) => {
            openMappedview(data);
        },
        [openMappedview]
    );

    return (
        <div className='flex items-center justify-center gap-2'>
            <Button variant='ghost' size='icon' onClick={() => handleView(rowData)} title='View Mappings'>
                <Eye className='h-4 w-4 text-primary' />
            </Button>
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: true, toggle: true, delete: true }}
                onEdit={handleEdit}
                onToggle={handleToggle}
                //onDelete={handleDelete}
                toggleConditionKey='coemE_ActiveFlag'
            />
        </div>
    );
}
