'use client';

import { ActionButtons } from '@/components/ui/form/action-buttons';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { IMasterUOM } from '@/types/sports/masters/uom';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { useFormContext } from '@/components/ui/form/form-provider';

function ActionsCell({ row }: { row: Row<IMasterUOM> }) {
    const data = row.original;
    const { openEditForm, openToggleForm } = useFormContext<IMasterUOM>();

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
            toggleConditionKey='spccmuoM_ActiveFlag'
        />
    );
}

export const MasterUOMColumns: ColumnDef<IMasterUOM>[] = [
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
        accessorFn: (row: any) => row.spccmuoM_UOMName || row.SPCCMUOM_UOMName || row.spccmuom_UOMName || row.masterUOMname || row.MasterUOMname,
        id: 'spccmuoM_UOMName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='UOM Name' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('spccmuoM_UOMName')}</div>
    },
    {
        accessorFn: (row: any) => row.spccmuoM_ActiveFlag ?? row.SPCCMUOM_ActiveFlag ?? row.spccmuom_ActiveFlag ?? row.activeFlag,
        id: 'spccmuoM_ActiveFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => {
            const isActive = row.getValue('spccmuoM_ActiveFlag');
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
