'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IYearEndReport } from '@/types/sports/reports/year-end-report';

export const columns: ColumnDef<IYearEndReport>[] = [
    {
        header: 'SL.NO.',
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: 'houseName',
        header: 'House',
    },
    {
        accessorKey: 'studentName',
        header: 'Student Name',
    },
    {
        accessorKey: 'admNo',
        header: 'Adm.No.',
    },
    {
        accessorKey: 'className',
        header: 'Class',
    },
    {
        accessorKey: 'sectionName',
        header: 'Section',
    },
    {
        accessorKey: 'spccmE_EventName',
        header: 'Event',
    },
    {
        accessorKey: 'spccmeV_EventVenue',
        header: 'Venue',
    },
    {
        accessorKey: 'spccmscC_SportsCCName',
        header: 'SportsName',
    },
    {
        accessorKey: 'spccE_StartDate',
        header: 'Event Date',
        cell: ({ row }) => {
            if (!row.original.spccE_StartDate) return '';
            const date = new Date(row.original.spccE_StartDate);
            return date.toLocaleDateString('en-GB');
        },
    },
    {
        accessorKey: 'points',
        header: 'Points',
    },
    {
        accessorKey: 'spccestR_Rank',
        header: 'Place',
    },
];
