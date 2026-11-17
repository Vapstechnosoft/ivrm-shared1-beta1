'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterClassYearlyList } from '@/types/fees/masters/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const masterClassYearlyCategoryColumns: ColumnDef<IMasterClassYearlyList>[] = [
    {
        accessorKey: 'fyccC_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl. No' className='w-full pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;

            return <div className='w-full pl-6'>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'asmaY_Year',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Category Name' />,
        cell: ({ row }) => <div>{row.getValue('asmaY_Year')}</div>
    },
    {
        accessorKey: 'fmcC_ClassCategoryName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Category Code' />,
        cell: ({ row }) => <div>{row.getValue('fmcC_ClassCategoryName')}</div>
    },
    {
        accessorKey: 'asmcL_ClassName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class Name' />,
        cell: ({ row }) => {
            const classNames = row.getValue('asmcL_ClassName');
            try {
                const parsed = typeof classNames === 'string' ? JSON.parse(classNames) : classNames;
                const classArray = Array.isArray(parsed) ? parsed : [parsed];
                const displayText = classArray.join(', ');
                return <div>{displayText}</div>;
            } catch {
                return <div>{String(classNames)}</div>;
            }
        }
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-start' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
        enableSorting: false
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterClassYearlyList }) {
    const { openDeleteForm, openEditForm } = useFormContext<IMasterClassYearlyList>();

    const handleDelete = useCallback((data: IMasterClassYearlyList) => openDeleteForm(data), [openDeleteForm]);
    const handleEdit = useCallback((data: IMasterClassYearlyList) => openEditForm(data), [openEditForm]);

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: false, toggle: false, delete: true }}
            onDelete={handleDelete}
            //  onEdit={handleEdit}
        />
    );
}
