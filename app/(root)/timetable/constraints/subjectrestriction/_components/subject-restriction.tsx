'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import DayPeriodTab from './tabs/day-period-tab';
import DayStaffTab from './tabs/day-staff-tab';
import DaySubjectTab from './tabs/day-subject-tab';
import PeriodStaffTab from './tabs/period-staff-tab';
import PeriodSubjectTab from './tabs/period-subject-tab';

interface SubjectRestrictionProps {
    initialData: any;
}

export default function SubjectRestriction({ initialData }: SubjectRestrictionProps) {
    const [activeTab, setActiveTab] = useState('day_period');

    return (
        <div className='container mx-auto space-y-6 p-4'>
            {/* <Container> */}
            <Tabs defaultValue='day_period' value={activeTab} onValueChange={setActiveTab}>
                {/* <div className='mb-4 flex items-center justify-between'>
                    <h2 className='font-bold text-2xl tracking-tight'>Subject Restriction</h2>
                </div> */}
                <TabsList className='grid h-full w-full grid-cols-5 bg-white p-1 shadow-sm'>
                    <TabsTrigger value='day_period'>Day Period</TabsTrigger>
                    <TabsTrigger value='day_staff'>Day Staff</TabsTrigger>
                    <TabsTrigger value='day_subject'>Day Subject</TabsTrigger>
                    <TabsTrigger value='period_staff'>Period Staff</TabsTrigger>
                    <TabsTrigger value='period_subject'>Period Subject</TabsTrigger>
                </TabsList>
                <div className='mt-4'>
                    <TabsContent value='day_period'>
                        <DayPeriodTab initialData={initialData} />
                    </TabsContent>
                    <TabsContent value='day_staff'>
                        <DayStaffTab initialData={initialData} />
                    </TabsContent>
                    <TabsContent value='day_subject'>
                        <DaySubjectTab initialData={initialData} />
                    </TabsContent>
                    <TabsContent value='period_staff'>
                        <PeriodStaffTab initialData={initialData} />
                    </TabsContent>
                    <TabsContent value='period_subject'>
                        <PeriodSubjectTab initialData={initialData} />
                    </TabsContent>
                </div>
            </Tabs>
            {/* </Container> */}
        </div>
    );
}
