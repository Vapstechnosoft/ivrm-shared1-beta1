'use client';

import { DataTableColumnHeader as ColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

export interface IMasterMessCategory {
    hlmmC_Id: number;
    hlmmC_Name: string;
    hlmmC_ActiveFlag: boolean;
}

const columnHelper = createColumnHelper<IMasterMessCategory>();

export const masterMessCategoryColumns: ColumnDef<IMasterMessCategory, any>[] = [
    {
        accessorKey: 'sn',
        header: ({ column }) => <ColumnHeader column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'hlmmC_Name',
        header: ({ column }) => <ColumnHeader column={column} title='Mess Category Name' />
    },
    {
        id: 'actions',
        header: ({ column }) => <ColumnHeader column={column} title='Actions' className='text-center' />,
        cell: (info) => <ActionButtonsCell rowData={info.row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterMessCategory }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterMessCategory>();
    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: true, delete: false }}
            onEdit={openEditForm}
            onToggle={openToggleForm}
            toggleConditionKey='hlmmC_ActiveFlag'
        />
    );
}
