
'use client';

import { Suspense } from 'react';
import ReportFilters from './_components/report-filters';

export default function StudentAttendanceReportPage() {
    return (
        <div className="container mx-auto p-4 space-y-6 min-h-screen">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Student Attendance Report</h1>
            </div>

            <Suspense fallback={<div>Loading report filters...</div>}>
                <ReportFilters />
            </Suspense>
        </div>
    );
}
