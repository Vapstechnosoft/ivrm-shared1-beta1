// _components/columns.tsx
'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useSecondaryFormContext } from '@/components/ui/form/secondary-form-provider';
import type { IMasterStudentClassMappingList } from '@/types/fees/masters/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const masterFeeStudentClassMapping: ColumnDef<IMasterStudentClassMappingList>[] = [
    {
        id: 'selectAndSlNo',
        header: ({ table }) => (
            <div className='flex items-center gap-3 pl-6'>
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                />
                <span>Sl. No</span>
            </div>
        ),
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex || 0;
            const pageSize = table.getState().pagination.pageSize || 10;

            const slNo = pageIndex * pageSize + row.index + 1;

            return (
                <div className='flex items-center gap-3 pl-6'>
                    <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />
                    <span>{slNo}</span>
                </div>
            );
        },

        enableSorting: false,
        enableHiding: false
    },

    {
        accessorKey: 'registrationNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Registration No' />,
        cell: ({ row }) => <div>{row.getValue('registrationNo')}</div>,
        enableSorting: false,
        enableHiding: false
    },

    {
        accessorKey: 'admissionNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Admission No' />,
        cell: ({ row }) => <div>{row.getValue('admissionNo')}</div>,
        enableSorting: false,
        enableHiding: false
    },

    {
        accessorKey: 'firstName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
        cell: ({ row }) => {
            const first = row.original.firstName || '';
            const middle = row.original.middleName || '';
            const last = row.original.lastName || '';

            return <div>{`${first} ${middle} ${last}`.trim()}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },

    {
        accessorKey: 'className',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class Name' />,
        cell: ({ row }) => <div>{row.getValue('className')}</div>,
        enableSorting: false,
        enableHiding: false
    },

    {
        accessorKey: 'sectionName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Section Name' />,
        cell: ({ row }) => <div>{row.getValue('sectionName')}</div>,
        enableSorting: false,
        enableHiding: false
    },

    {
        accessorKey: 'rollNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Roll No' />,
        cell: ({ row }) => <div>{row.getValue('rollNo')}</div>,
        enableSorting: false,
        enableHiding: false
    },

    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-start' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
        enableSorting: false
    }
];

function ActionButtonsCell({
    rowData
}: {
    rowData: IMasterStudentClassMappingList;
}) {
    const { openEditForm } = useSecondaryFormContext<IMasterStudentClassMappingList>();

    const handleView = useCallback((data: IMasterStudentClassMappingList) => openEditForm?.(data), [openEditForm]);

    return <ActionButtons rowData={rowData} buttons={{ delete: false, edit: true }} onEdit={handleView} />;
}
