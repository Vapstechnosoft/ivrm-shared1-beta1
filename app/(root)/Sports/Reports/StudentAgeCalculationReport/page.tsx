'use client';

import type { IStudentAgeReport } from '@/types/sports/reports/student-age-calculation';
import { useState } from 'react';
import ReportForm from './_components/report-form';
import ReportGrid from './_components/report-grid';

export default function StudentAgeCalculationReportPage() {
    const [reportData, setReportData] = useState<IStudentAgeReport[] | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className='flex flex-col gap-6'>
            <ReportForm
                onReportGenerated={setReportData}
                onReset={() => setReportData(null)}
            />
            {reportData && (
                <ReportGrid
                    data={reportData}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                //manualPagination={false}
                />
            )}
        </div>
    );
}
