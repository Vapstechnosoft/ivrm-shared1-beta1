'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterFeesInstallmentDuedateList } from '@/types/fees/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const masterInstallmentColumns: ColumnDef<IMasterFeesInstallmentDuedateList>[] = [
    // {
    //     accessorKey: 'ftidD_Id',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title='SL NO' />,
    //     cell: ({ row }) => <div>{row.index + 1}</div>,
    //     enableSorting: false,
    //     enableHiding: false
    // },
    {
        accessorKey: 'ftidD_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='pl-6'>{continuousIndex} </div>;
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'ftI_Name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Installment Name' />,
        cell: ({ row }) => <div>{row.getValue('ftI_Name') ?? '-'}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'ftidD_FromDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='From Date' />,
        cell: ({ row }) => <div>{formatDate(row.getValue('ftidD_FromDate'))}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'ftidD_ToDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='To Date' />,
        cell: ({ row }) => <div>{formatDate(row.getValue('ftidD_ToDate'))}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'ftidD_ApplicableDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Applicable Date' />,
        cell: ({ row }) => <div>{formatDate(row.getValue('ftidD_ApplicableDate'))}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'ftidD_DueDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Due Date' />,
        cell: ({ row }) => <div>{formatDate(row.getValue('ftidD_DueDate'))}</div>,
        enableSorting: true
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' />,
        accessorFn: (row) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

// function formatDate(dateString: string) {
//     if (!dateString || dateString === '0001-01-01T00:00:00') return '-';
//     return new Date(dateString).toLocaleDateString();
// }

function formatDate(dateString: string) {
    if (!dateString || dateString === '0001-01-01T00:00:00') return '-';

    const date = new Date(dateString);

    const month = String(date.getMonth() + 1).padStart(2, '0'); // MM
    const day = String(date.getDate()).padStart(2, '0'); // DD
    const year = date.getFullYear(); // YYYY

    //return `${month}/${day}/${year}`;

    return `${day}/${month}/${year}`;
}

function ActionButtonsCell({
    rowData
}: {
    rowData: IMasterFeesInstallmentDuedateList;
}) {
    const { openEditForm, openDeleteForm } = useFormContext<IMasterFeesInstallmentDuedateList>();

    const handleEdit = useCallback(
        (data: IMasterFeesInstallmentDuedateList) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleDelete = useCallback(
        (data: IMasterFeesInstallmentDuedateList) => {
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
            toggleConditionKey='returnval'
        />
    );
}
