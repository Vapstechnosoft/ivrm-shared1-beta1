'use client';

import { DataTable } from '@/components/ui/data-table';
import { roomTransferColumns } from './columns'; // Updated import

interface RoomTransferListProps {
    data: any[];
}

export default function RoomTransferList({ data }: RoomTransferListProps) {
    return (
        <DataTable
            columns={roomTransferColumns} // Updated prop
            data={data}
            totalItems={data.length} // Added required prop
            //manualPagination={false} // Enable client-side pagination
        />
    );
}
