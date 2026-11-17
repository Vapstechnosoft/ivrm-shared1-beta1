'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterTransactionNumberingList } from '@/types/admission/preadmission/configaration';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const preRegistrationnumberingColumns: ColumnDef<IMasterTransactionNumberingList>[] = [
    {
        accessorKey: 'imN_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='w-full pl-6' />,
        cell: ({ row }) => {
            return <div className='w-full pl-6'>{row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'imN_StartingNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Starting Number' />,
        cell: ({ row }) => <div>{row.getValue('imN_StartingNo') || 'N/A'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'imN_WidthNumeric',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Width of Numeric' />,
        cell: ({ row }) => <div>{row.getValue('imN_WidthNumeric') || 'N/A'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'imN_ZeroPrefixFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Zero Prefix' />,
        cell: ({ row }) => <div>{row.getValue('imN_ZeroPrefixFlag')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'imN_RestartNumFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Restart Numbering' />,
        cell: ({ row }) => <div>{row.getValue('imN_RestartNumFlag')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'imN_AutoManualFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Auto/Manual' />,
        cell: ({ row }) => <div>{row.getValue('imN_AutoManualFlag')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'imN_SuffixAcadYearCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Academic Year Suffix' />,
        cell: ({ row }) => <div>{row.getValue('imN_SuffixAcadYearCode')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'imN_PrefixAcadYearCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Prefix' />,
        cell: ({ row }) => <div>{row.getValue('imN_PrefixAcadYearCode')}</div>,
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

function ActionButtonsCell({
    rowData
}: {
    rowData: IMasterTransactionNumberingList;
}) {
    const { openEditForm } = useFormContext<IMasterTransactionNumberingList>();

    const handleEdit = useCallback(
        (data: IMasterTransactionNumberingList) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    return <ActionButtons rowData={rowData} buttons={{ edit: true, toggle: false, delete: false }} onEdit={handleEdit} />;
}
