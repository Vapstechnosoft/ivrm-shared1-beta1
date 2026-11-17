'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IfeeCompanyGroupMappingList } from '@/types/fees/masters';

import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const feeCompanyGroupMappingColumns: ColumnDef<IfeeCompanyGroupMappingList>[] = [
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
        accessorKey: 'ffgcmA_Id',
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
        accessorKey: 'ftmcoM_CompanyName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Company Name' />,
        cell: ({ row }) => <div>{row.getValue('ftmcoM_CompanyName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmG_GroupName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Group Name' />,
        cell: ({ row }) => <div>{row.getValue('fmG_GroupName')}</div>,
        enableSorting: true,
        enableHiding: true
    },

    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' />,
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

function ActionButtonsCell({ rowData }: { rowData: IfeeCompanyGroupMappingList }) {
    const { openEditForm, openToggleForm } = useFormContext<IfeeCompanyGroupMappingList>();

    const handleEdit = useCallback((data: IfeeCompanyGroupMappingList) => openEditForm(data), [openEditForm]);

    const handleToggle = useCallback(
        (data: IfeeCompanyGroupMappingList) => {
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
            toggleConditionKey='ffgcmA_ActiveId'
        />
    );
}
