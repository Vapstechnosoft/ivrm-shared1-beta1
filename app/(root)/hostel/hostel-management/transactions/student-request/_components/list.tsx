'use client';

import { DataTable } from '@/components/ui/data-table';
import { GenericDataTable } from '@/components/ui/view-data-table/view-generic-data-table';
import { studentRequestColumns } from './columns';

interface StudentRequestListProps {
    data: any[];
    onEdit: (data: any) => void;
    onToggle: (data: any) => void;
}

export default function StudentRequestList({ data, onEdit, onToggle }: StudentRequestListProps) {
    return (
        <GenericDataTable
            columns={studentRequestColumns}
            data={data}
            isLoading={false}
        />
    );
}
