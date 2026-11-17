'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterEventVenue } from '@/types/sports/masters/venue';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Power } from 'lucide-react';

/* ============================================
   Actions Cell Component
   ============================================ */
function ActionsCell({ row }: { row: Row<IMasterEventVenue> }) {
    const data = row.original;
    const { openEditForm, openToggleForm } = useFormContext<IMasterEventVenue>();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                    <span className='sr-only'>Open menu</span>
                    <MoreHorizontal className='h-4 w-4' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => openEditForm(data)}>
                    <Edit className='mr-2 h-4 w-4' />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openToggleForm(data)}>
                    <Power className='mr-2 h-4 w-4' />
                    {data.spccmeV_ActiveFlag ? 'Deactivate' : 'Activate'}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/* ============================================
   Status Cell Component
   ============================================ */
function StatusCell({ row }: { row: Row<IMasterEventVenue> }) {
    const data = row.original;
    const { openToggleForm } = useFormContext<IMasterEventVenue>();

    const status = data.spccmeV_ActiveFlag;

    return (
        <div
            className={`cursor-pointer rounded-full px-2 py-1 text-center text-xs font-semibold ${status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
            onClick={() => openToggleForm(data)}>
            {status ? 'Active' : 'Inactive'}
        </div>
    );
}

/* ============================================
   Master Venue Columns Definition
   ============================================ */
export const MasterVenueColumns: ColumnDef<IMasterEventVenue>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label='Select all'
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label='Select row'
            />
        ),
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'spccmeV_EventVenue',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Event Venue' />
    },
    {
        accessorKey: 'spccmeV_EventVenueDesc',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Event Venue Description' />
    },
    {
        accessorKey: 'spccmeV_ActiveFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: StatusCell
    },
    {
        id: 'actions',
        cell: ActionsCell
    }
];
