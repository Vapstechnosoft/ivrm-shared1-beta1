'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { BookRegisterPayload } from '@/types/library/masters/bookRegister';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const BookRegisterColumns: ColumnDef<BookRegisterPayload>[] = [
    {
        id: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl. No' className='w-full pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='w-full pl-6'>{continuousIndex}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'lmB_BookTitle',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Book Title' />,
        cell: ({ row }) => <div>{row.getValue('lmB_BookTitle')}</div>
    },
    {
        accessorKey: 'lmbanO_AccessionNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Accession No' />,
        cell: ({ row }) => <div>{row.getValue('lmbanO_AccessionNo')}</div>
    },
    {
        accessorKey: 'lmP_PublisherName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Publisher Name' />,
        cell: ({ row }) => <div>{row.getValue('lmP_PublisherName')}</div>
    },
    {
        accessorKey: 'lmD_DepartmentName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Dept Name' />,
        cell: ({ row }) => <div>{row.getValue('lmD_DepartmentName')}</div>
    },
    {
        accessorKey: 'lmS_SubjectName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Subject Name' />,
        cell: ({ row }) => <div>{row.getValue('lmS_SubjectName')}</div>
    },
    {
        accessorKey: 'lmL_LanguageName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Language' />,
        cell: ({ row }) => <div>{row.getValue('lmL_LanguageName')}</div>
    },
    {
        accessorKey: 'lmrA_RackName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Rack Name' />,
        cell: ({ row }) => <div>{row.getValue('lmrA_RackName')}</div>
    },
    {
        accessorKey: 'authoR_FullName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Author Name' />,
        cell: ({ row }) => <div>{row.getValue('authoR_FullName')}</div>
    },
    {
        accessorKey: 'lmbanO_AvialableStatus',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => {
            const status = row.getValue('lmbanO_AvialableStatus') as string;
            return (
                <Badge
                    variant={
                        status === 'Available'
                            ? 'default'
                            : status === 'lost'
                              ? 'destructive'
                              : status === 'Issued'
                                ? 'secondary'
                                : 'outline'
                    }>
                    {status}
                </Badge>
            );
        }
    },
    {
        accessorKey: 'mB_ActiveFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Active' />,
        cell: ({ row }) => {
            const isActive = row.getValue('mB_ActiveFlag') as boolean;
            return <Badge variant={isActive ? 'default' : 'destructive'}>{isActive ? 'Active' : 'Inactive'}</Badge>;
        }
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-start' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: BookRegisterPayload }) {
    const { openToggleForm, openEditForm } = useFormContext<BookRegisterPayload>();

    const handleToggle = useCallback(
        (data: BookRegisterPayload) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    const handleEdit = useCallback((data: BookRegisterPayload) => openEditForm(data), [openEditForm]);

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: true, delete: false }}
            onToggle={handleToggle}
            onEdit={handleEdit}
            toggleConditionKey='mB_ActiveFlag' // Changed from LMB_ActiveFlag to mB_ActiveFlag
        />
    );
}
