'use client';

import { DataTableColumnHeader as ColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { ViewFacilitiesModal } from './view-modals';
import { IBedDisplay } from '@/types/hostel/hostel-management/masters';

const columnHelper = createColumnHelper<IBedDisplay>();

export const masterBedColumns: ColumnDef<IBedDisplay, any>[] = [
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
        header: ({ column }) => <ColumnHeader column={column} title='Floor Name' />
    },
    {
        accessorKey: 'hrmrM_RoomNo',
        header: ({ column }) => <ColumnHeader column={column} title='Room No' />
    },
    {
        accessorKey: 'hlmB_BedName',
        header: ({ column }) => <ColumnHeader column={column} title='Bed Name' />
    },
    {
        id: 'facilityList',
        header: ({ column }) => <ColumnHeader column={column} title='Facility' />,
        cell: (info) => <ViewFacilitiesCell rowData={info.row.original} />,
        enableSorting: false
    },
    {
        id: 'actions',
        header: ({ column }) => <ColumnHeader column={column} title='Action' className='text-center' />,
        cell: (info) => <ActionButtonsCell rowData={info.row.original} />
    }
];

function ViewFacilitiesCell({ rowData }: { rowData: IBedDisplay }) {
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
                    bed={rowData}
                />
            )}
        </>
    );
}

function ActionButtonsCell({ rowData }: { rowData: IBedDisplay }) {
    const { openEditForm, openToggleForm } = useFormContext<IBedDisplay>();
    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: true, delete: false }}
            onEdit={openEditForm}
            onToggle={openToggleForm}
            toggleConditionKey='hlmB_ActiveFlag'
        />
    );
}
