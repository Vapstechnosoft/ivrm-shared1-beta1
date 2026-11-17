'use client';

import { studentAllotmentColumns } from './columns';
import { GenericDataTable } from '@/components/ui/view-data-table/view-generic-data-table';

interface StudentAllotmentListProps {
    data: any[];
}

export default function StudentAllotmentList({ data }: StudentAllotmentListProps) {
    return (
        <div className="mt-6">
            <GenericDataTable columns={studentAllotmentColumns} data={data} isLoading={false} />
        </div>
    );
}