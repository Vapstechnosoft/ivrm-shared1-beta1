'use client';

import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useAttendanceDetails } from '@/hooks/student-portal/masters/useAttendanceDetails';
import type { IApiResponse, IAttendanceData, IAttendanceGraphData } from '@/types/student-portal/masters/attendance-details';
import { useEffect, useState } from 'react'; // Added useEffect
import { FormProvider } from 'react-hook-form';
import { toast } from 'sonner';
import { AttendanceCharts } from './_components/attendance-charts';
import { AttendanceFilter } from './_components/attendance-filter';
import { AttendanceTable } from './_components/attendance-table';

export default function AttendanceDetailsPage() {
    const { form, initialData, isInitialLoading, getAttendanceData } = useAttendanceDetails();
    const [attendanceData, setAttendanceData] = useState<IAttendanceData[]>([]);
    const [graphData, setGraphData] = useState<{
        bar: IAttendanceGraphData[];
        area: IAttendanceGraphData[];
        classHeld: IAttendanceGraphData[];
    }>({ bar: [], area: [], classHeld: [] });
    const [showDetails, setShowDetails] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchAttendanceData = async (yearId?: string) => {
        setIsLoading(true);
        try {
            const selectedYearId = yearId || initialData?.data?.[0]?.amsT_Id?.toString();

            if (!selectedYearId) {
                setShowDetails(false);
                setIsLoading(false);
                return;
            }

            // @ts-ignore
            const response = await getAttendanceData({
                // ASMAY_Id: number(selectedYearId),
                //AMST_Id: 123
            });

            console.log('API Response:', response);

            const result = response as unknown as IApiResponse<IAttendanceData[]>;

            if (result?.data && result.data.length > 0) {
                setAttendanceData(result.data);

                // Process chart data
                const bar: IAttendanceGraphData[] = [];
                const classHeld: IAttendanceGraphData[] = [];

                result.data.forEach((ag: IAttendanceData) => {
                    bar.push({
                        label: ag.month_name.trim(),
                        y: ag.total_present
                    });
                    classHeld.push({
                        label: ag.month_name.trim(),
                        y: ag.class_held
                    });
                });

                setGraphData({
                    bar,
                    area: bar,
                    classHeld: classHeld
                });
                setShowDetails(true);
            } else {
                setAttendanceData([]);
                setShowDetails(false);
                toast.info('No Record Found....');
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Failed to fetch attendance data');
            setShowDetails(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Load data on initial render
    useEffect(() => {
        if (initialData?.data && initialData.data.length > 0) {
            fetchAttendanceData();
        }
    }, [initialData]); // Added dependency on initialData

    const handleYearChange = async (yearId: string) => {
        if (!yearId) {
            setShowDetails(false);
            return;
        }
        await fetchAttendanceData(yearId);
    };

    if (isInitialLoading) {
        return <div className='p-4'>Loading initial data...</div>;
    }

    return (
        <div className='min-h-screen p-4'>
            <div className='container space-y-4'>
                <h3 className='mb-4 font-bold text-2xl text-primary'>Attendance Details</h3>

                <FormProvider {...form}>
                    <CollapsibleSection title='Selection' defaultOpen={true} variant='default'>
                        <AttendanceFilter yearList={initialData?.data || []} onYearChange={handleYearChange} />
                    </CollapsibleSection>
                </FormProvider>

                {isLoading && <div className='p-4 text-center'>Loading attendance data...</div>}

                {showDetails && !isLoading && (
                    <>
                        <CollapsibleSection title='Attendance Grid' defaultOpen={true} variant='default'>
                            <AttendanceTable data={attendanceData} />
                        </CollapsibleSection>

                        <AttendanceCharts barData={graphData.bar} areaData={graphData.area} classHeldData={graphData.classHeld} />
                    </>
                )}

                {!showDetails && !isLoading && Array.isArray(initialData?.data) && initialData?.data?.length > 0 && (
                    <div className='p-4 text-center text-muted-foreground'>Select a year to view attendance details</div>
                )}

                {!showDetails && !isLoading && (!initialData?.data || initialData.data.length === 0) && (
                    <div className='p-4 text-center text-muted-foreground'>No academic years available</div>
                )}
            </div>
        </div>
    );
}
