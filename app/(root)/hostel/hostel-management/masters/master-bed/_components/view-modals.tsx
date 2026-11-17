'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { GenericDataTable, useDataTableProps } from '@/components/ui/view-data-table/view-generic-data-table';
import { Check, X } from 'lucide-react';
import { IBedDisplay } from '@/types/hostel/hostel-management/masters';

interface ViewFacilitiesModalProps {
    isOpen: boolean;
    onClose: () => void;
    bed: IBedDisplay | null;
}

interface FacilityStatus {
    name: string;
    hasFacility: boolean;
}

export function ViewFacilitiesModal({ isOpen, onClose, bed }: ViewFacilitiesModalProps) {
    const data: FacilityStatus[] = bed ? [
        { name: 'Mattress', hasFacility: bed.hlmB_MattressFlg },
        { name: 'BedSheet', hasFacility: bed.hlmB_BedSheetFlg },
        { name: 'Pillow', hasFacility: bed.hlmB_PillowFlg },
        { name: 'StudyTable', hasFacility: bed.hlmB_StudyTableFlg },
        { name: 'Lamp', hasFacility: bed.hlmB_LampFlg },
    ] : [];

    const tableProps = useDataTableProps({ data, total: data.length });

    const columns: ColumnDef<FacilityStatus>[] = [
        {
            accessorKey: 'name',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Facility Name' />,
            cell: ({ row }) => <div>{row.getValue('name')}</div>,
        },
        {
            accessorKey: 'hasFacility',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    {row.original.hasFacility ? (
                        <Check className="h-4 w-4 text-green-500" />
                    ) : (
                        <X className="h-4 w-4 text-red-500" />
                    )}
                </div>
            ),
        }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Facilities: {bed?.hlmB_BedName}</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <GenericDataTable
                        {...tableProps}
                        data={data}
                        totalItems={data.length}
                        columns={columns}
                        showViewOptions={false}
                        showPagination={false}
                        showSearch={false}
                        isLoading={false}
                        noDataTitle='No Facilities'
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
