'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterCasteList } from '@/types/admission/preadmission/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const masterCasteColumns: ColumnDef<IMasterCasteList>[] = [
    {
        accessorKey: 'imC_Id',
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
        accessorKey: 'imcC_CategoryName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Caste Category' />,
        cell: ({ row }) => <div>{row.getValue('imcC_CategoryName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'imC_CasteName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Caste Name' />,
        cell: ({ row }) => <div>{row.getValue('imC_CasteName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'imC_CasteDesc',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Caste Description' />,
        cell: ({ row }) => (
            <div className='max-w-[200px] overflow-hidden truncate text-ellipsis'>
                {row.getValue('imC_CasteDesc') === null || row.getValue('imC_CasteDesc') === undefined
                    ? 'N.A'
                    : row.getValue('imC_CasteDesc')}
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

function ActionButtonsCell({ rowData }: { rowData: IMasterCasteList }) {
    const { openEditForm } = useFormContext<IMasterCasteList>();

    const handleEdit = useCallback(
        (data: IMasterCasteList) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    return <ActionButtons rowData={rowData} buttons={{ edit: true, toggle: false, delete: false }} onEdit={handleEdit} />;
}
