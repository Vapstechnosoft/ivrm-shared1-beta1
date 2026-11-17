'use client';

import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { studentReportColumns, staffReportColumns, guestReportColumns } from './columns';

interface VacateReportListProps {
    data: any[];
    type: 'student' | 'staff' | 'guest';
}

export default function VacateReportList({ data, type }: VacateReportListProps) {
    const columns = type === 'student' ? studentReportColumns : (type === 'staff' ? staffReportColumns : guestReportColumns);
    return <GenericDataTable columns={columns} data={data} isLoading={false} />;
}
