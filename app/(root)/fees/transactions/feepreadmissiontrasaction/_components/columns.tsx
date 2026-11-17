'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';

import type { IFeePreAdmissionTransactionDetails } from '@/types/fees/transactions/transactions';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useCallback } from 'react';

export const feePreAdmissionTransactionEntryColumns: ColumnDef<IFeePreAdmissionTransactionDetails>[] = [
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
        accessorKey: 'slno',
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
        accessorKey: 'studentName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Student Name' />,
        cell: ({ row }) => <div>{row.getValue('studentName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'classname',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class Name' />,
        cell: ({ row }) => <div>{row.getValue('classname')}</div>,
        enableSorting: true,
        enableHiding: true
    },

    {
        accessorKey: 'studentRegNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Student Reg No' />,
        cell: ({ row }) => <div>{row.getValue('studentRegNo')}</div>,
        enableSorting: true,
        enableHiding: true
    },

    {
        accessorKey: 'studentMobile',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Student Mobile No' />,
        cell: ({ row }) => <div>{row.getValue('studentMobile')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'studentEmail',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Student Email' />,
        cell: ({ row }) => <div>{row.getValue('studentEmail')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'receiptNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Receipt Number' />,
        cell: ({ row }) => <div>{row.getValue('receiptNo')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'paidDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Paid Date' />,
        cell: ({ row }) => <div>{row.getValue('paidDate')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'paidAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Paid Amount' />,
        cell: ({ row }) => <div>{row.getValue('paidAmount')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'modeOfPayment',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Mode Of Payment' />,
        cell: ({ row }) => <div>{row.getValue('modeOfPayment')}</div>,
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

function ActionButtonsCell({ rowData }: { rowData: IFeePreAdmissionTransactionDetails }) {
    const { openEditForm, openDeleteForm, openDetailsView } = useFormContext<IFeePreAdmissionTransactionDetails>();

    const handleEdit = useCallback((data: IFeePreAdmissionTransactionDetails) => openEditForm(data), [openEditForm]);

    const handleDelete = useCallback((data: IFeePreAdmissionTransactionDetails) => openDeleteForm(data), [openDeleteForm]);

    const handleView = useCallback(() => {
        openDetailsView(rowData);
    }, [openDetailsView, rowData]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            {/* 👁️ Eye icon for viewing grade details */}
            <button type='button' onClick={handleView} className='rounded-md p-2 transition hover:bg-muted' title='View Grade Details'>
                <Eye className='h-4 w-4 text-blue-600' />
            </button>
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: false, toggle: false, delete: false }}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}
