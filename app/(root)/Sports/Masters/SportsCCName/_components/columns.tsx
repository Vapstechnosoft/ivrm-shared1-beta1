'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { SportsCCNameDTO } from '@/types/sports/masters/sports-cc-name';

interface ColumnsProps {
    onEdit: (data: SportsCCNameDTO) => void;
    onDelete: (row: SportsCCNameDTO) => void;
}

export const createColumns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<SportsCCNameDTO>[] => [
    {
        id: 'slNo',
        header: 'SL.NO',
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
    },
    {
        accessorKey: 'groupName',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Group Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'spccmscC_SportsCCName',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Sports Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'spccmscC_SportsCCDesc',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Description
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'spccmscC_SGFlag',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    SG Flag
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'spccmscC_NoOfMembers',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    No.Of Members
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'spccmscC_RecHighLowFlag',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    High/Low Flag
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => {
            const data = row.original;
            return (
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(data)}>
                        <Pencil className="h-4 w-4 text-primary" />
                    </Button>
                    <div className="flex items-center space-x-1">
                        <Switch
                            checked={data.spccmscC_ActiveFlag}
                            onCheckedChange={() => onDelete(data)}
                        />
                        <span className={data.spccmscC_ActiveFlag ? "text-green-600 text-xs" : "text-red-600 text-xs"}>
                            {data.spccmscC_ActiveFlag ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
            );
        },
    },
];
