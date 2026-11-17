'use client';

import { ActionButtons } from '@/components/ui/form/action-buttons';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { IMasterHouse } from '@/types/sports/masters/house';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { useFormContext } from '@/components/ui/form/form-provider';

function ActionsCell({ row }: { row: Row<IMasterHouse> }) {
    const data = row.original;
    const { openEditForm, openToggleForm } = useFormContext<IMasterHouse>();

    return (
        <ActionButtons
            rowData={data}
            buttons={{
                edit: true,
                toggle: true,
                delete: false
            }}
            onEdit={() => openEditForm(data)}
            onToggle={() => openToggleForm(data)}
            toggleConditionKey='spccmH_ActiveFlag'
        />
    );
}

export const MasterHouseColumns: ColumnDef<IMasterHouse>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
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
        accessorKey: 'spccmH_HouseName',
        id: 'spccmH_HouseName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='House Name' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('spccmH_HouseName')}</div>
    },
    {
        accessorKey: 'spccmH_HouseDescription',
        id: 'spccmH_HouseDescription',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Description' />,
        cell: ({ row }) => <div>{row.getValue('spccmH_HouseDescription')}</div>
    },
    {
        accessorKey: 'spccmH_Flag',
        id: 'spccmH_Flag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='House/Committee' />,
        cell: ({ row }) => <div>{row.getValue('spccmH_Flag')}</div>
    },
    {
        accessorKey: 'spccmH_ActiveFlag',
        id: 'spccmH_ActiveFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => {
            const isActive = row.getValue('spccmH_ActiveFlag');
            return (
                <Badge variant={isActive ? 'success' : 'destructive'} className='font-semibold'>
                    {isActive ? 'Active' : 'Deactivated'}
                </Badge>
            );
        }
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ActionsCell
    }
];
