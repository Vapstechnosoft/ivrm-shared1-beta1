'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterCasteCategoryList } from '@/types/admission/preadmission/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const masterCasteCategoryColumns: ColumnDef<IMasterCasteCategoryList>[] = [
    {
        accessorKey: 'imcC_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='w-full pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='w-full pl-6'>{continuousIndex}</div>;
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'imcC_CategoryCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Category Code' />,
        cell: ({ row }) => <div>{row.getValue('imcC_CategoryCode')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'imcC_CategoryName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Caste Category Name' />,
        cell: ({ row }) => <div>{row.getValue('imcC_CategoryName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'imcC_CategoryDesc',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Caste Category Description' />,
        cell: ({ row }) => (
            <div className='max-w-[200px] overflow-hidden truncate text-ellipsis'>
                {row.getValue('imcC_CategoryDesc') === null || row.getValue('imcC_CategoryDesc') === undefined
                    ? 'N.A'
                    : row.getValue('imcC_CategoryDesc')}
            </div>
        ),
        enableSorting: false,
        enableHiding: true
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-start' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterCasteCategoryList }) {
    const { openEditForm, openDeleteForm } = useFormContext<IMasterCasteCategoryList>();

    const handleEdit = useCallback(
        (data: IMasterCasteCategoryList) => {
            openEditForm(data);
        },
        [openEditForm]
    );
    const handleDelete = useCallback(
        (data: IMasterCasteCategoryList) => {
            openDeleteForm(data);
        },
        [openDeleteForm]
    );
    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: false, delete: true }}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );
}
