'use client';

import { DataTable } from '@/components/ui/data-table/data-table';
import { guestAllotmentColumns, type GuestAllotmentColumn } from './columns';
import { GenericDataTable } from '@/components/ui/view-data-table/view-generic-data-table';

interface GuestAllotmentListProps {
    data: GuestAllotmentColumn[];
    onEdit: (row: GuestAllotmentColumn) => void;
}

export default function GuestAllotmentList({ data, onEdit }: GuestAllotmentListProps) {
    return <GenericDataTable columns={guestAllotmentColumns} data={data} isLoading={false} />;
}
