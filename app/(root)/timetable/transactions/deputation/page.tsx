'use client';

import { useDeputationMasters } from '@/hooks/timetable/transaction/useDeputation';
import { useState } from 'react';
import DeputationAssignmentTable from './components/deputationAssignmentTable';
import DeputationForm from './components/deputationForm';
import DeputationReport from './components/deputationReport';

export default function DeputationPage() {
    const [reportData, setReportData] = useState<any>(null);
    const { data: masters } = useDeputationMasters();

    return (
        <div className='container mx-auto max-w-7xl space-y-8 p-4'>
            <DeputationForm onFetch={setReportData} />

            {reportData && (
                <div className='fade-in slide-in-from-bottom-4 animate-in space-y-8 duration-500'>
                    <DeputationReport data={reportData} />
                    <DeputationAssignmentTable data={reportData} masters={masters} />
                </div>
            )}
        </div>
    );
}
