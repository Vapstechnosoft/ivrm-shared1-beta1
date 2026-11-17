'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ColumnDef } from '@tanstack/react-table';
import { GenericDataTable, useDataTableProps } from '@/components/ui/view-data-table/view-generic-data-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { IFacility } from '@/types/hostel/hostel-management/masters';
import { useEffect, useState } from 'react';
import { getFloorDetails } from '@/server/hostel/hostel-management/masters/floor';
import { IMasterFloor } from './columns';

interface ViewFacilitiesModalProps {
    isOpen: boolean;
    onClose: () => void;
    floor: IMasterFloor;
}

export function ViewFacilitiesModal({ isOpen, onClose, floor }: ViewFacilitiesModalProps) {
    const [data, setData] = useState<IFacility[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && floor?.hlmF_Id) {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const res = await getFloorDetails(floor.hlmF_Id);
                    if (res.success && res.data && res.data.facilities_list) {
                        setData(res.data.facilities_list);
                    } else {
                        setData([]);
                    }
                } catch (error) {
                    console.error("Failed to fetch facilities", error);
                    setData([]);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        } else {
            setData([]);
        }
    }, [isOpen, floor]);

    const tableProps = useDataTableProps({ data, total: data.length });

    const columns: ColumnDef<IFacility>[] = [
        {
            accessorKey: 'hlmftY_FacilityName',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Facility Name' />,
            cell: ({ row }) => <div>{row.getValue('hlmftY_FacilityName')}</div>,
        }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Facilities for Floor {floor?.hrmF_FloorName}</DialogTitle>
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
                        isLoading={isLoading}
                        noDataTitle='No Facilities'
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
