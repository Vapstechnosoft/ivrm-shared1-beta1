'use client';

import { useState } from 'react';
import ReportForm from './_components/report-form';
import ReportGrid from './_components/report-grid';
import { IMonthEndReportData, MonthEndReportFormSchema } from '@/types/sports/reports/month-end-report';

export default function MonthEndReportPage() {
    const [reportData, setReportData] = useState<IMonthEndReportData | null>(null);
    const [formData, setFormData] = useState<MonthEndReportFormSchema | null>(null);

    return (
        <div className='flex flex-col gap-4 p-4'>
            <ReportForm setReportData={setReportData} setFormData={setFormData} />
            {reportData && (
                <ReportGrid
                    data={reportData}
                    formData={formData}
                />
            )}
        </div>
    );
}
