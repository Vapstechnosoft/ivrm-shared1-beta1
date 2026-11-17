'use client';

import { useState } from 'react';
import ReportForm from './_components/report-form';
import ReportGrid from './_components/report-grid';
import { ISportHouseCommitteeReport } from '@/types/sports/reports/sport-house-committee-report';

export default function SportHouseCommitteeReportPage() {
    const [reportData, setReportData] = useState<ISportHouseCommitteeReport[] | null>(null);
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
                />
            )}
        </div>
    );
}
