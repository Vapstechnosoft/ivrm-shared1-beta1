'use client';
import { useEffect, useRef, useState } from 'react';
import { ReportForm } from './_components/report-form';
import { ReportList } from './_components/report-list';

export default function PromotionDetailsReportPage() {
    const [reportData, setReportData] = useState<any>(null);
    const [isSuperAverage, setIsSuperAverage] = useState(false);
    const listRef = useRef<HTMLDivElement>(null);

    const handleReportGenerated = (data: any, superAverage: boolean) => {
        setReportData(data);
        setIsSuperAverage(superAverage);
    };

    const handleReset = () => {
        if (reportData) {
            setReportData(null);
            setIsSuperAverage(false);
        }
    };

    // Auto-scroll effect
    useEffect(() => {
        if (reportData && listRef.current) {
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
                {reportData && (
                    <div className='fade-in slide-in-from-bottom-4 animate-in duration-500'>
                        <ReportList data={reportData} isSuperAverage={isSuperAverage} />
                    </div>
                )}
            </div>
        </div>
    );
}
