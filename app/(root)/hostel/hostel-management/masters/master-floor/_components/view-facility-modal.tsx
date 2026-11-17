'use client';

import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { IFacility } from '@/types/hostel/hostel-management/masters';
import { IMasterFloor } from './columns';

interface ViewFacilityModalProps {
    isOpen: boolean;
    onClose: () => void;
    floor: IMasterFloor | null;
}

export default function ViewFacilityModal({ isOpen, onClose, floor }: ViewFacilityModalProps) {
    const { data: facilities, isLoading } = useMappedFacilities(floor?.hlmF_Id);

    const mappedData = facilities || [];
    const tableProps = useDataTableProps({ data: mappedData, total: mappedData.length });

    const columns: ColumnDef<IFacility>[] = [
        {
            accessorKey: 'hlmftY_Id',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='w-full pl-6' />,
            cell: ({ row }) => {
                const index = row.index + 1;
                return <div className='w-full pl-6'>{index}</div>;
            },
            enableSorting: false,
        },
        {
            accessorKey: 'hlmftY_FacilityName',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Facility Name' />,
            cell: ({ row }) => <div>{row.getValue('hlmftY_FacilityName')}</div>,
            enableSorting: true,
        }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Facilities for {floor?.hrmF_FloorName} ({floor?.hlmH_Name})</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <GenericDataTable
                        {...tableProps}
                        data={mappedData}
                        totalItems={mappedData.length}
                        columns={columns}
                        isLoading={isLoading}
                        showViewOptions={false}
                        isPaginationRequired={false}
                        isSearchRequired={false}
                        loadingMessage='Loading facilities...'
                        noDataTitle='No Facilities Found'
                        noDataDescription='No facilities mapped to this floor'
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
function useMappedFacilities(hlmF_Id: any): { data: any; isLoading: any; } {
    throw new Error('Function not implemented.');
}

