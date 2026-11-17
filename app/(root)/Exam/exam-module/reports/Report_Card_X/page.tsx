'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ReportForm } from './_components/report-form';
import { ReportList } from './_components/report-list';

export default function ReportCardXPage() {
    const [reportData, setReportData] = useState<any>(null);
    const [reportParams, setReportParams] = useState<any>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const handleReportGenerated = (data: any, params: any) => {
        setReportData(data);
        setReportParams(params);
    };

    const handleReset = () => {
        setReportData(null);
        setReportParams(null);
    };

    // Auto-scroll when data loads
    useEffect(() => {
        if (reportData && listRef.current) {
            setTimeout(() => {
                listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, [reportData]);

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div className="no-print">
                <ReportForm onReportGenerated={handleReportGenerated} onReset={handleReset} />
            </div>

            <div ref={listRef} className="transition-all duration-300">
                {reportData && (
                    <ReportList data={reportData} params={reportParams} />
                )}
            </div>
        </div>
    );
}
