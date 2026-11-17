'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import type { IInstitutionSubscription } from '@/types/super-admin/super-admin-module/institution/institution-subscription';
import { Badge } from '@/components/ui/badge';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const InstitutionSubscriptionColumns: ColumnDef<IInstitutionSubscription>[] = [
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL.NO' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div>{continuousIndex}</div>;
        },
        enableHiding: true,
        enableSorting: false
    },
    {
        accessorKey: 'institutionName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Institute Name' />,
        cell: ({ row }) => <div>{row.original.institutionName || 'N/A'}</div>,
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'misV_SubscriptionType',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Subscription Type' />,
        enableSorting: true
    },
    {
        accessorKey: 'misV_FromDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Start Date' />,
        cell: ({ row }) => <div>{row.original.misV_FromDate ? format(new Date(row.original.misV_FromDate), 'dd-MM-yyyy') : ''}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'misV_ToDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='End Date' />,
        cell: ({ row }) => <div>{row.original.misV_ToDate ? format(new Date(row.original.misV_ToDate), 'dd-MM-yyyy') : ''}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'misV_ActiveFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => (
            <Badge variant={row.original.misV_ActiveFlag ? 'default' : 'destructive'} className='w-20 justify-center'>
                {row.original.misV_ActiveFlag ? 'Active' : 'Deactivate'}
            </Badge>
        ),
        size: 100
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Edit/Activate/Deactivate' className='text-center' />,
        cell: ({ row }) => (
            <div className='flex items-center justify-center gap-2'>
                <ActionButtons
                    rowData={row.original}
                    buttons={{ edit: true, toggle: true, delete: false }}
                    toggleConditionKey='misV_ActiveFlag'
                    onEdit={(data) => console.log('Edit', data)}
                    onToggle={(data, checked) => console.log('Toggle', data, checked)}
                />
                {row.original.misV_ActiveFlag && row.original.misV_ApprovalFlag !== 'P' && (
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => console.log('Renewal Request', row.original)}
                        title='Renewal Request'
                        className='text-green-600 hover:text-green-700 hover:bg-green-50'
                    >
                        <RefreshCw className='h-4 w-4' />
                    </Button>
                )}
            </div>
        )
    }
];
