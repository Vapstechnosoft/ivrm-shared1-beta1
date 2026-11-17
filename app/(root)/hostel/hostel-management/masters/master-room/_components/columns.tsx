'use client';

import { DataTableColumnHeader as ColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { ViewFacilitiesModal } from './view-modals';
import { IRoomDisplay } from '@/types/hostel/hostel-management/masters';

const columnHelper = createColumnHelper<IRoomDisplay>();

export const masterRoomColumns: ColumnDef<IRoomDisplay, any>[] = [
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
        accessorKey: 'hlmH_Name',
        header: ({ column }) => <ColumnHeader column={column} title='Hostel Name' />
    },
    {
        accessorKey: 'hrmF_FloorName',
        header: ({ column }) => <ColumnHeader column={column} title='Floor' />
    },
    {
        accessorKey: 'hlmrcA_RoomCategory',
        header: ({ column }) => <ColumnHeader column={column} title='Room Category' />
    },
    {
        accessorKey: 'hrmrM_SharingFlg',
        header: ({ column }) => <ColumnHeader column={column} title='Sharing' />,
        cell: (info) => info.getValue() ? 'Yes' : 'No'
    },
    {
        accessorKey: 'hrmrM_ACFlg',
        header: ({ column }) => <ColumnHeader column={column} title='Room Type' />,
        cell: (info) => info.getValue() ? 'AC' : 'Non-AC'
    },
    {
        accessorKey: 'hrmrM_RoomNo',
        header: ({ column }) => <ColumnHeader column={column} title='Room No.' />
    },
    {
        accessorKey: 'hrmrM_BedCapacity',
        header: ({ column }) => <ColumnHeader column={column} title='Bed Capacity' />
    },
    {
        id: 'facilityList',
        header: ({ column }) => <ColumnHeader column={column} title='Facility List' />,
        cell: (info) => <ViewFacilitiesCell rowData={info.row.original} />,
        enableSorting: false
    },
    {
        id: 'actions',
        header: ({ column }) => <ColumnHeader column={column} title='Action' className='text-center' />,
        cell: (info) => <ActionButtonsCell rowData={info.row.original} />
    }
];

function ViewFacilitiesCell({ rowData }: { rowData: IRoomDisplay }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <button
                type="button"
                className="flex items-center gap-1 text-primary hover:underline hover:text-blue-600"
                onClick={() => setIsOpen(true)}
            >
                <Eye className="h-4 w-4" /> View Facility
            </button>
            {isOpen && (
                <ViewFacilitiesModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    room={rowData}
                />
            )}
        </>
    );
}

function ActionButtonsCell({ rowData }: { rowData: IRoomDisplay }) {
    const { openEditForm, openToggleForm } = useFormContext<IRoomDisplay>();
    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: true, delete: false }}
            onEdit={openEditForm}
            onToggle={openToggleForm}
            toggleConditionKey='hrmrM_ActiveFlag'
        />
    );
}
