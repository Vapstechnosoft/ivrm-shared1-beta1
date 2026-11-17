'use client';

import { useState } from 'react';
import ReportForm from './_components/report-form';
import ReportGrid from './_components/report-grid';
import { IPointsRecordReportData, PointsRecordReportFormSchema } from '@/types/sports/reports/points-record-report';

export default function PointsRecordReportPage() {
    const [reportData, setReportData] = useState<IPointsRecordReportData[] | null>(null);
    const [formData, setFormData] = useState<PointsRecordReportFormSchema | null>(null);

    return (
        <div className='flex flex-col gap-4 p-4'>
            <ReportForm setReportData={setReportData} setFormData={setFormData} />
            {reportData && reportData.length > 0 && (
                <ReportGrid
                    data={reportData}
                    formData={formData}
                />
            )}
        </div>
    );
}
