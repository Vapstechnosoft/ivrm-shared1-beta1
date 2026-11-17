'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterTermFeeHeadDueDateList } from '@/types/fees/masters/masters';

import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const feetermheadDueDateColumns: ColumnDef<IMasterTermFeeHeadDueDateList>[] = [
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
        accessorKey: 'headnamed',
        header: ({ column }) => <DataTableColumnHeader column={column} title='FeeHead' />,
        cell: ({ row }) => <div>{row.getValue('headnamed')}</div>,
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
        accessorKey: 'fdate1',
        header: ({ column }) => <DataTableColumnHeader column={column} title='From Date' />,
        cell: ({ row }) => {
            const value = row.getValue('fdate1') as string | null;
            const formattedDate = value
                ? (() => {
                      const [year, month, day] = value.split('T')[0].split('-');
                      return `${day}-${month}-${year}`; // DD-MM-YYYY
                  })()
                : '';
            return <div>{formattedDate}</div>;
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'tdate1',
        header: ({ column }) => <DataTableColumnHeader column={column} title='To Date' />,
        cell: ({ row }) => {
            const value = row.getValue('tdate1') as string | null;
            const formattedDate = value
                ? (() => {
                      const [year, month, day] = value.split('T')[0].split('-');
                      return `${day}-${month}-${year}`;
                  })()
                : '';
            return <div>{formattedDate}</div>;
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'aplc1',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Applicable Date' />,
        cell: ({ row }) => {
            const value = row.getValue('aplc1') as string | null;
            const formattedDate = value
                ? (() => {
                      const [year, month, day] = value.split('T')[0].split('-');
                      return `${day}-${month}-${year}`;
                  })()
                : '';
            return <div>{formattedDate}</div>;
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'ddate1',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Due Date' />,
        cell: ({ row }) => {
            const value = row.getValue('ddate1') as string | null;
            const formattedDate = value
                ? (() => {
                      const [year, month, day] = value.split('T')[0].split('-');
                      return `${day}-${month}-${year}`;
                  })()
                : '';
            return <div>{formattedDate}</div>;
        },
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

function ActionButtonsCell({ rowData }: { rowData: IMasterTermFeeHeadDueDateList }) {
    const { openEditForm, openDeleteForm } = useFormContext<IMasterTermFeeHeadDueDateList>();

    const handleEdit = useCallback((data: IMasterTermFeeHeadDueDateList) => openEditForm(data), [openEditForm]);

    const handleDelete = useCallback((data: IMasterTermFeeHeadDueDateList) => openDeleteForm(data), [openDeleteForm]);

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
