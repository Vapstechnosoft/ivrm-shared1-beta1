'use client';

import { useState } from 'react';
import ReportForm from './_components/report-form';
import { Card, CardContent } from '@/components/ui/card';

export default function SportsYearEndReportPage() {
    // Placeholder for when report data is available
    const [reportData, setReportData] = useState<any>(null);

    return (
        <div className='flex flex-col gap-6'>
            <ReportForm
                onReportGenerated={setReportData}
                onReset={() => setReportData(null)}
            />

            {/* Placeholder Grid until API is provided */}
            {reportData && (
                <Card>
                    <CardContent className="pt-6 text-center">
                        <h2 className="text-xl font-semibold text-muted-foreground">Report Generation Implementation Pending API</h2>
                        <p>Selected Filter Data: {JSON.stringify(reportData)}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
