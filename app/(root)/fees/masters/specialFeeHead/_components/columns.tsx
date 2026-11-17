'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IspecialFeeHeadList } from '@/types/fees/masters';

import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const specialFeeHeadColumns: ColumnDef<IspecialFeeHeadList>[] = [
    // {
    //     id: 'select',
    //     header: ({ table }) => (
    //         <Checkbox
    //             checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
    //             onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //             aria-label='Select all'
    //         />
    //     ),
    //     cell: ({ row }) => (
    //         <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' />
    //     ),
    //     enableSorting: false,
    //     enableHiding: false,
    //     size: 24
    // },
    {
        accessorKey: 'fmsfhfH_Id',
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
        accessorKey: 'fmsfH_Name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Special Fee Head Name' />,
        cell: ({ row }) => <div>{row.getValue('fmsfH_Name')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmH_Name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Head Name' />,
        cell: ({ row }) => <div>{row.getValue('fmH_Name')}</div>,
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

// function ActionButtonsCell({ rowData }: { rowData: IMasterTermFeeHeadList }) {
//   const { openEditForm, openToggleForm } =
//     useFormContext<IMasterTermFeeHeadList>();

//   const handleEdit = useCallback(
//     (data: IMasterTermFeeHeadList) => {
//       openEditForm(data);
//     },
//     [openEditForm]
//   );

//   const handleToggle = useCallback(
//     (data: IMasterTermFeeHeadList) => {
//       openToggleForm(data);
//     },
//     [openToggleForm]
//   );

//   return (
//     <div style={{ display: "flex", justifyContent: "center" }}>
//       <ActionButtons
//         rowData={rowData}
//         buttons={{ edit: true, toggle: false, delete: true }}
//         onEdit={handleEdit}
//         onToggle={handleToggle}
//         toggleConditionKey="idforedt"
//       />
//     </div>
//   );
// }

function ActionButtonsCell({ rowData }: { rowData: IspecialFeeHeadList }) {
    const { openEditForm, openToggleForm } = useFormContext<IspecialFeeHeadList>();

    const handleEdit = useCallback((data: IspecialFeeHeadList) => openEditForm(data), [openEditForm]);

    const handleToggle = useCallback(
        (data: IspecialFeeHeadList) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: true, delete: false }}
            onEdit={handleEdit}
            onToggle={handleToggle}
            toggleConditionKey='fmsfhfH_ActiceFlag'
        />
    );
}
