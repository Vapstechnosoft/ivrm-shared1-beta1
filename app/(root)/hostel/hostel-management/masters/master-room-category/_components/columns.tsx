'use client';

import { DataTableColumnHeader as ColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Check, X } from 'lucide-react';

export interface IMasterRoomCategory {
    hlmrcA_Id: number;
    hlmrcA_RoomCategory: string;
    hlmrcA_Description: string;
    hlmrcA_MaxCapacity: number;
    hlmrcA_RoomRate: number;
    hlmrcA_ACFlg: boolean;
    hlmrcA_SharingFlg: boolean;
    hlmrcA_ActiveFlag: boolean;
    hlmH_Name?: string; // mapped
}

const columnHelper = createColumnHelper<IMasterRoomCategory>();

export const masterRoomCategoryColumns: ColumnDef<IMasterRoomCategory, any>[] = [
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
        accessorKey: 'hlmrcA_RoomCategory',
        header: ({ column }) => <ColumnHeader column={column} title='Room Category' />
    },
    {
        accessorKey: 'hlmrcA_MaxCapacity',
        header: ({ column }) => <ColumnHeader column={column} title='Capacity' />
    },
    {
        accessorKey: 'hlmrcA_RoomRate',
        header: ({ column }) => <ColumnHeader column={column} title='Rate' />
    },
    {
        accessorKey: 'hlmrcA_ACFlg',
        header: ({ column }) => <ColumnHeader column={column} title='AC' />,
        cell: ({ row }) => <div>{row.getValue('hlmrcA_ACFlg') ? <Check className="text-green-500 h-4 w-4" /> : <X className="text-red-500 h-4 w-4" />}</div>
    },
    {
        accessorKey: 'hlmrcA_SharingFlg',
        header: ({ column }) => <ColumnHeader column={column} title='Sharing' />,
        cell: ({ row }) => <div>{row.getValue('hlmrcA_SharingFlg') ? <Check className="text-green-500 h-4 w-4" /> : <X className="text-red-500 h-4 w-4" />}</div>
    },
    {
        id: 'actions',
        header: ({ column }) => <ColumnHeader column={column} title='Actions' className='text-center' />,
        cell: (info) => <ActionButtonsCell rowData={info.row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterRoomCategory }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterRoomCategory>();
    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: true, delete: false }}
            onEdit={openEditForm}
            onToggle={openToggleForm}
            toggleConditionKey='hlmrcA_ActiveFlag'
        />
    );
}
