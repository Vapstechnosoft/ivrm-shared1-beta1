'use client';

import { DataTableColumnHeader as ColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { ViewFacilitiesModal } from './view-modals';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export interface IMasterFloor {
    hlmF_Id: number;
    hrmF_FloorName: string;
    hrmF_FloorDesc: string;
    hlmH_Name: string;
    hrmF_ActiveFlag: boolean;
    hrmF_TotalRooms: number;
    hlmH_Id: number;
}

const columnHelper = createColumnHelper<IMasterFloor>();

export const masterFloorColumns: ColumnDef<IMasterFloor, any>[] = [
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
        accessorKey: 'hrmF_TotalRooms',
        header: ({ column }) => <ColumnHeader column={column} title='No Of Room' />
    },
    {
        accessorKey: 'hrmF_FloorDesc',
        header: ({ column }) => <ColumnHeader column={column} title='Description' />
    },
    {
        id: 'facilityList',
        header: ({ column }) => <ColumnHeader column={column} title='Facility List' />,
        cell: (info) => <ViewFacilitiesCell rowData={info.row.original} />,
        enableSorting: false
    },
    {
        id: 'actions',
        header: ({ column }) => <ColumnHeader column={column} title='Actions' className='text-center' />,
        cell: (info) => <ActionButtonsCell rowData={info.row.original} />
    }
];

function ViewFacilitiesCell({ rowData }: { rowData: IMasterFloor }) {
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
                    floor={rowData}
                />
            )}
        </>
    );
}

function ActionButtonsCell({ rowData }: { rowData: IMasterFloor }) {
    // ...
    const { openEditForm, openToggleForm } = useFormContext<IMasterFloor>();
    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: true, delete: false }}
            onEdit={openEditForm}
            onToggle={openToggleForm}
            toggleConditionKey='hrmF_ActiveFlag'
        />
    );
}
