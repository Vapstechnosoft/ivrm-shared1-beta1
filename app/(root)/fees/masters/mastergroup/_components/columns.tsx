'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterGroupList } from '@/types/fees/masters/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const MasterGroupsColumns: ColumnDef<IMasterGroupList>[] = [
    {
        accessorKey: 'fmG_Id',
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
        accessorKey: 'fmG_GroupName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Fee Group' />,
        cell: ({ row }) => <div>{row.getValue('fmG_GroupName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmG_Remarks',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Remarks' />,
        cell: ({ row }) => <div>{row.getValue('fmG_Remarks')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmG_TransportFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Transport' />,
        cell: ({ row }) => <div className='text-center'>{row.getValue('fmG_TransportFlg') ? 'Yes' : 'No'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmG_HostelFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Hostel' />,
        cell: ({ row }) => <div className='text-center'>{row.getValue('fmG_HostelFlg') ? 'Yes' : 'No'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmG_CompulsoryFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Compulsory' />,
        cell: ({ row }) => {
            const value = row.getValue('fmG_CompulsoryFlag');
            return <div className='text-center'>{value === '1' ? 'Yes' : 'No'}</div>;
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmG_RegNewFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Regular' />,
        cell: ({ row }) => {
            const value = row.getValue('fmG_RegNewFlg');
            return <div className='text-center'>{value === 'R' ? 'Yes' : 'No'}</div>;
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmG_RegNewFlg',
        id: 'newStudent',
        header: ({ column }) => <DataTableColumnHeader column={column} title='New Student' />,
        cell: ({ row }) => {
            const value = row.getValue('fmG_RegNewFlg');
            return <div className='text-center'>{value === 'N' ? 'Yes' : 'No'}</div>;
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

function ActionButtonsCell({ rowData }: { rowData: IMasterGroupList }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterGroupList>();

    const handleEdit = useCallback(
        (data: IMasterGroupList) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterGroupList) => {
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
            toggleConditionKey='fmG_ActiceFlag'
        />
    );
}
