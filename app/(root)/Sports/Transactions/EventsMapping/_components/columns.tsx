'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { useFormContext } from '@/components/ui/form/form-provider';
import { useEventMapping } from '@/hooks/sports/useEventMapping';
import { Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IEventsMappingData } from '@/types/sports/events-mapping';

export const eventsMappingColumns: ColumnDef<IEventsMappingData>[] = [
    {
        id: 'slno',
        header: 'Sl.No.',
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: 'asmaY_Year',
        header: 'Academic Year',
    },
    {
        accessorKey: 'spccmE_EventName',
        header: 'Event Name',
    },
    {
        accessorKey: 'spccmeV_EventVenue',
        header: 'Venue Name',
    },
    {
        accessorKey: 'spccE_StartDate',
        header: 'Start Date',
        cell: ({ row }) => {
            const date = row.original.spccE_StartDate;
            return date ? new Date(date).toLocaleDateString() : '';
        }
    },
    {
        accessorKey: 'spccE_StartTime',
        header: 'Start Time',
        cell: ({ row }) => {
            return <div className="lowercase">{row.getValue("spccE_StartTime")}</div>
        }
    },
    {
        accessorKey: 'spccE_EndDate',
        header: 'End Date',
        cell: ({ row }) => {
            const date = row.original.spccE_EndDate;
            return date ? new Date(date).toLocaleDateString() : '';
        }
    },
    {
        accessorKey: 'spccE_EndTime',
        header: 'End Time',
        cell: ({ row }) => {
            return <div className="lowercase">{row.getValue("spccE_EndTime")}</div>
        }
    },
    {
        accessorKey: 'spccE_Remarks',
        header: 'Remarks',
    },
    {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => {
            return <ActionsCell row={row.original} />;
        },
    },
];

const ActionsCell = ({ row }: { row: IEventsMappingData }) => {
    const { deactivate } = useEventMapping();
    const { openEditForm } = useFormContext<IEventsMappingData>();

    const isActive = row.spccE_ActiveFlag;

    return (
        <div className='flex items-center gap-3'>
            <Button
                variant='ghost'
                size='sm'
                onClick={() => openEditForm(row)}
                className='h-8 w-8 p-0 text-primary hover:bg-primary/10'>
                <Edit className='h-4 w-4' />
            </Button>
            <Button
                variant='link'
                size='sm'
                onClick={() => deactivate.mutate({ ASMAY_Id: row.asmaY_Id, SPCCE_Id: row.spccE_Id })}
                className={cn(
                    'h-auto p-0 font-medium text-xs',
                    isActive ? 'text-destructive hover:text-destructive/80' : 'text-green-600 hover:text-green-700'
                )}>
                {isActive ? 'Deactivate' : 'Activate'}
            </Button>
        </div>
    );
};
