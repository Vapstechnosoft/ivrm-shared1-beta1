'use client';

import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useState } from 'react';
import ManualPeriodInsertionForm from './components/ManualPeriodInsertionForm';
import ManualPeriodInsertionReport from './components/ManualPeriodInsertionReport';

export default function ManualPeriodInsertionPage() {
    const [filterData, setFilterData] = useState<any>(null);

    return (
        <div className='container mx-auto max-w-7xl space-y-8 p-4'>
            {/* Header */}

            <ManualPeriodInsertionForm onFetch={setFilterData} />

            {filterData && (
                <div className='fade-in slide-in-from-bottom-4 animate-in pb-10 duration-500'>
                    <CollapsibleSection
                        title='Timetable Grid'
                        defaultOpen
                        className='overflow-hidden rounded-2xl border-none bg-white shadow-xl'>
                        <ManualPeriodInsertionReport data={filterData} />
                    </CollapsibleSection>
                </div>
            )}
        </div>
    );
}
