'use client';

import { DataTable } from '@/components/ui/data-table';
import { staffRequestColumns } from './columns';
import { GenericDataTable } from '@/components/ui/view-data-table/view-generic-data-table';

interface StaffRequestListProps {
    data: any[];
    onEdit: (data: any) => void;
    onToggle: (data: any) => void;
}

export default function StaffRequestList({ data, onEdit, onToggle }: StaffRequestListProps) {
    return (
        <GenericDataTable
            columns={staffRequestColumns}
            data={data}
            isLoading={false}
        />
    );
}
