'use client';

import { DataTable } from '@/components/ui/data-table/data-table';
import { studentColumns, staffColumns, guestColumns } from './columns';
import { GenericDataTable } from '@/components/ui/view-data-table/view-generic-data-table';

interface VacateRoomListProps {
    data: any[];
    type: 'student' | 'staff' | 'guest';
}

export default function VacateRoomList({ data, type }: VacateRoomListProps) {
    const columns = type === 'student' ? studentColumns : (type === 'staff' ? staffColumns : guestColumns);
    return <GenericDataTable columns={columns} data={data} isLoading={false} />;
}
