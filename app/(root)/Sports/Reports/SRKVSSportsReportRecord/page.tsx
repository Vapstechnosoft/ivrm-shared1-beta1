'use client';

import { useState } from 'react';
import { ReportForm } from './_components/report-form';
import { ReportGrid } from './_components/report-grid';
import { ISRKVSReportData } from '@/types/sports/reports/srkvs-sports-report-record';

export default function SRKVSSportsReportRecordPage() {
    const [reportData, setReportData] = useState<ISRKVSReportData[]>([]);
    const [reportType, setReportType] = useState<string>('Record');

    return (
        <div className="space-y-6">
            <ReportForm
                onReportGenerated={setReportData}
                onTypeChange={setReportType}
            />
            <ReportGrid
                data={reportData}
                type={reportType}
            />
        </div>
    );
}
