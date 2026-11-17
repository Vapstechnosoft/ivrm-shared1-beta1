'use client';

import { useState } from 'react';
import { ReportForm } from './_components/record-report-form';
import { ReportGrid } from './_components/record-report-grid';
import { IPointsRecordReportData } from '@/types/sports/reports/points-record-report';

export default function SportPointsAndRecordReportPage() {
    const [reportData, setReportData] = useState<IPointsRecordReportData[]>([]);

    return (
        <div className="space-y-6">
            <ReportForm
                onReportGenerated={setReportData}
            />
            <ReportGrid
                data={reportData}
            />
        </div>
    );
}
