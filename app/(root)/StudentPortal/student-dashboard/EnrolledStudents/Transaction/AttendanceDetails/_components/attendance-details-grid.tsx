'use client';

import { DataTable } from '@/components/ui/data-table/data-table';
import { attendanceColumns, AttendanceRecord } from './columns';

interface AttendanceDetailsGridProps {
    data: AttendanceRecord[];
}

export default function AttendanceDetailsGrid({ data }: AttendanceDetailsGridProps) {
    return (
        <DataTable
            columns={attendanceColumns}
            data={data}
            totalItems={data.length}
            isSearchRequired={false}
            isPaginationRequired={false} // Attendance usually fits in one page, but enable if needed
            showExportOptions={false}
            showViewOptions={false}
            isLoading={false}
        />
    );
}
