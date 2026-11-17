'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { ICategoryClassMapping } from '@/types/timetable/masters/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const categoryClassMappingColumns: ColumnDef<ICategoryClassMapping>[] = [
    {
        accessorKey: 'ttcC_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='pl-6'>{continuousIndex}</div>;
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'academicName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Academic Year' />,
        cell: ({ row }) => <div>{row.getValue('academicName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'categoryName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Category Name' />,
        cell: ({ row }) => <div>{row.getValue('categoryName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'className',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class Name' />,
        cell: ({ row }) => <div>{row.getValue('className')}</div>,
        enableSorting: true,
        enableHiding: true
    }
    //,

    // {
    //     id: 'actions',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' />,
    //     accessorFn: (row: any) => row,
    //     enableSorting: false,
    //     cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    // }
];

function ActionButtonsCell({ rowData }: { rowData: ICategoryClassMapping }) {
    const { openEditForm, openToggleForm } = useFormContext<ICategoryClassMapping>();

    const handleEdit = useCallback(
        (data: ICategoryClassMapping) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: ICategoryClassMapping) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: false, toggle: false, delete: false }}
            onEdit={handleEdit}
            onToggle={handleToggle}
            toggleConditionKey='ttmB_ActiveFlag'
        />
    );
}
