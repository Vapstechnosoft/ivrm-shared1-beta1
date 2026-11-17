'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';

import type { IFeeAmountEntryList } from '@/types/fees/transactions/transactions';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const feeAmountEntryColumns: ColumnDef<IFeeAmountEntryList>[] = [
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
        accessorKey: 'fmA_Id',
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
        accessorKey: 'fmG_GroupName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Group Name' />,
        cell: ({ row }) => <div>{row.getValue('fmG_GroupName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'asmaY_Year',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Academic Year	' />,
        cell: ({ row }) => <div>{row.getValue('asmaY_Year')}</div>,
        enableSorting: true,
        enableHiding: true
    },

    {
        accessorKey: 'fmcC_ClassCategoryName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Category' />,
        cell: ({ row }) => <div>{row.getValue('fmcC_ClassCategoryName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmH_FeeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Head Name' />,
        cell: ({ row }) => <div>{row.getValue('fmH_FeeName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'ftI_Name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Installment' />,
        cell: ({ row }) => <div>{row.getValue('ftI_Name')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmA_Amount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Amount' />,
        cell: ({ row }) => <div>{row.getValue('fmA_Amount')}</div>,
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

// function ActionButtonsCell({ rowData }: { rowData: IFeeAmountEntryList }) {
//   const { openEditForm, openToggleForm } =
//     useFormContext<IFeeAmountEntryList>();

//   const handleEdit = useCallback(
//     (data: IFeeAmountEntryList) => {
//       openEditForm(data);
//     },
//     [openEditForm]
//   );

//   const handleToggle = useCallback(
//     (data: IFeeAmountEntryList) => {
//       openToggleForm(data);
//     },
//     [openToggleForm]
//   );

//   return (
//     <div style={{ display: "flex", justifyContent: "center" }}>
//       <ActionButtons
//         rowData={rowData}
//         buttons={{ edit: false, toggle: false, delete: true }}
//         onEdit={handleEdit}
//         onToggle={handleToggle}
//         //toggleConditionKey="fmA_Id"
//       />
//     </div>
//   );
// }

function ActionButtonsCell({ rowData }: { rowData: IFeeAmountEntryList }) {
    const { openEditForm, openDeleteForm } = useFormContext<IFeeAmountEntryList>();

    const handleEdit = useCallback((data: IFeeAmountEntryList) => openEditForm(data), [openEditForm]);

    const handleDelete = useCallback((data: IFeeAmountEntryList) => openDeleteForm(data), [openDeleteForm]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: false, toggle: false, delete: true }}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}
