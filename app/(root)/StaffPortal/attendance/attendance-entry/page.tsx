
'use client';

import { Suspense } from 'react';
import AttendanceEntryForm from './_components/attendance-entry-form';

export default function AttendanceEntryPage() {
    return (
        <div className="container mx-auto p-4 space-y-6 min-h-screen">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Attendance Entry</h1>
            </div>

            <Suspense fallback={<div>Loading attendance entry...</div>}>
                <AttendanceEntryForm />
            </Suspense>
        </div>
    );
}
