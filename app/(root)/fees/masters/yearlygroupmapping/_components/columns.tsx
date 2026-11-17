'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

interface IFeeGroupMapping {
    fyghM_Id: number;
    mI_Id: number;
    asmaY_Id: number;
    fmG_Id: number;
    fmH_Id: number;
    fmI_Id: number;
    fyghM_FineApplicableFlag: boolean | null;
    fyghM_Common_AmountFlag: boolean | null;
    fyghM_ActiveFlag: boolean | null;
    fmG_GroupName: string;
    fmH_FeeName: string;
    fmI_Name: string;
    returnval: boolean;
    userid: number;
    deleteId: number;
}

export const yearlyGroupMappingColumns: ColumnDef<IFeeGroupMapping>[] = [
    {
        accessorKey: 'fyghM_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div>{continuousIndex}</div>;
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'fmG_GroupName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Fee Group Name' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('fmG_GroupName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmH_FeeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Fee Head Name' />,
        cell: ({ row }) => <div>{row.getValue('fmH_FeeName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmI_Name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Installment' />,
        cell: ({ row }) => <div>{row.getValue('fmI_Name')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fyghM_FineApplicableFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Fine Applicable' />,
        cell: ({ row }) => {
            const value = row.getValue('fyghM_FineApplicableFlag');
            return <div className='text-center'>{value === 'Y' ? 'Yes' : 'No'}</div>;
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fyghM_Common_AmountFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Common Amount' />,
        cell: ({ row }) => {
            const value = row.getValue('fyghM_Common_AmountFlag');
            return <div className='text-center'>{value === 'Y' ? 'Yes' : 'No'}</div>;
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-start' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
        enableSorting: false
    }
];

function ActionButtonsCell({ rowData }: { rowData: IFeeGroupMapping }) {
    const { openEditForm, openDeleteForm } = useFormContext<IFeeGroupMapping>();

    const handleEdit = useCallback(
        (data: IFeeGroupMapping) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleDelete = useCallback(
        (data: IFeeGroupMapping) => {
            openDeleteForm(data);
        },
        [openDeleteForm]
    );

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: false, toggle: false, delete: true }}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );
}
