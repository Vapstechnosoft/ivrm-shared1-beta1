'use client';

import { DataTable } from '@/components/ui/data-table/data-table';
import { staffAllotmentColumns, type StaffAllotmentColumn } from './columns';
import { GenericDataTable } from '@/components/ui/view-data-table/view-generic-data-table';

interface StaffAllotmentListProps {
    data: StaffAllotmentColumn[];
    onEdit: (row: StaffAllotmentColumn) => void;
}

export default function StaffAllotmentList({ data, onEdit }: StaffAllotmentListProps) {
    return <GenericDataTable columns={staffAllotmentColumns} data={data} isLoading={false} />;
}
