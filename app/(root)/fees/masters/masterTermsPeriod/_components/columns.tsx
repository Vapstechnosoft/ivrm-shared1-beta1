'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterTermsPeriodList } from '@/types/fees/masters/masters';

import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const termsPeriodColumns: ColumnDef<IMasterTermsPeriodList>[] = [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && "indeterminate")
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    //   size: 24,
    // },
    {
        accessorKey: 'fmtfhdD_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='pl-6'> {continuousIndex}</div>;
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'termname',
        header: ({ column }) => <DataTableColumnHeader column={column} title='TermName' />,
        cell: ({ row }) => <div>{row.getValue('termname')}</div>,
        enableSorting: true,
        enableHiding: true
    },

    {
        accessorKey: 'yearname',
        header: ({ column }) => <DataTableColumnHeader column={column} title='AcademicYear' />,
        cell: ({ row }) => <div>{row.getValue('yearname')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmtP_Year',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Year' />,
        cell: ({ row }) => <div>{row.getValue('fmtP_Year')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fromMonth',
        header: ({ column }) => <DataTableColumnHeader column={column} title='From Month' />,
        cell: ({ row }) => <div>{row.getValue('fromMonth')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmtToMonth',
        header: ({ column }) => <DataTableColumnHeader column={column} title='To Month' />,
        cell: ({ row }) => <div>{row.getValue('fmtToMonth')}</div>,
        enableSorting: true,
        enableHiding: true
    },

    {
        accessorKey: 'feeFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Fee Type' />,
        cell: ({ row }) => <div>{row.getValue('feeFlag')}</div>,
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

function ActionButtonsCell({ rowData }: { rowData: IMasterTermsPeriodList }) {
    const { openEditForm, openDeleteForm } = useFormContext<IMasterTermsPeriodList>();

    const handleEdit = useCallback((data: IMasterTermsPeriodList) => openEditForm(data), [openEditForm]);

    const handleDelete = useCallback((data: IMasterTermsPeriodList) => openDeleteForm(data), [openDeleteForm]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: true, toggle: false, delete: true }}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}
