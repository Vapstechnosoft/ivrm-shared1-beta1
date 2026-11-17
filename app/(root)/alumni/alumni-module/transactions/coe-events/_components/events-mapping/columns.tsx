'use client';

import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IEventsMapping } from '@/types/alumni/master-coe';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useCallback } from 'react';

export const EventsMappingColumns: ColumnDef<IEventsMapping>[] = [
    {
        accessorKey: 'sno',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL No' />,
        cell: (info) => info.row.index + 1
    },
    {
        accessorKey: 'coemE_EventName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Event Name' />,
        cell: (info) => info.getValue() as string
    },
    {
        accessorKey: 'asmaY_Year',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Academic Year' />,
        cell: (info) => info.getValue() as string
    },
    {
        accessorKey: 'coeE_EStartDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Start Date' />,
        cell: (info) => {
            const val = info.getValue() as string;
            return val ? new Date(val).toLocaleDateString() : '-';
        }
    },
    {
        accessorKey: 'coeE_EEndDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='End Date' />,
        cell: (info) => {
            const val = info.getValue() as string;
            return val ? new Date(val).toLocaleDateString() : '-';
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

function ActionButtonsCell({ rowData }: { rowData: IEventsMapping }) {
    const { openEditForm, openToggleForm, openDetailsView } = useFormContext<IEventsMapping>();

    const handleEdit = useCallback(
        (data: IEventsMapping) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IEventsMapping) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    // const handleDelete = useCallback(
    //     (data: IEventsMapping) => {
    //         openToggleForm(data);
    //     },
    //     [openToggleForm]
    // );

    const handleView = useCallback(
        (data: IEventsMapping) => {
            openDetailsView(data);
        },
        [openDetailsView]
    );

    return (
        <div className='flex items-center justify-center gap-2'>
            <Button variant='ghost' size='icon' onClick={() => handleView(rowData)} title='View Details'>
                <Eye className='h-4 w-4 text-primary' />
            </Button>
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: true, toggle: true }}
                onEdit={handleEdit}
                onToggle={handleToggle}
                //onDelete={handleDelete}
                toggleConditionKey='coeE_ActiveFlag'
            />
        </div>
    );
}
