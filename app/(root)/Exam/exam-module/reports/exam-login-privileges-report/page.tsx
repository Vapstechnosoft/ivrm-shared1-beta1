'use client';
import { useEffect, useRef, useState } from 'react';
import { ReportForm } from './_components/report-form';
import { ReportList } from './_components/report-list';

export default function ExamLoginPrivilegesReportPage() {
    const [reportData, setReportData] = useState<any[]>([]);
    const listRef = useRef<HTMLDivElement>(null);

    const handleReportGenerated = (data: any[]) => {
        setReportData(data);
    };

    const handleReset = () => {
        if (reportData.length > 0) {
            setReportData([]);
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
        <div className='container mx-auto space-y-6 py-6 transition-all duration-500 ease-in-out'>
            <ReportForm onReportGenerated={handleReportGenerated} onReset={handleReset} />

            <div ref={listRef} className='mt-6 duration-300 ease-in-out'>
                {reportData.length > 0 && (
                    <div className='fade-in slide-in-from-bottom-4 animate-in duration-500'>
                        <ReportList data={reportData} />
                    </div>
                )}
            </div>
        </div>
    );
}
