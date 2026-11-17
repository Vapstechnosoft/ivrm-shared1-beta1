'use client';

import { useState } from 'react';
import ReportForm from './_components/report-form';
import ReportGrid from './_components/report-grid';
import { IHouseInchargeReportData } from './types';

export default function HouseInchargeReportPage() {
    const [reportData, setReportData] = useState<IHouseInchargeReportData[] | null>(null);
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
