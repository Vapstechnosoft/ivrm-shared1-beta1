'use client';

import { DataTableColumnHeader as ColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import { IMess } from '@/server/hostel/hostel-management/masters/mess';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<IMess>();

export const masterMessColumns: ColumnDef<IMess, any>[] = [
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
        accessorKey: 'hlmM_Name',
        header: ({ column }) => <ColumnHeader column={column} title='Mess Name' />
    },
    {
        accessorKey: 'hlmM_BFSStartTime',
        header: ({ column }) => <ColumnHeader column={column} title='Breakfast' />,
        cell: (info) => info.getValue() || '-'
    },
    {
        accessorKey: 'hlmM_LNStartTime',
        header: ({ column }) => <ColumnHeader column={column} title='Lunch' />,
        cell: (info) => info.getValue() || '-'
    },
    {
        accessorKey: 'hlmM_DNSStartTime',
        header: ({ column }) => <ColumnHeader column={column} title='Dinner' />,
        cell: (info) => info.getValue() || '-'
    },
    {
        id: 'actions',
        header: ({ column }) => <ColumnHeader column={column} title='Actions' className='text-center' />,
        cell: (info) => <ActionButtonsCell rowData={info.row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMess }) {
    const { openEditForm, openToggleForm } = useFormContext<IMess>();
    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: true, delete: false }}
            onEdit={openEditForm}
            onToggle={openToggleForm}
            toggleConditionKey='hlmM_ActiveFlag'
        />
    );
}
