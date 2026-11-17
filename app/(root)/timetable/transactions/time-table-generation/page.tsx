'use client';

import type { TimeTableGenerationValues } from '@/schemas/timetable/transactions/time-table-generation';
import { useState } from 'react';
import Forms from './Components/Forms';
import TimeTableGenerationGrid from './Components/TimeTableGenerationGrid';

export default function TimeTableGenerationPage() {
    const [gridData, setGridData] = useState<any[] | null>(null);

    const handleGenerate = (data: TimeTableGenerationValues) => {
        // Logic to fetch data would go here.
        // implementing dummy data for visualization as requested.
        const dummyData = [
            {
                institutionName: 'St. Thomas School',
                academicYear: '2023-2024',
                categoryName: 'High School'
            },
            {
                institutionName: 'St. Thomas School',
                academicYear: '2023-2024',
                categoryName: 'Primary School'
            }
        ];
        setGridData(dummyData);
    };

    const handleReset = () => {
        setGridData(null);
    };

    return (
        <div className='space-y-6 p-4'>
            <Forms onGenerate={handleGenerate} onReset={handleReset} />

            {gridData && (
                <div className='fade-in slide-in-from-top-4 animate-in duration-500'>
                    <TimeTableGenerationGrid data={gridData} />
                </div>
            )}
        </div>
    );
}
