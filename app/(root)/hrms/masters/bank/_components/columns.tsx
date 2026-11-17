'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterBankList } from '@/types/hrms/hrms-config/master';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';
export const columns: ColumnDef<IMasterBankList>[] = [
    {
        id: 'slNo',
        header: () => <div className='text-center font-medium'>Sl No</div>,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='text-center'>{continuousIndex}</div>;
        },
        enableSorting: false,
        size: 60
    },
    {
        accessorKey: 'hrmbD_BankName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Bank Name' className='whitespace-nowrap' />
    },
    {
        accessorKey: 'hrmbD_BranchName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Branch Name' className='whitespace-nowrap' />
    },
    {
        accessorKey: 'hrmbD_BankAccountNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Account No' className='whitespace-nowrap' />
    },
    {
        accessorKey: 'hrmbD_IFSCCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='IFSC Code' className='whitespace-nowrap' />
    },
    {
        accessorKey: 'hrmbD_BankAddress',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Address' className='whitespace-nowrap' />,
        cell: ({ row }) => (
            <div className='max-w-[200px] overflow-hidden truncate text-ellipsis'>{row.getValue('hrmbD_BankAddress') || 'N/A'}</div>
        )
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='whitespace-nowrap text-start' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
        enableSorting: false
    }
];
function ActionButtonsCell({ rowData }: { rowData: IMasterBankList }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterBankList>();

    const handleEdit = useCallback(
        (data: IMasterBankList) => {
            openEditForm(data as any);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterBankList) => {
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
            toggleConditionKey='hrmbD_ActiveFlag'
        />
    );
}
