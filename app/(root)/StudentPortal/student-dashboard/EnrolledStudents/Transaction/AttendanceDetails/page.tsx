'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import AttendanceDetailsForm from './_components/attendance-details-form';
import AttendanceDetailsGrid from './_components/attendance-details-grid';
import AttendanceDetailsCharts from './_components/attendance-details-charts';
import {
    getAttendanceLoadData,
    getAttendanceData,
    AttendanceLoadData,
    AttendanceData
} from './actions';

export default function AttendanceDetailsPage() {
    const { status } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [years, setYears] = useState<{ asmaY_Id: number; asmaY_Year: string }[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [attendanceData, setAttendanceData] = useState<AttendanceData['attList']>([]);

    const loadInitialData = async () => {
        setIsLoading(true);
        try {
            const result: any = await getAttendanceLoadData({});
            if (result && result.attyearlist) {
                setYears(result.attyearlist as any[]);

                let defaultYearId = "";
                if (result.currentyear && result.currentyear.length > 0) {
                    defaultYearId = result.currentyear[0].asmaY_Id.toString();
                } else if (result.attyearlist.length > 0) {
                    defaultYearId = result.attyearlist[0].asmaY_Id.toString();
                }

                if (defaultYearId) {
                    setSelectedYear(defaultYearId);
                    // Fetch data for the default year
                    await fetchAttendanceData(parseInt(defaultYearId));
                }
            }
        } catch (error) {
            console.error("Failed to load initial data", error);
            toast.error("Failed to load academic years");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAttendanceData = async (yearId: number) => {
        setIsLoading(true);
        try {
            const result = await getAttendanceData({ ASMAY_Id: yearId });
            if (result && result.attList) {
                setAttendanceData(result.attList as any[]);
            } else {
                setAttendanceData([]);
                toast.info("No attendance record found for the selected year.");
            }
        } catch (error) {
            console.error("Failed to load attendance data", error);
            toast.error("Failed to load attendance details");
            setAttendanceData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (status !== 'loading') {
            loadInitialData();
        }
    }, [status]);

    const handleYearChange = (yearId: string) => {
        setSelectedYear(yearId);
        fetchAttendanceData(parseInt(yearId));
    };

    if (status === 'loading') {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Attendance Details</h2>
                <p className="text-muted-foreground">View your attendance records and analysis.</p>
            </div>

            <AttendanceDetailsForm
                years={years}
                selectedYear={selectedYear}
                onYearChange={handleYearChange}
            />

            {isLoading && attendanceData.length === 0 ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {attendanceData.length > 0 && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Attendance Record</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <AttendanceDetailsGrid data={attendanceData} />
                                </CardContent>
                            </Card>

                            <AttendanceDetailsCharts data={attendanceData} />
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
