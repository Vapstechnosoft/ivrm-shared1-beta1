'use client';

import React, { useState } from 'react';
import { useCumulativeReport } from '@/hooks/staff-portal/useCumulativeReport';
import CumulativeReportFilter from './_components/cumulative-report-filter';
import CumulativeReportGrid from './_components/cumulative-report-grid';
import { toast } from 'sonner';
import type { IReportResponse, ISearchRequest } from '@/types/staff-portal/cumulative-report';

export default function CumulativeReportPage() {
    const {
        initialData,
        isLoadingInitial,
        getClasses,
        getSections,
        getExams,
        getReport
    } = useCumulativeReport();

    const [reportData, setReportData] = useState<IReportResponse | null>(null);
    const [lastSearchParams, setLastSearchParams] = useState<any>(null);

    const handleSearch = (params: ISearchRequest) => {
        // Store display flags from params or separate state if they were part of params
        setLastSearchParams(params);
        setReportData(null);

        getReport.mutate(params, {
            onSuccess: (res) => {
                if (res.data && res.data.savelist && res.data.savelist.length > 0) {
                    setReportData(res.data);
                } else {
                    toast.warning("No records found for the selected criteria");
                    setReportData(null);
                }
            },
            onError: (err) => {
                console.error(err);
                toast.error("Failed to generate report");
            }
        });
    };

    const handleReset = () => {
        setReportData(null);
        setLastSearchParams(null);
    };

    if (isLoadingInitial) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4 space-y-6 min-h-screen">
            <div className="flex items-center justify-between print:hidden">
                <h1 className="text-2xl font-bold tracking-tight text-primary">Cumulative Report</h1>
            </div>

            <div className="print:hidden">
                <CumulativeReportFilter
                    initialData={initialData}
                    isLoading={getReport.isPending}
                    onSearch={handleSearch}
                    onReset={handleReset}
                    getClasses={async (id) => (await getClasses.mutateAsync(id)).data?.classlist ?? []}
                    getSections={async (y, c) => (await getSections.mutateAsync({ asmaY_Id: y, asmcL_Id: c })).data?.seclist ?? []}
                    getExams={async (data) => {
                        const res = await getExams.mutateAsync(data);
                        return { // Ensure we return default arrays if undefined
                            exmstdlist: res.data?.exmstdlist ?? [],
                            studentlist: res.data?.studentlist ?? []
                        };
                    }}
                />
            </div>

            {reportData && (
                <div className="animate-in fade-in zoom-in duration-300">
                    <CumulativeReportGrid
                        data={reportData}
                        searchParams={lastSearchParams}
                    />
                </div>
            )}
        </div>
    );
}
