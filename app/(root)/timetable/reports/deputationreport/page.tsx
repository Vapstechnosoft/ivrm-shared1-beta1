'use client';
import DeputationReportForm from './_components/deputation-report-form';

export default function DeputationReportPage() {
    return (
        <div className='container space-y-4 p-1'>
            <div className='scrollbar-none h-[calc(100vh-4rem)] overflow-auto p-4'>
                {/* <h2 className='mb-6 font-bold text-3xl'>Deputation Report</h2> */}
                <div className='rounded-lg border bg-background p-6 shadow-sm'>
                    <DeputationReportForm />
                </div>
            </div>
        </div>
    );
}
