import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DayPeriodTab from './_components/day-period-tab';
import DayStaffTab from './_components/day-staff-tab';
import DaySubjectTab from './_components/day-subject-tab';
import PeriodStaffTab from './_components/period-staff-tab';
import PeriodSubjectTab from './_components/period-subject-tab';

import { getFixingLoadData } from '@/server/timetable/constraints/fixing';

export default async function FixingConstraintsPage() {
    const loadData = await getFixingLoadData();
    return (
        <div className='container mx-auto space-y-6 p-4'>
            {/* <div className='flex flex-col gap-2'>
                <h1 className='font-bold text-2xl tracking-tight'>Fixing Constraints</h1>
                <p className='text-muted-foreground'>Manage fixing constraints for periods, staff, and subjects.</p>
            </div> */}

            <Tabs defaultValue='day_period' className='space-y-4'>
                <TabsList className='grid h-auto w-full grid-cols-5 rounded-lg bg-muted p-1'>
                    <TabsTrigger value='day_period'>Day Period</TabsTrigger>
                    <TabsTrigger value='day_staff'>Day Staff</TabsTrigger>
                    <TabsTrigger value='day_subject'>Day Subject</TabsTrigger>
                    <TabsTrigger value='period_staff'>Period Staff</TabsTrigger>
                    <TabsTrigger value='period_subject'>Period Subject</TabsTrigger>
                </TabsList>

                <TabsContent value='day_period'>
                    <DayPeriodTab initialData={loadData} />
                </TabsContent>

                <TabsContent value='day_staff'>
                    <DayStaffTab initialData={loadData} />
                </TabsContent>

                <TabsContent value='day_subject'>
                    <DaySubjectTab initialData={loadData} />
                </TabsContent>

                <TabsContent value='period_staff'>
                    <PeriodStaffTab initialData={loadData} />
                </TabsContent>

                <TabsContent value='period_subject'>
                    <PeriodSubjectTab initialData={loadData} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
