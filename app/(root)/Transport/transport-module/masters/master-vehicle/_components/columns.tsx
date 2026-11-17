'use client';
import { getStatusBadge } from '@/components/extras/helpers/helper';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterVehicle } from '@/types/transport/transport-module/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';

export const vehicleColumns: ColumnDef<IMasterVehicle>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <input
                type="checkbox"
                checked={table.getIsAllPageRowsSelected()}
                onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <input
                type="checkbox"
                checked={row.getIsSelected()}
                onChange={(e) => row.toggleSelected(!!e.target.checked)}
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL.No.' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div>{continuousIndex}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'trmV_VehicleName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Vehicle Name' />,
        cell: ({ row }) => <div>{row.original.trmV_VehicleName}</div>
    },
    {
        accessorKey: 'trmV_VehicleNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Vehicle No' />,
        cell: ({ row }) => <div>{row.original.trmV_VehicleNo}</div>
    },
    {
        accessorKey: 'trmV_EngineNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Engine No' />,
        cell: ({ row }) => <div>{row.original.trmV_EngineNo}</div>
    },
    {
        accessorKey: 'trmV_ChassisNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Chassis No' />,
        cell: ({ row }) => <div>{row.original.trmV_ChassisNo}</div>
    },
    {
        accessorKey: 'trmV_Capacity',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Capacity' />,
        cell: ({ row }) => <div>{row.original.trmV_Capacity}</div>
    },
    {
        accessorKey: 'trmV_PurchaseDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Purchase Date' />,
        cell: ({ row }) => <div>{row.original.trmV_PurchaseDate ? format(new Date(row.original.trmV_PurchaseDate), 'dd/MM/yyyy') : ''}</div>
    },
    {
        id: 'documents',
        header: ({ column }) => <DataTableColumnHeader column={column} title='View Documents' className='text-center' />,
        cell: ({ row }) => <ViewDocumentsCell rowData={row.original} />
    },
    {
        accessorKey: 'trmV_ActiveFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => getStatusBadge(row.original.trmV_ActiveFlag ? 'active' : 'inactive')
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Action' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterVehicle }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterVehicle>();

    const handleEdit = useCallback(
        (data: IMasterVehicle) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterVehicle) => {
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
            toggleConditionKey='trmV_ActiveFlag'
        />
    );
}

function ViewDocumentsCell({ rowData }: { rowData: IMasterVehicle }) {
    const { openDocumentView } = useFormContext<IMasterVehicle>();

    return (
        <div className="flex justify-center">
            <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700"
                onClick={() => openDocumentView(rowData)}
            >
                <Eye className="h-4 w-4" />
            </Button>
        </div>
    );
}
