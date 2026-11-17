'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { LeaveApplication } from '../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ColumnActionsProps {
    onCancel: (leave: LeaveApplication) => void;
    onEdit: (leave: LeaveApplication) => void;
}

// Helper to create columns with actions injected
export const createColumns = ({ onCancel, onEdit }: ColumnActionsProps): ColumnDef<LeaveApplication>[] => [
    {
        id: 'serialNumber',
        header: 'SL.No.',
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
    },
    {
        accessorKey: 'amsT_FirstName',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="hover:bg-transparent"
                >
                    Student Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'asmcL_ClassName',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="hover:bg-transparent"
                >
                    Class
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'asmC_SectionName',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="hover:bg-transparent"
                >
                    Section
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'aslA_Flag',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="hover:bg-transparent"
                >
                    Leave Mode
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <Badge variant={row.original.aslA_Flag === 'Leave' ? 'default' : 'secondary'}>
                {row.original.aslA_Flag}
            </Badge>
        ),
    },
    {
        accessorKey: 'aslA_ApplyDate',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="hover:bg-transparent"
                >
                    Apply Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => format(new Date(row.original.aslA_ApplyDate), 'dd/MM/yyyy'),
    },
    {
        accessorKey: 'aslA_FromDate',
        header: 'From Date',
        cell: ({ row }) => format(new Date(row.original.aslA_FromDate), 'dd/MM/yyyy'),
    },
    {
        accessorKey: 'aslA_ToDate',
        header: 'To Date',
        cell: ({ row }) => format(new Date(row.original.aslA_ToDate), 'dd/MM/yyyy'),
    },
    {
        accessorKey: 'aslA_Status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.aslA_Status;
            let variant: "default" | "secondary" | "destructive" | "outline" = "outline";

            if (status === 'Approved') variant = "default"; // Green-ish usually
            else if (status === 'Rejected') variant = "destructive";
            else if (status === 'Pending') variant = "secondary";

            return <Badge variant={variant}>{status}</Badge>;
        },
    },
    {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => {
            const leave = row.original;
            const isPending = leave.aslA_Status === 'Pending';

            return (
                <div className="flex items-center gap-2">
                    {isPending && (
                        <>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={() => onCancel(leave)}>
                                            <Ban className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Cancel Leave</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={() => onEdit(leave)}>
                                            <Edit className="h-4 w-4 text-blue-500" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Edit Leave</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </>
                    )}
                </div>
            );
        },
    },
];
