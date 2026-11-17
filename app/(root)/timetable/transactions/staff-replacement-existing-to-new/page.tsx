'use client';

import { useStaffReplacementExistingToNewMasters } from '@/hooks/timetable/transaction/useStaff-replacement-existing-to-new';
import { useEffect, useState } from 'react';
import StaffReplacementExistingToNewForm from './components/form';
import TimetableGrid from './components/timetableGrid';

export default function StaffReplacementExcitingToNewPage() {
    const [filterData, setFilterData] = useState<any>(null);
    const { data: masters } = useStaffReplacementExistingToNewMasters();

    // Auto-load timetable with default values when masters are loaded
    useEffect(() => {
        if (!masters?.categories?.length || !masters?.staff?.length) return;

        const defaultData = {
            ttmC_Id: masters.categories[0]?.ttmC_Id?.toString() ?? '',
            hrmE_Id_From: masters.staff[0]?.hrmE_Id?.toString() ?? '',
            hrmE_Id_To: masters.staff[1]?.hrmE_Id?.toString() ?? masters.staff[0]?.hrmE_Id?.toString() ?? '',
            asmcL_Id: '',
            asms_Id: '',
            ismS_Id: ''
        };

        setFilterData(defaultData);
    }, [masters]);

    return (
        <div className='container mx-auto max-w-7xl space-y-8 p-4'>
            <StaffReplacementExistingToNewForm onFetch={setFilterData} />

            {filterData && (
                <div className='fade-in slide-in-from-bottom-4 animate-in space-y-8 duration-500'>
                    <TimetableGrid data={filterData} />
                </div>
            )}
        </div>
    );
}
