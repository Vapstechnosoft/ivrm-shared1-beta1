'use client';

import React, { useState } from 'react';
import { useAttendanceReport } from '@/hooks/staff-portal/useAttendanceReport';
import AttendanceFilter from './_components/attendance-filter';
import AttendanceGrid from './_components/attendance-grid';
import type { IAttendanceReportResponse, IAttendanceReportSearch } from '@/types/staff-portal/attendance-report';
import { toast } from 'sonner';

export default function AttendanceReportPage() {
    const {
        initialData,
        isLoadingInitial,
        getClasses,
        getSections,
        getReport
    } = useAttendanceReport();

    const [reportData, setReportData] = useState<IAttendanceReportResponse | null>(null);
    const [selectedYearName, setSelectedYearName] = useState<string>('');

    const handleSearch = (params: IAttendanceReportSearch) => {
        setReportData(null);

        // Find selected year name for display
        const year = initialData?.academicList.find((y: { asmaY_Id: number; }) => y.asmaY_Id === params.ASMAY_Id);
        if (year) setSelectedYearName(year.asmaY_Year);

        getReport.mutate(params, {
            onSuccess: (res) => {
                if (res?.data?.studentAttendanceList && res.data.studentAttendanceList.length > 0) {
                    setReportData(res.data);
                } else {
                    toast.warning("No records found");
                    setReportData(null);
                }
            }
        });
    };

    const handleReset = () => {
        setReportData(null);
        setSelectedYearName('');
    };

    if (isLoadingInitial) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4 space-y-6 min-h-screen">
            <div className="flex items-center justify-between print:hidden">
                <h1 className="text-2xl font-bold tracking-tight text-primary">100% Attendance Report</h1>
            </div>

            <div className="print:hidden">
                <AttendanceFilter
                    initialData={initialData ?? undefined}
                    isLoading={getReport.isPending}
                    onSearch={handleSearch}
                    onReset={handleReset}
                    getClasses={async (data) => (await getClasses.mutateAsync(data)).data?.classlist ?? []}
                    getSections={async (data) => (await getSections.mutateAsync(data)).data?.sectionList ?? []}
                />
            </div>

            {reportData && (
                <div className="animate-in fade-in zoom-in duration-300">
                    <AttendanceGrid
                        data={reportData}
                        yearName={selectedYearName}
                    />
                </div>
            )}
        </div>
    );
}
