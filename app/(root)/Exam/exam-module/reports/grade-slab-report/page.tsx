'use client';

import { useEffect, useRef, useState } from 'react';
import { ReportForm } from './_components/report-form';
import { ReportList } from './_components/report-list';

export default function GradeSlabReportPage() {
    const [reportData, setReportData] = useState<any[]>([]);
    const [institution, setInstitution] = useState<any>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const handleReportGenerated = (data: any[], inst: any) => {
        setReportData(data);
        setInstitution(inst);
    };

    const handleReset = () => {
        // Only trigger state update if there is data to clear
        if (reportData.length > 0) {
            setReportData([]);
            setInstitution(null);
        }
    };

    // Auto-scroll effect
    useEffect(() => {
        if (reportData.length > 0 && listRef.current) {
            // Slight delay to ensure DOM update
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
                {reportData.length > 0 && <ReportList data={reportData} institution={institution} />}
            </div>
        </div>
    );
}
