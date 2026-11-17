'use client';

import { useEffect, useRef, useState } from 'react';
import { ReportForm } from './_components/report-form';
import { ReportList } from './_components/report-list';

export default function ToppersListReportPage() {
    const [reportData, setReportData] = useState<any[]>([]);
    const [institution, setInstitution] = useState<any>(null);
    const [reportParams, setReportParams] = useState<any>(null); // Store params to know which table to show (Subjectwise vs Standard)
    const listRef = useRef<HTMLDivElement>(null);

    const handleReportGenerated = (data: any[], inst: any, params: any) => {
        setReportData(data);
        setInstitution(inst);
        setReportParams(params);
    };

    const handleReset = () => {
        if (reportData.length > 0) {
            setReportData([]);
            setInstitution(null);
            setReportParams(null);
        }
    };

    // Auto-scroll effect
    useEffect(() => {
        if (reportData.length > 0 && listRef.current) {
            const timer = setTimeout(() => {
                listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [reportData]);

    return (
        <div className='container mx-auto py-8'>
            <ReportForm onReportGenerated={handleReportGenerated} onReset={handleReset} />

            <div ref={listRef} className='mt-6 duration-300 ease-in-out'>
                {reportData.length > 0 && (
                    <ReportList
                        data={reportData}
                        institution={institution}
                        subjectwise={reportParams?.subjectwise}
                        reportParams={reportParams}
                    />
                )}
            </div>
        </div>
    );
}
