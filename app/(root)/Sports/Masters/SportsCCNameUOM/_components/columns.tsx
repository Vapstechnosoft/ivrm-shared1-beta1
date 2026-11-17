'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterSportsCCNameUOM } from '@/types/sports/masters/sports-cc-name-uom';
import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Power, PowerOff } from 'lucide-react';

export const MasterSportsCCNameUOMColumns: ColumnDef<IMasterSportsCCNameUOM>[] = [
    {
        header: 'SL.NO.',
        cell: ({ row }) => row.index + 1
    },
    {
        accessorKey: 'sportsCCName',
        header: 'Sports Name',
        enableSorting: true
    },
    {
        accessorKey: 'uomName',
        header: 'UOM',
        enableSorting: true
    },
    {
        accessorKey: 'spccmsccuoM_ActiveFlag',
        header: 'Status',
        cell: ({ row }) => (
            <Badge variant={row.original.spccmsccuoM_ActiveFlag ? 'success' : 'destructive'}>
                {row.original.spccmsccuoM_ActiveFlag ? 'Active' : 'Deactive'}
            </Badge>
        )
    },
    {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => {
            const { openEditForm, openToggleForm } = useFormContext<IMasterSportsCCNameUOM>();
            return (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary"
                        onClick={() => openEditForm(row.original)}
                        title="Edit"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <span className="text-muted-foreground">|</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={row.original.spccmsccuoM_ActiveFlag ? "h-8 w-8 text-destructive" : "h-8 w-8 text-green-600"}
                        onClick={() => openToggleForm(row.original)}
                        title={row.original.spccmsccuoM_ActiveFlag ? "Deactivate" : "Activate"}
                    >
                        {row.original.spccmsccuoM_ActiveFlag ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                    </Button>
                </div>
            );
        }
    }
];
