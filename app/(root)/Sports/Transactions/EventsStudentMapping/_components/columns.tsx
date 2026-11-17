'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { IEventsStudentMappingData } from '@/types/sports/events-student-mapping';
import { Badge } from '@/components/ui/badge';
import { useEventsStudentMapping } from '@/hooks/sports/useEventsStudentMapping';

// Simple columns for the display grid (the "Saved" list)
export const eventsStudentMappingColumns: ColumnDef<IEventsStudentMappingData>[] = [
    {
        accessorKey: 'studentName',
        header: 'Student Name',
    },
    {
        accessorKey: 'amsT_AdmNo',
        header: 'Adm No.',
    },
    {
        accessorKey: 'asmcL_ClassName',
        header: 'Class',
    },
    {
        accessorKey: 'asmC_SectionName',
        header: 'Section',
    },
    {
        accessorKey: 'spccmH_HouseName',
        header: 'House',
    },
    {
        accessorKey: 'eventName',
        header: 'Event',
    },
    {
        accessorKey: 'spccestR_Points',
        header: 'Points',
    },
    {
        accessorKey: 'spccestR_Rank',
        header: 'Rank',
    },
    {
        accessorKey: 'spccestR_ActiveFlag',
        header: 'Status',
        cell: ({ row }) => {
            const isActive = row.getValue('spccestR_ActiveFlag');
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

function ActionsCell({ row }: { row: Row<IEventsStudentMappingData> }) {
    const mapping = row.original;
    const { deactivateData } = useEventsStudentMapping();

    return (
        <ActionButtons
            rowData={mapping}
            buttons={{
                edit: false, // Edit usually involves reloading the form, disabling for now unless requested
                toggle: true,
                delete: false
            }}
            onToggle={() => {
                deactivateData.mutate({
                    id: mapping.spccestR_Id,
                    activeFlag: !mapping.spccestR_ActiveFlag
                });
            }}
            toggleConditionKey='spccestR_ActiveFlag'
        />
    );
}
