'use client';

import { DataTableColumnHeader as ColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Eye } from 'lucide-react';


const columnHelper = createColumnHelper<IHostel>();

export const masterHostelColumns: ColumnDef<IHostel, any>[] = [
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
        accessorKey: 'hlmH_TotalFloor',
        header: ({ column }) => <ColumnHeader column={column} title='Total Floor' />
    },
    {
        accessorKey: 'hlmH_TotalRoom',
        header: ({ column }) => <ColumnHeader column={column} title='Total Room' />
    },
    {
        accessorKey: 'ivrmmC_CountryName',
        header: ({ column }) => <ColumnHeader column={column} title='Country' />
    },
    {
        accessorKey: 'ivrmmS_Name',
        header: ({ column }) => <ColumnHeader column={column} title='State' />
    },
    {
        accessorKey: 'hlmH_City',
        header: ({ column }) => <ColumnHeader column={column} title='City' />
    },
    {
        accessorKey: 'hlmH_ContactNo',
        header: ({ column }) => <ColumnHeader column={column} title='Contact' />
    },
    {
        accessorKey: 'hlmH_Address',
        header: ({ column }) => <ColumnHeader column={column} title='Address' />
    },
    {
        id: 'facilityList',
        header: ({ column }) => <ColumnHeader column={column} title='Facility List' />,
        cell: (info) => <ViewFacilitiesCell rowData={info.row.original} />,
        enableSorting: false
    },
    {
        id: 'wardenList',
        header: ({ column }) => <ColumnHeader column={column} title='Warden List' />,
        cell: (info) => <ViewWardensCell rowData={info.row.original} />,
        enableSorting: false
    },
    {
        id: 'view',
        header: ({ column }) => <ColumnHeader column={column} title='View' />,
        cell: (info) => <ViewDocumentsCell rowData={info.row.original} />,
        enableSorting: false
    },
    {
        id: 'actions',
        header: ({ column }) => <ColumnHeader column={column} title='Actions' className='text-center' />,
        cell: (info) => <ActionButtonsCell rowData={info.row.original} />
    }
];

import { ViewFacilitiesModal, ViewWardensModal, ViewDocumentsModal } from './view-modals';
import { useState } from 'react';
import { IHostel } from '@/types/hostel/hostel-management/masters';

// ... (existing imports and interface)

// ... (existing columns definitions up to ViewFacilitiesCell)

function ViewFacilitiesCell({ rowData }: { rowData: IHostel }) {
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
                    hostel={rowData}
                />
            )}
        </>
    );
}

function ViewWardensCell({ rowData }: { rowData: IHostel }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <button
                type="button"
                className="flex items-center gap-1 text-primary hover:underline hover:text-blue-600"
                onClick={() => setIsOpen(true)}
            >
                <Eye className="h-4 w-4" /> View Emps
            </button>
            {isOpen && (
                <ViewWardensModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    hostel={rowData ?? null}
                />
            )}
        </>
    );
}

function ViewDocumentsCell({ rowData }: { rowData: IHostel }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <button
                type="button"
                className="flex items-center gap-1 text-primary hover:underline hover:text-blue-600"
                onClick={() => setIsOpen(true)}
            >
                <Eye className="h-4 w-4" />
            </button>
            {isOpen && (
                <ViewDocumentsModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    hostel={rowData}
                />
            )}
        </>
    );
}

function ActionButtonsCell({ rowData }: { rowData: IHostel }) {
    const { openEditForm, openToggleForm } = useFormContext<IHostel>();
    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: true, delete: false }}
            onEdit={openEditForm}
            onToggle={openToggleForm}
            toggleConditionKey='hlmH_ActiveFlag'
        />
    );
}
