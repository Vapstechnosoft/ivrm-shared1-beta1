'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterProfessionalTaxList } from '@/types/hrms/hrms-config/master';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';
export const columns: ColumnDef<IMasterProfessionalTaxList>[] = [
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
        accessorKey: 'hrmpT_SalaryFrom',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Salary From' />
    },
    {
        accessorKey: 'hrmpT_SalaryTo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Salary To' />
    },
    {
        accessorKey: 'hrmpT_PTax',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Professional Tax' />
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-start' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
        enableSorting: false
    }
];
function ActionButtonsCell({ rowData }: { rowData: IMasterProfessionalTaxList }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterProfessionalTaxList>();

    const handleEdit = useCallback(
        (data: IMasterProfessionalTaxList) => {
            openEditForm(data as any);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterProfessionalTaxList) => {
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
            toggleConditionKey='hrmpT_ActiveFlag'
        />
    );
}
