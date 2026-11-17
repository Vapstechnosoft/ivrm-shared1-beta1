'use client';

import { ActionButtons } from '@/components/ui/form/action-buttons';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { IMasterCompetitionLevel } from '@/types/sports/masters/competition-level';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { deactivateMasterCompetitionLevel } from '@/server/sports/masters/competition-level';
import { useMasterCompetitionLevels } from '@/hooks/sports/useMasterCompetitionLevels';
import { useFormContext } from '@/components/ui/form/form-provider';
import { toast } from 'sonner';

/* ============================================
   Actions Cell Component
   ============================================ */
function ActionsCell({ row }: { row: Row<IMasterCompetitionLevel> }) {
    const data = row.original;
    const { openEditForm, openToggleForm } = useFormContext<IMasterCompetitionLevel>();

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
            toggleConditionKey='spccmcL_ActiveFlag'
        />
    );
}

export const MasterCompetitionLevelColumns: ColumnDef<IMasterCompetitionLevel>[] = [
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
        accessorKey: 'spccmcL_CompitionLevel',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Competition Level Name' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('spccmcL_CompitionLevel')}</div>
    },
    {
        accessorKey: 'spccmcL_CLDesc',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Description' />,
        cell: ({ row }) => (
            <div className='max-w-[400px] truncate' title={row.getValue('spccmcL_CLDesc')}>
                {row.getValue('spccmcL_CLDesc')}
            </div>
        )
    },
    {
        accessorKey: 'spccmcL_ActiveFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => {
            const isActive = row.getValue('spccmcL_ActiveFlag');
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
