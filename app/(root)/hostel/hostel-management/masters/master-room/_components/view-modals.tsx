'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ColumnDef } from '@tanstack/react-table';
import { GenericDataTable, useDataTableProps } from '@/components/ui/view-data-table/view-generic-data-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { IFacility, IRoomDisplay } from '@/types/hostel/hostel-management/masters';
import { useEffect, useState } from 'react';
import { getMappedFacilitiesForRoom } from '@/server/hostel/hostel-management/masters/room';

interface ViewFacilitiesModalProps {
    isOpen: boolean;
    onClose: () => void;
    room: IRoomDisplay;
}

export function ViewFacilitiesModal({ isOpen, onClose, room }: ViewFacilitiesModalProps) {
    const [data, setData] = useState<IFacility[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && room?.hrmrM_Id) {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const res = await getMappedFacilitiesForRoom(room.hrmrM_Id);
                    if (res.success && res.data) {
                        // Assuming response might be directly the list or within a property
                        setData(Array.isArray(res.data) ? res.data : (res.data.facilities_list || []));
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
    }, [isOpen, room]);

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
                    <DialogTitle>Facilities for Room {room?.hrmrM_RoomNo}</DialogTitle>
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
