'use client';

// import { CollapsibleSection } from "@/components/ui/form/collapsible-section";
// import { StaffPeriodTransferValues } from "@/schemas/timetable/transactions/staffPeriodTransfer";
import { useStaffPeriodTransferMasters } from '@/hooks/timetable/transaction/useStaffPeriodTransfer';
import { useState } from 'react';
// Ensure these paths match your actual file names exactly
import StaffPeriodTransferForm from './components/StaffPeriodTransferForm';
import StaffPeriodTransferReport from './components/StaffPeriodTransferReport';

export default function StaffPeriodTransferPage() {
    // Use the interface to avoid 'any' errors
    const [filterData, setFilterData] = useState<any>(null);
    // const [reportData, setReportData] = useState<any>(null);
    const { data: masters } = useStaffPeriodTransferMasters();

    return (
        <div className='container mx-auto max-w-7xl space-y-8 p-4'>
            <StaffPeriodTransferForm onFetch={setFilterData} />

            {filterData && (
                <div className='fade-in slide-in-from-bottom-4 animate-in space-y-8 duration-500'>
                    <StaffPeriodTransferReport data={filterData} />
                </div>
            )}
        </div>
    );
}
