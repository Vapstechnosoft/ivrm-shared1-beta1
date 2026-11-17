'use client';

import type { IBMIReport } from '@/types/sports/reports/bmi-report';
import { useState } from 'react';
import ReportForm from './_components/report-form';
import ReportGrid from './_components/report-grid';

export default function BMIReportPage() {
    const [reportData, setReportData] = useState<IBMIReport[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className='flex flex-col gap-4 p-4'>
            <ReportForm setReportData={setReportData} />
            {reportData.length > 0 && (
                <ReportGrid
                    data={reportData}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    //manualPagination={false}
                />
            )}
        </div>
    );
}
