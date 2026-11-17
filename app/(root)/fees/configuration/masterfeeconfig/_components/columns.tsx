'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IFeeConfig } from '@/types/fees/configuration/feesconfiguration';

import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const feesConfigColumns: ColumnDef<IFeeConfig>[] = [
    //   {
    //     id: "select",
    //     header: ({ table }) => (
    //       <Checkbox
    //         checked={
    //           table.getIsAllPageRowsSelected() ||
    //           (table.getIsSomePageRowsSelected() && "indeterminate")
    //         }
    //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //         aria-label="Select all"
    //       />
    //     ),
    //     cell: ({ row }) => (
    //       <Checkbox
    //         checked={row.getIsSelected()}
    //         onCheckedChange={(value) => row.toggleSelected(!!value)}
    //         aria-label="Select row"
    //       />
    //     ),
    //     enableSorting: false,
    //     enableHiding: false,
    //     size: 24,
    //   },
    {
        accessorKey: 'fmC_Id',
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
        accessorKey: 'mI_Name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Institution Name' />,
        cell: ({ row }) => <div>{row.getValue('mI_Name')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'userName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Name' />,
        cell: ({ row }) => <div>{row.getValue('userName')}</div>,
        enableSorting: true,
        enableHiding: true
    },

    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IFeeConfig }) {
    const { openEditForm, openToggleForm } = useFormContext<IFeeConfig>();

    const handleEdit = useCallback(
        (data: IFeeConfig) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IFeeConfig) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    return (
        <div className='flex justify-center'>
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: true, toggle: false, delete: false }}
                onEdit={handleEdit}
                onToggle={handleToggle}
                toggleConditionKey='fmC_Id'
            />
        </div>
    );
}
