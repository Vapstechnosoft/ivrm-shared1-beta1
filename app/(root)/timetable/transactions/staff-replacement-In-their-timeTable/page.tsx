'use client';

import { useState } from 'react';
// Ensure these paths are correct for your project structure
import Forms from './Components/Forms';
import TimeTableGrid from './Components/TimeTableGrid';

export default function StaffReplacementInTheirTimeTable() {
    // We use filterData to control the visibility and pass params to the grid
    const [filterData, setFilterData] = useState<any | null>(null);

    // This function updates the state when the "Report" button is clicked in the filter
    const handleFetch = (data: any) => {
        // If data is null (from Cancel button), it hides the grid
        // If data is present, it shows the grid and passes the values
        setFilterData(data);
    };

    return (
        <div className='space-y-6 p-4'>
            <div className='flex flex-col gap-1'>{/* You can add page titles or breadcrumbs here if needed */}</div>

            <div className='mt-4'>
                {/* 1. Pass the handleFetch function to the filter component */}
                <Forms onFetch={handleFetch} />
            </div>

            <div className='mt-4'>
                {/* 2. Conditional Rendering: Grid appears only when filterData is truthy */}
                {filterData && (
                    <div className='fade-in slide-in-from-top-4 animate-in duration-500'>
                        <TimeTableGrid params={filterData} />
                    </div>
                )}
            </div>
        </div>
    );
}
