'use client';

import { ActionButtons } from '@/components/ui/form/action-buttons';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import type { IMasterSponsor } from '@/types/sports/masters/sponsors';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { deactivateMasterSponsor } from '@/server/sports/masters/sponsors';
import { useMasterSponsors } from '@/hooks/sports/useMasterSponsors';
import { useFormContext } from '@/components/ui/form/form-provider';
import { toast } from 'sonner';

/* ============================================
   Actions Cell Component
   ============================================ */
function ActionsCell({ row }: { row: Row<IMasterSponsor> }) {
    const sponsor = row.original;
    const { openEditForm, openToggleForm } = useFormContext<IMasterSponsor>();

    return (
        <ActionButtons
            rowData={sponsor}
            buttons={{
                edit: true,
                toggle: true,
                delete: false
            }}
            onEdit={() => openEditForm(sponsor)}
            onToggle={() => openToggleForm(sponsor)}
            toggleConditionKey='spccmsP_ActiveFlag'
        />
    );
}

export const MasterSponsorColumns: ColumnDef<IMasterSponsor>[] = [
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
        accessorKey: 'spccmsP_SponsorName',
        header: 'Sponsor Name',
        cell: ({ row }) => <div className='font-medium'>{row.getValue('spccmsP_SponsorName')}</div>
    },
    {
        accessorKey: 'spccmsP_ContactPerson',
        header: 'Contact Person'
    },
    {
        accessorKey: 'spccmsP_ContactNo',
        header: 'Contact No.'
    },
    {
        accessorKey: 'spccmsP_SponsorDetails',
        header: 'Sponsor Details',
        cell: ({ row }) => (
            <div className='max-w-[300px] truncate' title={row.getValue('spccmsP_SponsorDetails')}>
                {row.getValue('spccmsP_SponsorDetails')}
            </div>
        )
    },
    {
        accessorKey: 'spccmsP_ActiveFlag',
        header: 'Status',
        cell: ({ row }) => {
            const isActive = row.getValue('spccmsP_ActiveFlag');
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
