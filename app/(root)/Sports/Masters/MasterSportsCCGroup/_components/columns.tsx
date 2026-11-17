'use client';

import { ActionButtons } from '@/components/ui/form/action-buttons';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterSportsCCGroup } from '@/types/sports/masters/sports-cc-group';
import type { ColumnDef, Row } from '@tanstack/react-table';

/* ============================================
   Actions Cell Component
   ============================================ */
function ActionsCell({ row }: { row: Row<IMasterSportsCCGroup> }) {
    const data = row.original;
    const { openEditForm, openToggleForm } = useFormContext<IMasterSportsCCGroup>();

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
            toggleConditionKey='spccmsccG_ActiveFlag'
        />
    );
}

export const MasterSportsCCGroupColumns: ColumnDef<IMasterSportsCCGroup>[] = [
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
        accessorKey: 'rowIndex',
        header: 'SL.NO',
        cell: ({ row }) => <div className='text-center'>{row.index + 1}</div>,
        enableSorting: false,
        enableHiding: false,
        size: 50
    },
    {
        accessorKey: 'spccmsccG_SportsCCGroupName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Group Name' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('spccmsccG_SportsCCGroupName')}</div>
    },
    {
        accessorKey: 'spccmsccG_SportsCCGroupDesc',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Description' />,
        cell: ({ row }) => (
            <div className='max-w-[400px] truncate' title={row.getValue('spccmsccG_SportsCCGroupDesc')}>
                {row.getValue('spccmsccG_SportsCCGroupDesc')}
            </div>
        )
    },
    {
        accessorKey: 'spccmsccG_SCCFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SCC Flag' />
    },
    {
        accessorKey: 'spccmsccG_ActiveFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => {
            const isActive = row.getValue('spccmsccG_ActiveFlag');
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
